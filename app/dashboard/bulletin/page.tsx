"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Calendar, 
  Trash2, 
  Edit3, 
  Eye,
  MessageSquare,
  Globe,
} from 'lucide-react';
import { mockNews } from '@/lib/mockData';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminBulletin() {
  const [news, setNews] = useState(mockNews);
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Filtered news
  const filteredNews = news.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setNews(news.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">OIR Bulletin Manager</h1>
          <p className="text-sm text-muted-foreground">Publish and manage campus-wide announcements and news</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2 bg-primary">
          <Plus className="h-4 w-4" />
          Create Article
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title, category, or content..." 
            className="pl-10 h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Publish New Announcement</CardTitle>
                <CardDescription>Enter details for the new bulletin entry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Article Title" className="col-span-1 md:col-span-2" />
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Category</label>
                    <select className="w-full h-10 px-3 rounded-md border text-sm">
                      <option>Scholarship</option>
                      <option>Event</option>
                      <option>Academic</option>
                      <option>Immigration</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Publication Date</label>
                    <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                <textarea 
                  className="w-full min-h-37.5 p-4 rounded-xl border text-sm focus:ring-2 ring-primary/20 outline-none" 
                  placeholder="Start writing your announcement content here..."
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setIsCreating(false)}>Discard</Button>
                  <Button onClick={() => setIsCreating(false)}>Publish to Portal</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {filteredNews.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="group hover:border-primary/30 transition-all cursor-default">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 aspect-video md:aspect-square overflow-hidden shrink-0">
                   <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all border-r" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                   <div className="space-y-2">
                      <div className="flex justify-between items-start">
                         <Badge variant="outline" className="text-[10px] uppercase tracking-widest">{item.category}</Badge>
                         <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                            <Calendar className="h-3 w-3" />
                            {item.date}
                         </div>
                      </div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl">{item.description}</p>
                   </div>
                   <div className="flex justify-between items-center pt-4 border-t mt-4">
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                         <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> 1.2k views</span>
                         <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> 12 comments</span>
                         <span className="flex items-center gap-1 font-bold text-primary"><Globe className="h-3 w-3" /> Public</span>
                      </div>
                      <div className="flex gap-1">
                         <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-100">
                            <Edit3 className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/5 hover:text-destructive" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                   </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
