"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Menu,
  X,
  LogIn,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  User,
  MapPin,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/actions/logout.action";
import { useConfirm } from "@/components/confirm-dialog";

type AuthUser = {
  name: string;
  batchId: string;
  role: string;
};

export default function Navbar({ user }: { user?: AuthUser | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
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

  const navLinks = [
    { name: "Home", path: "/main" },
    { name: "Notice Board", path: "/main/board" },
    { name: "Bulletin", path: "/main/bulletin" },
    { name: "Resources", path: "/main/resources" },
    { name: "Organizations", path: "/main/orgs" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Utility strip */}
      <div className="bg-ink text-white/60 text-[11px] tracking-wide">
        <div className="container mx-auto px-4 h-7 flex items-center justify-between">
          <span className="hidden sm:flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-brass" />
            Tunghai University · Taichung, Taiwan
          </span>
          <a
            href="mailto:oir@thu.edu.tw"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="h-3 w-3 text-brass" />
            oir@thu.edu.tw
          </a>
        </div>
      </div>

      <nav className="w-full border-b bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-18 items-center justify-between">
            <Link
              href="/main"
              className="flex items-center gap-3 transition-opacity hover:opacity-90"
            >
              <div className="h-14 w-auto flex items-center">
                <img
                  src="/Logo.png"
                  alt="Tunghai University OIR"
                  className="h-10 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col border-l pl-3 border-primary/20">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary opacity-60 leading-none mb-1">
                  Office of
                </span>
                <span className="text-sm font-black uppercase tracking-widest text-primary leading-none">
                  International Relations
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1 h-full">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`h-18 flex items-center px-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive(link.path)
                      ? "text-primary border-brass"
                      : "text-muted-foreground border-transparent hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-2 pl-4 ml-2 border-l h-8">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:cursor-pointer"
                >
                  <Globe className="h-4 w-4" />
                  <span>Translate</span>
                </Button>
                {user ? (
                  user.role === "admin" ? (
                    <Button
                      size="sm"
                      className="gap-2 hover:cursor-pointer"
                      onClick={() => router.push("/dashboard")}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 rounded-md text-sm font-medium transition-colors cursor-pointer outline-none">
                        <UserIcon className="h-4 w-4" />
                        <span>{user.name}</span>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="flex gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <User className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span>{user.name}</span>
                              <span className="text-xs text-muted-foreground font-normal">
                                {user.batchId}
                              </span>
                            </div>
                          </DropdownMenuLabel>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => router.push("/main/profile")}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-destructive cursor-pointer"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                ) : (
                  <Button
                    size="sm"
                    className="gap-2 hover:cursor-pointer"
                    onClick={() => router.push("/login")}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="hover:cursor-pointer"
              >
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-b"
            >
              <div className="flex flex-col p-4 gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium ${
                      isActive(link.path)
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <hr />
                {user ? (
                  user.role === "admin" ? (
                    <Button
                      className="w-full gap-2 hover:cursor-pointer"
                      onClick={() => {
                        setIsOpen(false);
                        router.push("/dashboard");
                      }}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="px-4 py-2 border rounded-lg flex flex-col items-center bg-muted/50">
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {user.batchId}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full gap-2 hover:cursor-pointer"
                        onClick={() => {
                          setIsOpen(false);
                          router.push("/main/profile");
                        }}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full gap-2 hover:cursor-pointer"
                        onClick={() => {
                          setIsOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </Button>
                    </div>
                  )
                ) : (
                  <Button
                    className="w-full gap-2 hover:cursor-pointer"
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/login");
                    }}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
