"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Mail,
  BadgeCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { logout } from "@/lib/actions/logout.action";
import { useConfirm } from "@/components/confirm-dialog";

interface UserProfile {
  name: string;
  email?: string;
  batchId: string;
  role: string;
  avatar?: string;
}

export default function ProfileClient({ user }: { user: UserProfile }) {
  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : "OI";
  const confirm = useConfirm();

  const handleLogout = async () => {
    const ok = await confirm({
      title: "Sign out of your account?",
      description: "You'll need to log in again to continue.",
      confirmLabel: "Sign out",
      tone: "warning",
    });
    if (ok) await logout();
  };

  return (
    <div className="container mx-auto px-4 pt-10 pb-16 md:pt-14 max-w-4xl space-y-8">
      <div className="max-w-2xl space-y-3 border-b pb-8">
        <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary/60">
          Your account
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-medium tracking-tight">
          Profile
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center gap-8 bg-card p-8 rounded-xl border"
      >
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary/10">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-2xl md:text-4xl font-bold bg-primary/5 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
            <h2 className="font-heading text-3xl font-medium tracking-tight capitalize">
              {user.name}
            </h2>
            <Badge
              variant={user.role === "admin" ? "default" : "secondary"}
              className="w-fit mx-auto md:mx-0 uppercase"
            >
              {user.role}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-muted-foreground">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <UserIcon className="h-4 w-4 shrink-0" />
              <span className="text-sm">
                ID:{" "}
                <span className="text-foreground font-mono font-bold">
                  {user.batchId}
                </span>
              </span>
            </div>
            {user.email && (
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="text-sm truncate">{user.email}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center md:justify-start pt-4">
            <Button
              variant="destructive"
              size="sm"
              type="button"
              onClick={handleLogout}
              className="gap-2 transition-all hover:cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* E-ID card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Electronic student ID
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-8 bg-muted/40 m-4 rounded-xl border border-dashed">
            <div className="text-center space-y-4">
              <div className="bg-card p-4 rounded-lg border">
                <div className="w-48 h-48 bg-muted rounded-md mx-auto flex items-center justify-center text-muted-foreground font-medium text-xs tracking-[0.18em] uppercase">
                  Coming soon
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Your scannable campus ID will appear here.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-primary" />
              Account details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { label: "Full name", value: user.name },
              { label: "Student ID", value: user.batchId },
              { label: "Email", value: user.email || "—" },
              { label: "Role", value: user.role },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center gap-4 py-3 border-b last:border-0"
              >
                <span className="text-sm font-medium shrink-0">{item.label}</span>
                <span className="text-sm text-muted-foreground truncate capitalize">
                  {item.value}
                </span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-3">
              To update your details, contact the OIR office at{" "}
              <a href="mailto:oir@thu.edu.tw" className="text-primary hover:underline">
                oir@thu.edu.tw
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
