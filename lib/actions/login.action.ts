"use server";

import dbConnect from "@/lib/dbConnect";
import User, { IUser } from "@/lib/models/User.model";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OIR_AUTH } from "@/constant";
import { signAuthToken } from "@/lib/jwt";
import { logger } from "../logger";

export async function signIn(data: Pick<IUser, "batchId" | "password"> & {rememberMe: boolean}) {
  const { batchId, password, rememberMe } = data;
  
  let redirectPath: string | null = null;

  try {
    await dbConnect();

    const user = await User.findOne({ batchId }).select("password role");

    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password." };
    }

    const cookieStore = await cookies();

    const payload = {
      userId: user._id.toString(),
      role: user.role,
    };

    const token = await signAuthToken(payload);

    const expiresIn = rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 days
      : 24 * 60 * 60 * 1000; // 1 day

    cookieStore.set(OIR_AUTH, token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",
      expires: new Date(Date.now() + expiresIn),
      path: "/",
    });

    if (user.role === "admin") {
      redirectPath = "/dashboard";
    } else {
      redirectPath = "/main";
    }

  } catch (error) {
    logger.error({ action: "signIn", error }, "Login Server Error:");
    return { success: false, error: "An internal server error occurred." };
  }

  // FIX 2 (Continued): Execute the redirect safely outside the try...catch
  if (redirectPath) {
    redirect(redirectPath);
  }
}