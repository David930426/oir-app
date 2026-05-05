import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuthToken } from "@/lib/jwt";
import { OIR_AUTH } from "@/constant";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User.model";
import ProfileClient from "../../../components/profile-client"; 

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(OIR_AUTH)?.value;

  if (!token) redirect("/login");

  const payload = await verifyAuthToken(token);
  if (!payload) redirect("/login");

  await dbConnect();
  const dbUser = await User.findById(payload.userId).lean().exec();

  if (!dbUser) redirect("/login");

  const userData = {
    name: dbUser.name,
    email: dbUser.email,
    batchId: dbUser.batchId,
    role: dbUser.role,
    avatar: dbUser.avatar || "",
  };

  return <ProfileClient user={userData} />;
}