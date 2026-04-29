"use server";

import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User.model";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { OIR_AUTH } from "@/constant";

// Match the types from your react-hook-form
interface SignInInput {
  batchId: string;
  password: string;
  rememberMe: boolean;
}

export async function SignIn(data: SignInInput) {
  const { batchId, password, rememberMe } = data;

  try {
    await dbConnect();

    const user = await User.findOne({ batchId }).select("password");

    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password." };
    }

    let token = null;
    if (rememberMe) {
      token = crypto.randomBytes(32).toString("hex");

      // user.rememberToken = token;
      await user.save();
    }

    const cookieStore = await cookies();

    const sessionData = JSON.stringify({
      id: user._id,
      role: user.role,
      token: token,
    });

    const expiresIn = rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 days
      : 24 * 60 * 60 * 1000; // 1 day

    cookieStore.set(OIR_AUTH, sessionData, {
      httpOnly: true, // Security: Prevents malicious JavaScript from stealing the cookie
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "lax",
      expires: new Date(Date.now() + expiresIn),
      path: "/", // Cookie is available across the entire site
    });
  } catch (error) {
    console.error("Login Server Error:", error);
    return { success: false, error: "An internal server error occurred." };
  }

  redirect("/dashboard");
}
