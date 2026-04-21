"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Bell,
  Newspaper,
  FileText,
  ShieldCheck,
  LogOut,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   if (!user) {
  //     router.push('/');
  //   } else if (user.role !== 'admin') {
  //     router.push('/profile');
  //   }
  // }, [user, router]);

  // if (!user || user.role !== 'admin') return null;

  const user = {
    name: "admin",
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Student Notices", href: "/dashboard/notices", icon: Bell },
    { name: "Bulletin", href: "/dashboard/bulletin", icon: Newspaper },
    { name: "Resources", href: "/dashboard/resources", icon: FileText },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2 px-2">
            <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
            <span className="font-bold text-lg tracking-tight truncate">
              Admin OIR
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton isActive={isActive} tooltip={item.name}>
                        <Link href={item.href} className="flex items-center gap-2 w-full">
                          <item.icon />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground truncate italic">
                  OIR Staff
                </p>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                  // onClick={logout}
                >
                  <LogOut />
                  <span>Log out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="w-px h-4 bg-border mx-2"></div>
          <span className="text-sm font-medium text-muted-foreground">Admin Portal</span>
        </header>
        <div className="p-8 pb-12 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
