import { NextResponse } from "next/server";

export const GET = () => NextResponse.json({ error: "NextAuth endpoints removed. Use Supabase auth endpoints at /api/auth." }, { status: 410 });
export const POST = GET;
