import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OIR_AUTH } from "@/constant";
import AdminSidebarUI from "@/components/admin-sidebar";
import { Metadata } from "next";
import { verifyAuthToken } from "@/lib/jwt";
import User from "@/lib/models/User.model";
import dbConnect from "@/lib/dbConnect"; // 1. Import your DB connection

export const metadata: Metadata = {
  title: "Admin Portal | OIR",
  description: "Management dashboard for the Office of International Relations",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(OIR_AUTH)?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifyAuthToken(token);

  if (!payload) {
    redirect("/login");
  }

  if (payload.role !== "admin") {
    redirect("/main");
  }

  await dbConnect(); 

  const user = await User.findById(payload.userId)
    .select("name role -_id")
    .lean()
    .exec();

  if (!user) {
    redirect("/login");
  }

  return <AdminSidebarUI user={user}>{children}</AdminSidebarUI>;
}