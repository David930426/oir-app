"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

export function SubmitButton({ register }: { register: boolean }) {
  const { pending } = useFormStatus();

  const Icon = register ? UserPlus : LogIn;
  const loadingText = register ? "Creating Account..." : "Signing In...";
  const defaultText = register ? "Create Account" : "Sign In";

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full mt-2 gap-2 text-sm h-11 bg-blue-700 hover:bg-blue-800 text-white font-semibold border-none shadow-md transition-all rounded-lg hover:cursor-pointer"
    >
      <Icon className={`h-4 w-4 ${pending ? "animate-pulse" : ""}`} />
      {pending ? loadingText : defaultText}
    </Button>
  );
}