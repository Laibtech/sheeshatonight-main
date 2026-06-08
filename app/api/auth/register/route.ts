import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';
import { setAuthCookie, errorResponse, successResponse } from '@/lib/middleware';
import { registerSchema, formatZodErrors } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, createAuditLog } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting: 10 registrations per hour
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(ip, 'register', 10, 60 * 60 * 1000);
    
    if (!rateLimitResult.success) {
      return errorResponse('Too many registration attempts. Try again later.', 429);
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      const errors = formatZodErrors(validation.error.errors);
      return errorResponse('Validation failed', 400, undefined, errors);
    }

    const { name, email, password, phone } = validation.data;

    // Check for existing user with same email or phone
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, ...(phone ? [{ phone }] : [])],
      },
    });

    if (existingUser) {
      return errorResponse(
        existingUser.email === email ? 'Email already registered' : 'Phone already registered',
        409
      );
    }

    // Hash password with bcrypt (12 rounds as per requirements)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: 'CUSTOMER', // Default role
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create audit log entry
    await createAuditLog(
      user.id,
      'USER_REGISTERED',
      'User',
      user.id,
      null,
      { email: user.email, role: user.role },
      request
    );

    // Return success response with user data (excluding password)
    const response = successResponse(
      { user },
      'Registration successful',
      201
    );

    // Set HttpOnly secure cookie with JWT token
    return setAuthCookie(token, response);
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse('Registration failed', 500);
  }
}
