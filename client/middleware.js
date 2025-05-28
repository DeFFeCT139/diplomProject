import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const protectedRoutes = {
  '/dashboard/history': ['МАNAGER', 'ADMIN', 'CASHIER'],
  '/dashboard/fatchOrders': ['LOADER', 'ADMIN'],
  '/dashboard/discharge': ['LOADER', 'ADMIN'],
  '/dashboard/out-packages': ['ADMIN', 'CASHIER'],
  '/dashboard/add-packages': ['ADMIN', 'CASHIER'],
  '/dashboard/users': ['HR', 'МАNAGER', 'ADMIN', 'ACCOUMTANT'],
  '/dashboard/attendance': ['HR', 'МАNAGER', 'ADMIN', 'ACCOUMTANT'],
  '/dashboard/statistics': ['МАNAGER', 'ADMIN', 'ACCOUMTANT'],
};

// Определяем доступные страницы для каждой роли
const roleDefaultPages = {
  ADMIN: '/dashboard/statistics',
  МАNAGER: '/dashboard/history',
  CASHIER: '/dashboard/out-packages',
  LOADER: '/dashboard/fatchOrders',
  HR: '/dashboard/users',
  ACCOUMTANT: '/dashboard/statistics'
};

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      if (!allowedRoles.includes(token.role)) {
        const defaultPage = roleDefaultPages[token.role] || '/dashboard';
        return NextResponse.redirect(new URL(defaultPage, req.url));
      }
      
      break;
    }
  }

  return NextResponse.next();
}