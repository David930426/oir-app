import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | OIR",
  description: "View and manage your student profile and settings for the Office of International Relations.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}