import { NextRequest } from 'next/server';

export function getCurrentUser(request: NextRequest) {
  const userCookie = request.cookies.get('test_user')?.value;

  if (!userCookie) {
    return null;
  }

  try {
    const user = JSON.parse(userCookie);
    return user;
  } catch {
    return null;
  }
}

export function requireAuth(request: NextRequest) {
  const user = getCurrentUser(request);

  if (!user) {
    throw new Error('UNAUTHORIZED');
  }

  return user;
}
