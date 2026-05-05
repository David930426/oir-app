import { OIR_AUTH } from "@/constant";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";
import { verifyAuthToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User.model";

export const metadata: Metadata = {
  title: "Login | OIR",
  description: "Login Account for the Office of International Relations",
};

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(OIR_AUTH)?.value;

  if (token) {
    const payload = await verifyAuthToken(token);

    if (payload && payload.userId && payload.role) {
      await dbConnect();
      const userExists = await User.exists({ _id: payload.userId });

      if (userExists) {
        if (payload.role === "admin") {
          redirect("/dashboard");
        } else {
          redirect("/main");
        }
      }
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 overflow-hidden text-slate-900">
      <div className="absolute top-[-10%] left-[-10%] h-125 w-125 rounded-full bg-blue-200/50 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-125 w-125 rounded-full bg-blue-300/30 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-8 bg-white/90 backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-white">
        {children}
      </div>
    </div>
  );
}