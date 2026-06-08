import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import { verifyTokenAndGetUser } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
    name: string;
    vendorId?: string;
  };
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest) => {
    try {
      const token = req.cookies.get('auth_token')?.value;

      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      const user = await verifyTokenAndGetUser(token);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found or inactive' },
          { status: 401 }
        );
      }

      req.user = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        vendorId: user.vendor?.id,
      };

      return handler(req);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

export function withAdmin(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (req.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }
    return handler(req);
  });
}

export function withVendor(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (req.user?.role !== 'VENDOR') {
      return NextResponse.json(
        { success: false, error: 'Vendor access required' },
        { status: 403 }
      );
    }
    return handler(req);
  });
}

export function withCustomer(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (req.user?.role !== 'CUSTOMER') {
      return NextResponse.json(
        { success: false, error: 'Customer access required' },
        { status: 403 }
      );
    }
    return handler(req);
  });
}

export function withRole(role: string, handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (req.user?.role !== role) {
      return NextResponse.json(
        { success: false, error: `${role} access required` },
        { status: 403 }
      );
    }
    return handler(req);
  });
}

/**
 * Error response helper
 */
export function errorResponse(message: string, status: number = 400, code?: string, details?: Record<string, any>) {
  return NextResponse.json({ success: false, error: message, code, ...(details && { details }) }, { status });
}

/**
 * Success response helper
 */
export function successResponse(data: any, message?: string, status: number = 200) {
  return NextResponse.json({ success: true, data, message }, { status });
}

/**
 * Set auth cookie
 */
export function setAuthCookie(token: string, response: NextResponse) {
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return response;
}

/**
 * Clear auth cookie
 */
export function clearAuthCookie(response: NextResponse) {
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  return response;
}