"use server";

import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User.model";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

// Match the types from your react-hook-form
interface SignInInput {
  email: string;
  password: string;
  remember: boolean;
}

export async function SignIn(data: SignInInput) {
  const { email, password, remember } = data;

  try {
    await dbConnect();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password." };
    }

    let token = null;
    if (remember) {
      token = crypto.randomBytes(32).toString("hex");

      user.rememberToken = token;
      await user.save();
    }

    const cookieStore = await cookies();

    const sessionData = JSON.stringify({
      id: user._id,
      role: user.role,
      token: token,
    });

    const expiresIn = remember
      ? 30 * 24 * 60 * 60 * 1000 // 30 days
      : 24 * 60 * 60 * 1000; // 1 day

    cookieStore.set("oir_session", sessionData, {
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
