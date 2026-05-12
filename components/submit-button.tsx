"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, UserPlus } from "lucide-react";

interface SubmitButtonProps {
  register: boolean;
  /**
   * Explicit pending state. Overrides `useFormStatus()` — required when the
   * form is submitted via JS (e.g. `react-hook-form`) rather than as a native
   * Server Action form, since `useFormStatus()` only tracks the latter.
   */
  pending?: boolean;
}

export function SubmitButton({
  register,
  pending: pendingOverride,
}: SubmitButtonProps) {
  const { pending: formPending } = useFormStatus();
  const pending = pendingOverride ?? formPending;

  const Icon = register ? UserPlus : LogIn;
  const loadingText = register ? "Creating Account..." : "Signing In...";
  const defaultText = register ? "Create Account" : "Sign In";

  return (
    <Button
      type="submit"
      disabled={pending}
      aria-busy={pending || undefined}
      className="w-full mt-2 gap-2 text-sm h-11 bg-[#2B4156] hover:bg-[#1f3142] text-white font-semibold border-none shadow-md transition-all rounded-lg hover:cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      {pending ? loadingText : defaultText}
    </Button>
  );
}
