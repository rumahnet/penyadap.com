import { NextResponse } from "next/server";

// TEST AUTH ENDPOINT REMOVED
// This endpoint previously performed a direct DB-based auth check for local testing.
// The project now uses Supabase for authentication in both local and production.
// If you see calls to /api/test-auth, replace them with the Supabase sign-in flow.

export async function POST() {
  return NextResponse.json({ error: "Test auth endpoint removed" }, { status: 410 });
}
