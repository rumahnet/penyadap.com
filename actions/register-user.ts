"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { userRegisterSchema } from "@/lib/validations/auth";

export type FormData = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export async function registerUser(data: FormData) {
  try {
    const parsed = userRegisterSchema.parse(data);

    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) {
      return { status: "exists" } as const;
    }

    const hashed = await bcrypt.hash(parsed.password, 10);

    await prisma.user.create({
      data: {
        email: parsed.email.toLowerCase(),
        password: hashed,
      },
    });

    return { status: "success" } as const;
  } catch (error) {
    return { status: "error" } as const;
  }
}
