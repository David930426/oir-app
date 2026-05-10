import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ConfirmDialogProvider } from "@/components/confirm-dialog";

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
        <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
        <Toaster richColors={true} position="top-center" />
      </body>
    </html>
  );
}
