/**
 * Proxy route example for Next 16 migration
 *
 * This file is an example and is intentionally placed under
 * `app/proxy-example/route.ts` so it does NOT get registered as a route.
 * To enable a Proxy route, copy this file to `app/proxy/route.ts` and
 * uncomment the `await updateSession(request)` line below if you want
 * per-request Supabase cookie/session sync behavior.
 *
 * IMPORTANT:
 * - Do NOT enable this unless you want the side-effect of calling
 *   `lib/supabase/proxy.ts::updateSession` on every matched request.
 * - This template preserves behavior parity with the previous middleware
 *   only when you explicitly enable it.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export const runtime = "edge";

export default async function handler(request: NextRequest) {
  // Call updateSession to refresh Supabase claims / set cookies into response.
  // Only uncomment if you want this side-effect on request handling.
  // await updateSession(request);

  return NextResponse.next();
}
