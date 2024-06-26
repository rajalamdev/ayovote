import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server'

export { default } from 'next-auth/middleware'

export const config = { matcher: ['/vote/:path*', '/participant', '/participant/:path*'] }