"use client";

import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Sparkles, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { SignIn } from "@/lib/actions/login.action";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { batchId: "", password: "", rememberMe: false },
  });

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
        onSubmit={handleSubmit(SignIn)}
        className="flex flex-col gap-5 mt-4"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="batchId"
              className="text-sm font-semibold text-slate-700"
            >
              Student ID
            </label>
            <Input
              id="batchId"
              type="batchId"
              placeholder="S12345678"
              className="bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-11 shadow-sm transition-all"
              {...register("batchId", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-11 shadow-sm transition-all"
              {...register("password", { required: true })}
            />
          </div>
        </div>

        <div className="flex items-center mt-1">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 transition-all"
              {...register("rememberMe")}
            />
            Remember me
          </label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 gap-2 text-sm h-11 bg-blue-700 hover:bg-blue-800 text-white font-semibold border-none shadow-md transition-all rounded-lg"
        >
          <LogIn className={`h-4 w-4 ${isSubmitting ? "animate-pulse" : ""}`} />
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-4">
        Don't have an account yet?{" "}
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
