import Chat from "@/components/chat";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { cookies } from "next/headers";
import { OIR_AUTH } from "@/constant";
import { verifyAuthToken } from "@/lib/jwt";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User.model";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get(OIR_AUTH)?.value;

  let user = null;
  if (token) {
    const payload = await verifyAuthToken(token);
    if (payload && payload.userId) {
      await dbConnect();
      const userData = await User.findById(payload.userId).select("name batchId role").lean().exec();
      if (userData) {
        user = {
          name: userData.name,
          batchId: userData.batchId,
          role: userData.role,
        };
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chat />
    </div>
  );
}
