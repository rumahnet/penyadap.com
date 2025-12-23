"use client";

interface LoginRequiredButtonProps {
  redirectPath: string;
}

export function LoginRequiredButton({ redirectPath }: LoginRequiredButtonProps) {
  const handleClick = () => {
    window.location.href = redirectPath;
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
    >
      Sign In
    </button>
  );
}
