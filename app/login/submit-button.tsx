"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full mt-2 gap-2 text-sm h-11 bg-blue-700 hover:bg-blue-800 text-white font-semibold border-none shadow-md transition-all rounded-lg"
    >
      <LogIn className={`h-4 w-4 ${pending ? "animate-pulse" : ""}`} />
      {pending ? "Signing In..." : "Sign In"}
    </Button>
  );
}
