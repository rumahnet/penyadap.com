"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import {
  userAuthSchema,
  userLoginSchema,
  userRegisterSchema,
} from "@/lib/validations/auth";
import { registerUser, type FormData as RegisterForm } from "@/actions/register-user";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Icons } from "@/components/shared/icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string;
  disabled?: boolean;
}

// Use login schema as base and allow optional register fields so
// `confirmPassword` is accessible in `errors` when rendering the register form.
type FormData = z.infer<typeof userLoginSchema> & Partial<z.infer<typeof userRegisterSchema>>;

export function UserAuthForm({ className, type, disabled = false, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
      resolver: zodResolver(type === "register" ? userRegisterSchema : userLoginSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    // Register flow
    if (type === "register") {
      // data should match userRegisterSchema
      const { status } = await registerUser(data as RegisterForm);

      setIsLoading(false);

      if (status === "exists") {
        return toast.error("Account exists", { description: "An account with this email already exists." });
      }

      if (status !== "success") {
        return toast.error("Something went wrong.", { description: "Your registration failed. Please try again." });
      }

      return toast.success("Account created!", { description: "You can now sign in with your email and password." });
    }

    // Login flow: use credentials (email + password)
    const callbackUrl = (searchParams?.get("from") as string) || "/dashboard";
    const { email, password } = data as any;
    
    const signInResult = await signIn("credentials", {
      email: email.toLowerCase(),
      password: password,
      redirect: false,
      callbackUrl: callbackUrl,
    });

    setIsLoading(false);

    if (!signInResult?.ok || signInResult?.error) {
      return toast.error("Invalid credentials", {
        description: "Email or password is incorrect. Please try again.",
      });
    }

    // Redirect to callback URL after successful login
    if (signInResult?.url) {
      window.location.href = signInResult.url;
    }

    return toast.success("Logged in!", {
      description: "Redirecting to " + (callbackUrl === "/dashboard" ? "dashboard" : "previous page") + "...",
    });
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
            {/* Password is below (shared input for login/register) */}
          </div>
          <div className="grid gap-2">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder={type === "register" ? "Create a password" : "Password"}
              type="password"
              autoComplete={type === "register" ? "new-password" : "current-password"}
              disabled={isLoading || isGoogleLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">{errors.password.message}</p>
            )}

            {type === "register" && (
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="confirmPassword">
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  placeholder="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading || isGoogleLoading}
                  {...register("confirmPassword")}
                />
                {errors?.confirmPassword && (
                  <p className="px-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            )}

            <button className={cn(buttonVariants())} disabled={isLoading || disabled}>
              {isLoading && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              {type === "register" ? "Sign Up with Email" : "Sign In"}
            </button>
          </div>
        </div>
        {/* quick login removed — use DB-created accounts only */}
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGoogleLoading(true);
          signIn("google");
        }}
        disabled={isLoading || isGoogleLoading || disabled}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 size-4" />
        )}{" "}
        Google
      </button>
    </div>
  );
}
