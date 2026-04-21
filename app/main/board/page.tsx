"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Bell, FileText, Package, Clock, CheckCircle2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockNotices } from '@/lib/mockData';
import { StudentNotice } from '@/types';

export default function StudentNotices() {
  const [studentId, setStudentId] = useState('');
  const [results, setResults] = useState<StudentNotice[] | null | 'not-found'>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!studentId.trim()) return;
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const found = mockNotices.filter(m => m.studentId === studentId);
      setResults(found.length > 0 ? found : 'not-found');
      setIsLoading(false);
    }, 600);
  };

  const getNoticeIcon = (type: StudentNotice['type']) => {
    switch (type) {
      case 'Package': return Package;
      case 'Document': return FileText;
      case 'ARC': return CheckCircle2;
      default: return Bell;
    }
  };

  const getStatusColor = (status: StudentNotice['status']) => {
    switch (status) {
      case 'Ready': return 'bg-[#4A6D8C]';
      case 'Processing': return 'bg-[#8BA4B4]';
      case 'Action Needed': return 'bg-[#2B4156]';
      default: return 'bg-zinc-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl space-y-8">
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 bg-[#2B4156]/10 text-[#2B4156] rounded-full flex items-center justify-center mb-4">
          <Bell className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Student Notice Board</h1>
        <p className="text-muted-foreground">Check for documents, packages, or specific OIR calls for your Student ID.</p>
      </div>

      <div className="flex gap-2 p-2 bg-card border rounded-2xl shadow-sm">
        <Input 
          placeholder="Enter Student ID (e.g., 1120001)" 
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="border-none focus-visible:ring-0 text-lg h-12"
        />
        <Button onClick={handleSearch} disabled={isLoading} className="h-12 px-8 rounded-xl font-semibold">
          {isLoading ? 'Searching...' : 'Check Now'}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {results === 'not-found' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-zinc-200">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-zinc-100 rounded-full">
                  <Search className="h-8 w-8 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No New Notices</h3>
                  <p className="text-muted-foreground">We couldn't find any pending notices for: <span className="font-mono text-primary">{studentId}</span></p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {Array.isArray(results) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                Found {results.length} Notice{results.length > 1 ? 's' : ''}
              </h3>
            </div>
            
            {results.map((notice, idx) => {
              const Icon = getNoticeIcon(notice.type);
              const colorClass = getStatusColor(notice.status);
              
              return (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={`border-l-8 ${colorClass.replace('bg-', 'border-')}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${colorClass} text-white`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{notice.type} Notification</CardTitle>
                            <CardDescription className="text-xs">Ref: {notice.id}</CardDescription>
                          </div>
                        </div>
                        <Badge className={`${colorClass} text-white`}>
                          {notice.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="font-medium text-sm sm:text-base">
                        {notice.description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-muted-foreground pt-2">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          <span>{notice.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(notice.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            
            <div className="pt-4 border-t text-center">
              <p className="text-sm text-muted-foreground">Please visit OIR office with your Physical Student ID card for verification.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'OIR Hours', value: '09:00 - 17:00' },
          { title: 'Location', value: 'Admin Bldg 2F' },
          { title: 'Emergency', value: '+886-4-2359-0121' },
        ].map((item, i) => (
          <div key={i} className="bg-muted/50 p-4 rounded-xl text-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{item.title}</p>
            <p className="font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
