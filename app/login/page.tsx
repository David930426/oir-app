"use client";

import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/actions/login.action";
import { useState } from "react";
import { toast } from "sonner";
import { SubmitButton } from "@/components/submit-button";
import { loginSchema, type LoginInput } from "@/lib/validations/auth.schema";
import { RequiredMark } from "@/components/ui/required-mark";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { batchId: "", password: "", rememberMe: false },
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginInput) => {
    setFormError(null);

    try {
      const result = await signIn(data);

      if (result?.error) {
        setFormError(result.error);
        return;
      }

      toast.success("Welcome back!");
    } catch (err) {
      console.error("Login failed", err);
      setFormError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
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
            Welcome Back
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Enter your credentials to access your account
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5 mt-4"
      >
        <div className="flex flex-col gap-4">
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
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="S12345678"
              aria-invalid={Boolean(errors.batchId) || undefined}
              aria-describedby={errors.batchId ? "batchId-error" : undefined}
              className="bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-300 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-11 shadow-sm transition-all"
              {...register("batchId")}
            />
            {errors.batchId && (
              <p
                id="batchId-error"
                role="alert"
                className="text-xs font-medium text-red-700"
              >
                {errors.batchId.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700"
              >
                Password
                <RequiredMark />
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password) || undefined}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className="bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-300 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-11 pr-10 shadow-sm transition-all"
                {...register("password")}
              />
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700 hover:cursor-pointer transition-colors focus:outline-none focus-visible:text-blue-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                />
                <TooltipContent>
                  {showPassword ? "Hide password" : "Show password"}
                </TooltipContent>
              </Tooltip>
            </div>
            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="text-xs font-medium text-red-700"
              >
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center mt-1">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-blue-700 hover:cursor-pointer focus:ring-blue-600 transition-all"
              {...register("rememberMe")}
            />
            Remember me for 30 days
          </label>
        </div>

        {formError && (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-md bg-red-50 p-3 border border-red-200 text-sm font-medium text-red-800 text-center"
          >
            {formError}
          </div>
        )}

        <SubmitButton register={false} />
      </form>

      <p className="text-center text-sm text-slate-500 mt-4">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-700 hover:text-blue-800 hover:underline transition-colors"
        >
          Request access
        </Link>
      </p>
    </div>
  );
}
