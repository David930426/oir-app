"use client";

import { Bell, Newspaper, Users, FileText, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export function QuickActions() {
  const data = [
    {
      label: "Notice Board",
      icon: Bell,
      path: "/main/board",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-700",
      desc: "Track mail & documents waiting at the office",
    },
    {
      label: "OIR Bulletin",
      icon: Newspaper,
      path: "/main/bulletin",
      iconBg: "bg-teal-50",
      iconColor: "text-teal-700",
      desc: "Announcements, events, and campus news",
    },
    {
      label: "Resources",
      icon: FileText,
      path: "/main/resources",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-700",
      desc: "Official forms, guides, and downloads",
    },
    {
      label: "Organizations",
      icon: Users,
      path: "/main/orgs",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-700",
      desc: "Student societies and communities",
    },
  ];
  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((action, i) => (
        <motion.div
          key={action.path}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
        >
          <Link href={action.path} className="block h-full group">
            <div className="h-full flex flex-col gap-4 p-5 rounded-xl border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-lg ${action.iconBg} ${action.iconColor}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">
                  {action.label}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {action.desc}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
