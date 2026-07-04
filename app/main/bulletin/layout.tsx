import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulletin | OIR",
  description: "Campus announcements, scholarship opportunities, and upcoming events for the Tunghai international community.",
};

export default function BulletinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
