import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 14 Edge Runtime Middleware
 * 
 * IMPORTANT: Middleware runs in Edge Runtime and CANNOT use:
 * - @supabase/supabase-js or @supabase/ssr
 * - next/headers (cookies(), headers())
 * - Any Node.js APIs
 * 
 * Auth logic must be handled in:
 * - Server Components (via lib/session.ts)
 * - Route Handlers with runtime = "nodejs"
 */
export function middleware(request: NextRequest) {
  // Middleware is currently not needed for auth routing.
  // Auth protection is handled in protected layouts and route handlers.
  // Just pass the request through.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
