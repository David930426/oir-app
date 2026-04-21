"use client";

// import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  PlusCircle, 
  MessageSquare,
  FileText,
  PackageSearch,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Bell,
  Newspaper
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const chartData = [
  { name: 'Mon', packages: 12, docs: 5 },
  { name: 'Tue', packages: 19, docs: 8 },
  { name: 'Wed', packages: 15, docs: 12 },
  { name: 'Thu', packages: 22, docs: 7 },
  { name: 'Fri', packages: 30, docs: 15 },
  { name: 'Sat', packages: 8, docs: 4 },
  { name: 'Sun', packages: 5, docs: 2 },
];

export default function AdminDashboard() {
  // const { user } = useAuth();

  // if (!user || user.role !== 'admin') return null;

  const stats = [
    { label: 'Total Students', value: '1,240', icon: Users, color: 'text-[#2B4156]', trend: '+12%' },
    { label: 'Active Notices', value: '42', icon: MessageSquare, color: 'text-[#4A6D8C]', trend: '+5%' },
    { label: 'Unclaimed Packages', value: '18', icon: PackageSearch, color: 'text-[#6D8DA6]', trend: '-2%' },
    { label: 'Pending Apps', value: '5', icon: FileText, color: 'text-[#8BA4B4]', trend: '0%' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">OIR Overview</h1>
          <p className="text-muted-foreground italic">Last update sync: {new Date().toLocaleTimeString()}</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <PlusCircle className="h-4 w-4" />
            Quick Entry
          </Button>
          <Button variant="outline" className="gap-2">
            <Activity className="h-4 w-4" />
            Live Logs
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
            <Card className="border shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-zinc-100 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="text-[10px] gap-1 font-bold">
                    {stat.trend}
                    <TrendingUp className="h-2 w-2" />
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Activity Volume</CardTitle>
              <CardDescription>Notice registrations and claims over the past 7 days</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <BarChart3 className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPackages" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2B4156" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2B4156" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8BA4B4" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8BA4B4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#888' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#888' }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="packages" stroke="#2B4156" fillOpacity={1} fill="url(#colorPackages)" strokeWidth={3} />
                  <Area type="monotone" dataKey="docs" stroke="#8BA4B4" fillOpacity={1} fill="url(#colorDocs)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Real-time notice updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { student: '1120001', type: 'Package', time: '10m', status: 'Added' },
              { student: '1120002', type: 'ARC', time: '45m', status: 'Claimed' },
              { student: '1120005', type: 'Document', time: '2h', status: 'Added' },
              { student: '1130099', type: 'Letter', time: '4h', status: 'Added' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-zinc-50 rounded-xl transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-xs">ID: {item.student}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{item.type} • {item.time} ago</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
            <Button variant="outline" className="w-full text-xs font-bold mt-2">View Transaction Log</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
             <Bell className="h-24 w-24" />
           </div>
           <CardHeader>
             <CardTitle>Notice Management</CardTitle>
             <CardDescription>Register new items for student pickup</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              <Button onClick={() => window.location.href='/dashboard/notices'} className="w-full h-12 gap-2 text-md">
                <PlusCircle className="h-5 w-5" />
                Add New Notice
              </Button>
           </CardContent>
        </Card>

        <Card className="border shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
             <Newspaper className="h-24 w-24" />
           </div>
           <CardHeader>
             <CardTitle>Bulletin Portal</CardTitle>
             <CardDescription>Publish news, events, or scholarships</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              <Button variant="outline" onClick={() => window.location.href='/dashboard/bulletin'} className="w-full h-12 gap-2 text-md border-primary/20 text-primary hover:bg-primary/5">
                <PlusCircle className="h-5 w-5" />
                Post New Article
              </Button>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
