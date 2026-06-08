import { NextResponse } from 'next/server';
import { withAuth, successResponse, errorResponse, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { updateUserProfileSchema } from '@/lib/validation';
import { cleanObject } from '@/lib/utils';

/**
 * GET /api/users/me
 * Get current authenticated user profile with vendor info
 */
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return errorResponse('User not authenticated', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        dob: true,
        locale: true,
        verified: true,
        kycStatus: true,
        kycApprovedAt: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        vendor: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
            tier: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse('User not found', 404);
    }

    if (user.status !== 'ACTIVE') {
      return errorResponse('Account is inactive', 403);
    }

    return successResponse(user, 'User profile retrieved successfully');
  } catch (error) {
    console.error('Get current user error:', error);
    return errorResponse('Failed to retrieve user profile', 500);
  }
});

/**
 * PUT /api/users/me
 * Update current user profile
 */
export const PUT = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return errorResponse('User not authenticated', 401);
    }

    const body = await req.json();
    const validation = updateUserProfileSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation failed', 400, 'VALIDATION_ERROR', 
        Object.fromEntries(
          validation.error.errors.map(e => [e.path.join('.'), e.message])
        )
      );
    }

    const updateData = cleanObject(validation.data);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        dob: true,
        locale: true,
        verified: true,
        kycStatus: true,
        status: true,
        updatedAt: true,
      },
    });

    return successResponse(updatedUser, 'Profile updated successfully');
  } catch (error) {
    console.error('Update user profile error:', error);
    return errorResponse('Failed to update profile', 500);
  }
});
