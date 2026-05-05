"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OIR_AUTH } from "@/constant";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(OIR_AUTH);
  redirect("/main");
}