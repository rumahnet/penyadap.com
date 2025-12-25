"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";

import { prisma } from "@/lib/db";
import { userRoleSchema } from "@/lib/validations/user";

export type FormData = {
  role: "ADMIN" | "USER";
};

export async function updateUserRole(userId: string, data: FormData) {
  try {
    const user = await getCurrentUser();

    if (!user || user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const { role } = userRoleSchema.parse(data);

    // Update the user role.
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: role,
      },
    });

    revalidatePath("/dashboard/settings");
    return { status: "success" };
  } catch (error) {
    // console.log(error)
    return { status: "error" };
  }
} 
