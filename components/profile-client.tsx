"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  LogOut,
  Settings,
  Bell,
  ShieldCheck,
  Mail,
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
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center gap-8 bg-card p-8 rounded-3xl border shadow-sm"
      >
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary/10">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-2xl md:text-4xl font-bold bg-primary/5 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
            <h1 className="text-3xl font-bold tracking-tight capitalize">
              {user.name}
            </h1>
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
              variant="outline"
              size="sm"
              className="gap-2 transition-all hover:cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>

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

      {/* BOTTOM CARDS (Truncated for brevity, paste the rest of your cards here) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* E-ID CARD */}
        <Card className="border-none shadow-sm bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Electronic Student ID
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-8 bg-white m-4 rounded-xl border-2 border-dashed border-zinc-200">
            <div className="text-center space-y-4">
              <div className="bg-zinc-100 p-4 rounded-lg">
                <div className="w-48 h-48 bg-zinc-200 animate-pulse rounded-md mx-auto flex items-center justify-center text-zinc-400 font-medium text-sm tracking-widest">
                  QR PREVIEW
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic">
                Scan this at campus gates or library
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SETTINGS CARD */}
        <Card className="border-none shadow-sm bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Push Notifications", value: "Enabled" },
              { label: "Language", value: "English (US)" },
              { label: "Emergency Contact", value: "+1 234 567 890" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-3 border-b last:border-0 border-border/50"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">
                  {item.value}
                </span>
              </div>
            ))}
            <Button
              variant="ghost"
              className="w-full text-primary hover:text-primary/80 hover:bg-primary/5 mt-2 hover:cursor-pointer"
            >
              Manage All Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
