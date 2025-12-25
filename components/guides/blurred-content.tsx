"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface BlurredContentProps {
  children: React.ReactNode;
  isLocked?: boolean;
  redirectTo?: string;
  initialBlur?: number;
  minBlur?: number;
  maxBlur?: number;
}

export function BlurredContent({
  children,
  isLocked = false,
  redirectTo = "/login",
  initialBlur = 8,
  minBlur = 0,
  maxBlur = 20,
}: BlurredContentProps) {
  const [blurAmount, setBlurAmount] = useState(initialBlur);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);

  const toggleReveal = () => {
    if (isFullyRevealed) {
      setBlurAmount(initialBlur);
      setIsFullyRevealed(false);
    } else {
      setBlurAmount(0);
      setIsFullyRevealed(true);
    }
  };

  // If locked (not authenticated), show full blur with login overlay
  if (isLocked) {
    return (
      <div className="relative">
        {/* Full blur overlay */}
        <div
          className="absolute inset-0 z-30 rounded-lg bg-background"
          style={{
            filter: "blur(12px)",
          }}
        >
          {children}
        </div>

        {/* Login overlay */}
        <div className="relative z-40 flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-background/50 p-8 backdrop-blur-sm">
          <div className="space-y-4 text-center">
            <Lock className="mx-auto size-12 text-muted-foreground/60" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Content Locked</h3>
              <p className="text-sm text-muted-foreground">
                Sign in to view the installation guide
              </p>
            </div>
            <a
              href={redirectTo}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Lock className="size-4" />
              Sign In to Continue
            </a>
          </div>
        </div>
      </div>
    );
  }

  // If unlocked (authenticated), show blur controls
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="sticky top-20 z-40 flex flex-col gap-4 rounded-lg border bg-background p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Content Visibility</h3>
          <Button
            size="sm"
            variant={isFullyRevealed ? "default" : "outline"}
            onClick={toggleReveal}
            className="gap-2"
          >
            {isFullyRevealed ? (
              <>
                <EyeOff className="size-4" />
                Blur Again
              </>
            ) : (
              <>
                <Eye className="size-4" />
                View Content
              </>
            )}
          </Button>
        </div>

        {/* Blur Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium">Blur Level:</label>
            <span className="text-xs text-muted-foreground">{blurAmount}px</span>
          </div>
          <Slider
            min={minBlur}
            max={maxBlur}
            step={1}
            value={[blurAmount]}
            onValueChange={(value) => {
              setBlurAmount(value[0]);
              setIsFullyRevealed(value[0] === 0);
            }}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            Slide to adjust blur or click &quot;View Content&quot; to fully reveal
          </p>
        </div>
      </div>

      {/* Blurred Content */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          blurAmount > 0 && `blur-[${blurAmount}px]`
        )}
        style={{
          filter: `blur(${blurAmount}px)`,
        }}
      >
        {children}
      </div>

      {/* Info Box */}
      {!isFullyRevealed && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950">
          <p className="text-xs text-yellow-900 dark:text-yellow-100">
            <span className="font-semibold">💡 Tip:</span> Content is blurred for privacy. Use the controls above to adjust visibility or view the full content.
          </p>
        </div>
      )}
    </div>
  );
}

