import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-xs font-medium text-blue-800 shadow-sm mb-2">
          <Sparkles className="h-3 w-3" />
          OIR Portal
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
          Welcome Back
        </h1>
        <p className="text-sm text-slate-500">
          Enter your credentials to access the OIR portal
        </p>
      </div>

      <form className="flex flex-col gap-5 mt-2">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="student@thu.edu.tw"
              className="bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 h-11 shadow-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 h-11 shadow-sm"
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-600 focus:ring-offset-white"
            />
            Remember me
          </label>

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:underline hover:text-blue-500 transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full mt-4 gap-2 text-md h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold tracking-wide border-none shadow-md"
        >
          <LogIn className="h-4 w-4" />
          Sign in to account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-2">
        Don't have an account yet?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:underline hover:text-blue-700 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
