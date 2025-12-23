import { UserRole } from "@prisma/client";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

export type ExtendedUser = User & {
  role: UserRole;
  // `emailVerified` in Prisma/NextAuth is a Date | null — expose it on the session user
  emailVerified?: Date | null;
};

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    emailVerified?: Date | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
