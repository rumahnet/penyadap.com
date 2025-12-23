import * as z from "zod"

export const userLoginSchema = z.object({
  email: z.string().email(),
  // password optional for magic-link flow; present => use credentials
  password: z.string().min(6).optional(),
});

export const userRegisterSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

// Backwards-compatible default schema (email-only) for places that still expect it
export const userAuthSchema = z.object({
  email: z.string().email(),
});
