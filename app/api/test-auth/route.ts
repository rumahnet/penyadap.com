import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    console.log("[TEST-AUTH] Testing login with:", { email, password: "***" });

    // Get user
    const user = await getUserByEmail(email);
    console.log("[TEST-AUTH] User found:", !!user);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    console.log("[TEST-AUTH] User password exists:", !!user.password);

    if (!user.password) {
      return NextResponse.json(
        { error: "User has no password" },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("[TEST-AUTH] Password match:", passwordMatch);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: (user as any).role,
      },
    });
  } catch (error) {
    console.error("[TEST-AUTH] Error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
