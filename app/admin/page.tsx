"use client";


import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  Settings, 
  PlusCircle, 
  LayoutDashboard, 
  MessageSquare,
  FileText,
  PackageSearch
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (user.role !== 'admin') {
      router.push('/profile');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  const stats = [
    { label: 'Total Students', value: '1,240', icon: Users, color: 'text-[#2B4156]' },
    { label: 'Active Notices', value: '42', icon: MessageSquare, color: 'text-[#4A6D8C]' },
    { label: 'Unclaimed Packages', value: '18', icon: PackageSearch, color: 'text-[#6D8DA6]' },
    { label: 'Pending Apps', value: '5', icon: FileText, color: 'text-[#8BA4B4]' },
  ];

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {user.name}. Manage campus operations here.</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Announcement
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Registry Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm bg-muted/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-background shadow-sm ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Notice Activity</CardTitle>
            <Button variant="ghost" size="sm" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Detailed Report
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { student: '1120001', type: 'Package', time: '10 mins ago', status: 'Added' },
                { student: '1120002', type: 'ARC', time: '45 mins ago', status: 'Claimed' },
                { student: '1120005', type: 'Document', time: '2 hrs ago', status: 'Added' },
                { student: '1130099', type: 'Letter', time: '4 hrs ago', status: 'Added' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium text-sm">Student ID: {item.student}</p>
                      <p className="text-xs text-muted-foreground">{item.type} • {item.time}</p>
                    </div>
                  </div>
                  <Badge variant={item.status === 'Added' ? 'default' : 'secondary'}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Task Queues</CardTitle>
            <CardDescription>Items awaiting OIR staff review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 bg-primary/5 rounded-xl space-y-2">
               <h4 className="text-sm font-bold">Mailroom Registration</h4>
               <p className="text-xs text-muted-foreground">12 packages from UPS arrived at Central Gate. Need manual entry.</p>
               <Button size="sm" className="w-full mt-2">Start Processing</Button>
             </div>
             <div className="p-4 bg-[#4A6D8C]/10 rounded-xl space-y-2 border border-[#4A6D8C]/20">
               <h4 className="text-sm font-bold text-[#2B4156]">Scholarship Approval</h4>
               <p className="text-xs text-[#2B4156]/70">3 student documents for MOE Taiwan Scholarship need verification.</p>
               <Button variant="outline" size="sm" className="w-full mt-2 border-[#4A6D8C]/20 hover:bg-[#4A6D8C]/10 text-[#2B4156]">Review Now</Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
