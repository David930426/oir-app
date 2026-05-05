import { verifyAuthToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { OIR_AUTH } from "@/constant";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User.model";
import AccountsClient from "./accounts-client";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(OIR_AUTH)?.value;

  if (!token) redirect("/login");

  const payload = await verifyAuthToken(token);
  if (!payload || payload.role !== "admin") redirect("/main");

  await dbConnect();
  
  const users = await User.find({}).sort({ createdAt: -1 }).lean().exec();
  
  const serializedUsers = users.map((u: any) => ({
    _id: u._id.toString(),
    name: u.name,
    email: u.email,
    batchId: u.batchId,
    role: u.role || "user",
    approved: u.approved || false,
  }));

  return <AccountsClient users={serializedUsers} />;
}