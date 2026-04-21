import { Card, CardContent } from "@/components/ui/card";
import { Bell, Newspaper, Users, FileText } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export function QuickActions() {
  const data = [
    {
      label: "Notice Board",
      icon: Bell,
      path: "/mail",
      color: "bg-slate-800",
      desc: "Track mail & docs",
    },
    {
      label: "OIR Bulletin",
      icon: Newspaper,
      path: "/news",
      color: "bg-slate-600",
      desc: "Latest updates",
    },
    {
      label: "Resources",
      icon: FileText,
      path: "/resources",
      color: "bg-slate-500",
      desc: "Forms & guides",
    },
    {
      label: "Organizations",
      icon: Users,
      path: "/orgs",
      color: "bg-slate-400",
      desc: "Student societies",
    },
  ];
  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8">
      {data.map((action, i) => (
        <motion.div key={i} whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
          <Link href={action.path}>
            <Card className="h-full hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border border-primary/10 rounded-3xl overflow-hidden group">
              <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
                <div
                  className={`p-4 rounded-2xl ${action.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <action.icon className="h-7 w-7" />
                </div>
                <div>
                  <span className="font-bold text-lg block mb-1 text-foreground">
                    {action.label}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">
                    {action.desc}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
