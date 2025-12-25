export const runtime = "nodejs";

import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export const DELETE = async (req: Request) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return new Response("Not authenticated", { status: 401 });
  }

  try {
    await prisma.user.delete({
      where: {
        id: currentUser.id,
      },
    });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }

  return new Response("User deleted successfully!", { status: 200 });
};
