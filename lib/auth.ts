import { cookies } from 'next/headers';
import { verifyToken, JWTPayload } from './jwt';
import { prisma } from './prisma';

export async function verifyTokenAndGetUser(token: string) {
  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      vendor: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!user || user.status !== 'ACTIVE') {
    return null;
  }

  return user;
}

export async function getAuthToken() {
  const cookieStore = cookies();
  return cookieStore.get('auth_token')?.value;
}

export async function getCurrentUser() {
  const token = await getAuthToken();
  if (!token) {
    return null;
  }
  return verifyTokenAndGetUser(token);
}
