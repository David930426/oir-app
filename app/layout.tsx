import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
