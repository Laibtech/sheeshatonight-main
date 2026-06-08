import { NextResponse } from 'next/server';
import { withAdmin, successResponse, errorResponse, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { formatPaginatedResponse } from '@/lib/utils';

/**
 * GET /api/users
 * Get all users (admin only)
 */
export const GET = withAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20')));
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const skip = (page - 1) * pageSize;

    // Build filter conditions
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role && ['CUSTOMER', 'VENDOR', 'ADMIN'].includes(role)) {
      where.role = role;
    }
    if (status && ['ACTIVE', 'INACTIVE'].includes(status)) {
      where.status = status;
    }

    // Fetch users and count
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          verified: true,
          kycStatus: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json(
      formatPaginatedResponse(users, page, pageSize, total, 'Users retrieved successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get users error:', error);
    return errorResponse('Failed to fetch users', 500);
  }
});
