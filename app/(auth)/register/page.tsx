import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"
import { UserAuthForm } from "@/components/forms/user-auth-form"
import { Suspense } from "react"

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Login
      </Link>
      {/* Left side: Guides */}
      <div className="hidden h-full flex-col justify-center gap-6 bg-muted p-8 lg:flex">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Panduan Instalasi</h2>
          <p className="text-sm text-muted-foreground">
            Pelajari cara menginstal dan menggunakan aplikasi mSpy
          </p>
        </div>
        <div className="space-y-3">
          <Link
            href="/android"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full justify-start gap-2"
            )}
          >
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.6915026,0.969541311 C18.4744152,0.969541311 19.1140251,1.62088145 19.1140251,2.40379404 L19.1140251,21.5960444 C19.1140251,22.3789569 18.4744152,23.0184712 17.6915026,23.0184712 L2.40248139,23.0184712 C1.61956899,23.0184712 0.980149028,22.3789569 0.980149028,21.5960444 L0.980149028,2.40379404 C0.980149028,1.62088145 1.61956899,0.969541311 2.40248139,0.969541311 L17.6915026,0.969541311 Z" />
            </svg>
            Android Guide
          </Link>
          <Link
            href="/ios"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full justify-start gap-2"
            )}
          >
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.905-.086 1.81-.626 2.81-.54 1.17.1 2.03.58 2.55 1.51-2.38 1.41-2.01 4.18-.32 4.93-1.25 2.46-.2 3.85 1.268 4.67-.18.35-.359.63-.579.86l-.18.18z" />
            </svg>
            iOS Guide
          </Link>
        </div>
      </div>
      {/* Right side: Form */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto size-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and choose a password to create your account
            </p>
          </div>
          
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
            <p className="text-xs text-green-900 dark:text-green-100">
              <span className="font-semibold">✓ Info:</span> A verification email will be sent after registration.
            </p>
          </div>

          <Suspense>
            <UserAuthForm type="register" />
          </Suspense>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-brand underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-brand underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
