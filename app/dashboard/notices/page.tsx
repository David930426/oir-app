"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Search,  
  CheckCircle2, 
  Trash2, 
  Filter,
  Package,
  FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockNotices } from '@/lib/mockData';
import { StudentNotice } from '@/types';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminNotices() {
  const [notices, setNotices] = useState<StudentNotice[]>(mockNotices);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [newNotice, setNewNotice] = useState({
    studentId: '',
    type: 'Package' as StudentNotice['type'],
    description: '',
    location: 'OIR Office'
  });

  const filteredNotices = notices.filter(n => 
    n.studentId.includes(search) || 
    n.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNotice = () => {
    const notice: StudentNotice = {
      id: `NT-${Date.now()}`,
      ...newNotice,
      status: 'Ready',
      timestamp: new Date().toISOString()
    };
    setNotices([notice, ...notices]);
    setIsAdding(false);
    setNewNotice({ studentId: '', type: 'Package', description: '', location: 'OIR Office' });
  };

  const handleDelete = (id: string) => {
    setNotices(notices.filter(n => n.id !== id));
  };

  const markCollected = (id: string) => {
    setNotices(notices.map(n => n.id === id ? { ...n, status: 'Processing' } : n));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Notices</h1>
          <p className="text-sm text-muted-foreground">Manage packages and documents for student pickup</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Register New Item
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by Student ID or item..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Student ID</label>
                    <Input 
                      placeholder="e.g. 1120005" 
                      value={newNotice.studentId}
                      onChange={(e) => setNewNotice({...newNotice, studentId: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border text-sm"
                      value={newNotice.type}
                      onChange={(e) => setNewNotice({...newNotice, type: e.target.value as any})}
                    >
                      <option value="Package">Package</option>
                      <option value="Document">Document</option>
                      <option value="ARC">ARC Card</option>
                      <option value="ID">Student ID</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description / Notes</label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="e.g. Large blue box from Amazon" 
                        value={newNotice.description}
                        onChange={(e) => setNewNotice({...newNotice, description: e.target.value})}
                      />
                      <Button onClick={handleAddNotice}>Save</Button>
                      <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Registered At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotices.map((notice) => (
              <TableRow key={notice.id} className="group">
                <TableCell className="font-bold font-mono">{notice.studentId}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {notice.type === 'Package' ? <Package className="h-4 w-4 opacity-50" /> : <FileText className="h-4 w-4 opacity-50" />}
                    {notice.type}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground max-w-sm truncate">
                  {notice.description}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={notice.status === 'Ready' ? 'default' : 'secondary'}
                    className={notice.status === 'Ready' ? 'bg-[#2B4156]' : ''}
                  >
                    {notice.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                  {new Date(notice.timestamp).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600" onClick={() => markCollected(notice.id)}>
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(notice.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
