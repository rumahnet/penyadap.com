import { NextResponse, NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/proxy";

export async function middleware(request: NextRequest) {
  // Proxy request to refresh auth cookies & keep server/client sessions in sync.
  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};