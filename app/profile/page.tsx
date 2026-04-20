"use client";

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Settings, Bell, ShieldCheck, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useEffect } from 'react';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (user.role === 'admin') {
      router.push('/admin');
    }
  }, [user, router]);

  if (!user || user.role === 'admin') return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center gap-8 bg-card p-8 rounded-3xl border shadow-sm"
      >
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary/10">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <Badge variant="secondary" className="w-fit mx-auto md:mx-0">Student</Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-muted-foreground">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <User className="h-4 w-4" />
              <span>Student ID: <span className="text-foreground font-mono font-bold">{user.studentId}</span></span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center md:justify-start pt-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="destructive" size="sm" className="gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <div className="w-48 h-48 bg-zinc-200 animate-pulse rounded-md mx-auto flex items-center justify-center text-zinc-400">
                   QR CODE PREVIEW
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic">Scan this at campus gates or library</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Push Notifications', value: 'Enabled' },
              { label: 'Language', value: 'English (US)' },
              { label: 'Emergency Contact', value: '+1 234 567 890' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b last:border-0 border-zinc-100">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">{item.value}</span>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-primary hover:text-primary">Manage All Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
