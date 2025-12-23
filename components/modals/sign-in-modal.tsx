import { signIn } from "next-auth/react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import Link from "next/link";

import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function SignInModal({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [signInClicked, setSignInClicked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Testing auth with test endpoint first");
      // First test the endpoint
      const testRes = await fetch("/api/test-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      });

      const testData = await testRes.json();
      console.log("Test endpoint response:", { status: testRes.status, data: testData });

      if (!testRes.ok) {
        toast.error("Invalid credentials (test)", {
          description: testData.error || "Email or password is incorrect.",
        });
        setIsLoading(false);
        setPassword("");
        return;
      }

      console.log("Test auth passed! Now trying NextAuth credentials provider...");

      const result = await signIn("credentials", {
        email: email.toLowerCase(),
        password: password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      console.log("Sign in result:", result);

      if (!result?.ok) {
        console.log("Sign in failed:", {
          ok: result?.ok,
          error: result?.error,
          status: result?.status,
        });
        toast.error("NextAuth failed", {
          description: `Error: ${result?.error || "Unknown error"}`,
        });
        setIsLoading(false);
        setPassword("");
        return;
      }

      console.log("Sign in successful! Redirecting...");
      toast.success("Logged in!", {
        description: "Redirecting to dashboard...",
      });

      const redirectUrl = result?.url || "/dashboard";
      setTimeout(() => {
        setShowSignInModal(false);
        window.location.href = redirectUrl;
      }, 500);
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Something went wrong", {
        description: String(error),
      });
      setIsLoading(false);
    }
  };

  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <a href={siteConfig.url}>
            <Icons.logo className="size-10" />
          </a>
          <h3 className="font-urban text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-gray-500">
            This is strictly for demo purposes - only your email and profile
            picture will be stored.
          </p>
        </div>

        <div className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
          {/* Email & Password Form */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-3">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || signInClicked}
                required
                className="h-10"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || signInClicked}
                required
                className="h-10"
              />
            </div>
            <Button
              type="submit"
              variant="default"
              disabled={isLoading || signInClicked}
              className="w-full"
            >
              {isLoading && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              Sign In
            </Button>
          </form>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-secondary/50 px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In - DISABLED FOR NOW */}
          {/* 
          <Button
            variant="outline"
            disabled={signInClicked || isLoading}
            onClick={() => {
              setSignInClicked(true);
              signIn("google", { redirect: false }).then(() =>
                setTimeout(() => {
                  setShowSignInModal(false);
                }, 400),
              );
            }}
            className="w-full"
          >
            {signInClicked ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 size-4" />
            )}{" "}
            Sign In with Google
          </Button>
          */}

          {/* Sign Up Link */}
          <p className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="underline underline-offset-2 hover:text-foreground"
              onClick={() => setShowSignInModal(false)}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </Modal>
  );
}

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const SignInModalCallback = useCallback(() => {
    return (
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    );
  }, [showSignInModal, setShowSignInModal]);

  return useMemo(
    () => ({
      setShowSignInModal,
      SignInModal: SignInModalCallback,
    }),
    [setShowSignInModal, SignInModalCallback],
  );
}
