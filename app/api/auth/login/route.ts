import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';
import { setAuthCookie, errorResponse, successResponse } from '@/lib/middleware';
import { loginSchema, formatZodErrors } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, createAuditLog } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting: 5 login attempts per 15 minutes
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(ip, 'login', 5, 15 * 60 * 1000);
    
    if (!rateLimitResult.success) {
      return errorResponse('Too many login attempts. Try again later.', 429);
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      const errors = formatZodErrors(validation.error.errors);
      return errorResponse('Validation failed', 400, undefined, errors);
    }

    const { email, password } = validation.data;

    // Lookup user by email with vendor info
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        status: true,
        verified: true,
        kycStatus: true,
        vendor: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
          },
        },
      },
    });

    // User not found - log failed attempt
    if (!user) {
      await createAuditLog(
        'unknown',
        'LOGIN_FAILED',
        'User',
        email,
        null,
        { reason: 'User not found', ip },
        request
      );
      return errorResponse('Invalid email or password', 401);
    }

    // Account inactive - log failed attempt
    if (user.status !== 'ACTIVE') {
      await createAuditLog(
        user.id,
        'LOGIN_FAILED',
        'User',
        user.id,
        null,
        { reason: 'Account inactive', ip },
        request
      );
      return errorResponse('Account is inactive', 403);
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Log failed password attempt
      await createAuditLog(
        user.id,
        'LOGIN_FAILED',
        'User',
        user.id,
        null,
        { reason: 'Invalid password', ip },
        request
      );
      return errorResponse('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Log successful login
    await createAuditLog(
      user.id,
      'LOGIN_SUCCESS',
      'User',
      user.id,
      null,
      { ip, userAgent: request.headers.get('user-agent') },
      request
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Return success response
    const response = successResponse(
      { user: userWithoutPassword },
      'Login successful'
    );

    // Set HttpOnly secure cookie with JWT token
    return setAuthCookie(token, response);
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Login failed', 500);
  }
}
