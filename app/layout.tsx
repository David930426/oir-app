import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

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
        {children}
        <Toaster richColors={true} position="top-center"/>
      </body>
    </html>
  );
}
