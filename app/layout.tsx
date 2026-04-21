import type { Metadata } from "next";
import "./globals.css";
import ChatBot from "@/components/chat-bot";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Tunghai OIR | Office of International Relations",
  description:
    "Official portal for international students at Tunghai University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <AuthProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatBot />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
