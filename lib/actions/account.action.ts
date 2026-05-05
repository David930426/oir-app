"use server";

import dbConnect from "../dbConnect";
import User from "../models/User.model";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function toggleApproveAccount(id: string, approved: boolean) {
  await dbConnect();
  await User.findByIdAndUpdate(id, { approved });
  revalidatePath("/dashboard/accounts");
}

export async function deleteAccount(id: string) {
  await dbConnect();
  await User.findByIdAndDelete(id);
  revalidatePath("/dashboard/accounts");
}

export async function createOrUpdateAccount(id: string | null, data: any) {
  await dbConnect();
  
  try {
    const payload = { ...data };
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    } else {
      delete payload.password; // Don't override existing password if left blank on edit
    }

    if (id) {
      await User.findByIdAndUpdate(id, payload);
    } else {
      await User.create({ ...payload, approved: true }); // Manually created users are auto-approved
    }
    revalidatePath("/dashboard/accounts");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "An error occurred while saving the account." };
  }
}