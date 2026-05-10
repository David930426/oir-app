"use server";

import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User.model";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OIR_AUTH } from "@/constant";
import { signAuthToken } from "@/lib/jwt";
import { logger } from "../logger";
import { loginSchema } from "@/lib/validations/auth.schema";

const GENERIC_AUTH_ERROR = "Invalid Student ID or password.";

const SESSION_DURATIONS = {
  default: { seconds: 24 * 60 * 60, jose: "1d" as const },
  remember: { seconds: 30 * 24 * 60 * 60, jose: "30d" as const },
};

export type SignInResult = { success: false; error: string };

export async function signIn(input: unknown): Promise<SignInResult | undefined> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const { batchId, password, rememberMe } = parsed.data;
  let redirectPath: string | null = null;

  try {
    await dbConnect();

    const user = await User.findOne({ batchId }).select(
      "password role approved",
    );

    if (!user) {
      // Equalize timing with the bcrypt path so attackers can't enumerate by
      // measuring response time — bcrypt.compare against a dummy hash.
      await bcrypt.compare(
        password,
        "$2a$10$CwTycUXWue0Thq9StjUM0uJ8z7zS6n3z3aQk5h4g1F4QyE6h.LZ8e",
      );
      return { success: false, error: GENERIC_AUTH_ERROR };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: GENERIC_AUTH_ERROR };
    }

    if (user.approved === false) {
      return {
        success: false,
        error:
          "Your account is pending administrator approval. Please check back later.",
      };
    }

    const session = rememberMe
      ? SESSION_DURATIONS.remember
      : SESSION_DURATIONS.default;

    const token = await signAuthToken(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      session.jose,
    );

    const cookieStore = await cookies();
    cookieStore.set(OIR_AUTH, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + session.seconds * 1000),
      path: "/",
    });

    redirectPath = user.role === "admin" ? "/dashboard" : "/main";
  } catch (error) {
    logger.error({ action: "signIn", error }, "Login Server Error:");
    return { success: false, error: "An internal server error occurred." };
  }

  if (redirectPath) {
    redirect(redirectPath);
  }
}
