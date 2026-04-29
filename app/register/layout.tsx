import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | OIR App",
  description: "Create a new student account",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
