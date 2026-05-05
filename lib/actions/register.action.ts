"use server";

import bcrypt from "bcryptjs";
import dbConnect from "../dbConnect";
import User from "../models/User.model";

export async function registerUser(data: {
  name: string;
  batchId: string;
  email: string;
  password: string;
}) {
  try {
    const { name, batchId, email, password } = data;

    // Basic validation
    if (!name || !batchId || !email || !password) {
      return { error: "All fields are required" };
    }

    await dbConnect();

    const existingUser = await User.find({
      $or: [{ batchId }, { email }],
    });

    if (existingUser.length > 0) {
      throw new Error("User already exists");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({...data, role: "student", password: hashedPassword})

    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { error: error.message || "Failed to register account" };
  }
}
