import Chat from "@/components/chat";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chat />
    </div>
  );
}
