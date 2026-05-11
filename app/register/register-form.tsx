"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { registerUser } from "../../lib/actions/register.action";
import { toast } from "sonner";
import { SubmitButton } from "@/components/submit-button";
import { RequiredMark } from "@/components/ui/required-mark";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
  } = useForm({
    defaultValues: { name: "", batchId: "", email: "", password: "" },
  });

  const onSubmit = async (data: any) => {
    setError(null);

    try {
      const result = await registerUser(data);

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.info("Account created successfully! Wait for admin approval.");
        router.push("/login");
      }
    } catch (err) {
      console.error("Registration failed", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto w-full p-4 sm:p-0">
      <div className="flex flex-col items-center gap-3 text-center">
        <Image
          src="/LogoFull.png"
          alt="OIR Portal Logo"
          width={300}
          height={72}
          className="mb-1 drop-shadow-sm w-auto h-auto max-w-60"
          priority
        />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          OIR Portal
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create an Account
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Enter your details to register a new account
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mt-4"
      >
        {error && (
          <div className="rounded-md bg-red-50 p-3 border border-red-200 text-sm font-medium text-red-800 text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-slate-700"
            >
              Full Name
              <RequiredMark />
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-300 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-11 shadow-sm transition-all"
              {...register("name", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="batchId"
              className="text-sm font-semibold text-slate-700"
            >
              Student ID
              <RequiredMark />
            </label>
            <Input
              id="batchId"
              type="text"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="S12350130"
              className="bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-300 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-11 shadow-sm transition-all font-mono"
              {...register("batchId", {
                required: true,
                pattern: {
                  value: /^S\d{8}$/,
                  message:
                    "Student ID must be 'S' followed by 8 digits (e.g. S12350130).",
                },
                setValueAs: (v: string) => v?.trim().toUpperCase() ?? "",
              })}
            />
            <p className="text-xs text-slate-500">
              Format: <span className="font-mono">S</span> followed by 8
              digits.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700"
            >
              Email address
              <RequiredMark />
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-300 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-11 shadow-sm transition-all"
              {...register("email", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-700"
            >
              Password
              <RequiredMark />
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-300 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-11 shadow-sm transition-all"
              {...register("password", { required: true, minLength: 6 })}
            />
            <p className="text-xs text-slate-500">
              Must be at least 6 characters long.
            </p>
          </div>
        </div>

        <SubmitButton register={true} />
      </form>

      <p className="text-center text-sm text-slate-500 mt-4">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-700 hover:text-blue-800 hover:underline transition-colors"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
