"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockOrgs } from '@/lib/mockData';
import { Instagram, MessageCircle, Users, Calendar, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function Orgs() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrgs = mockOrgs.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         org.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || org.category.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">Student Organizations</h1>
        <p className="text-lg text-muted-foreground">
          Connect with other students from your country or explore new hobbies. Tunghai has over 100+ clubs waiting for you.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
          <TabsList className="bg-card border h-10 p-1">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="international">International</TabsTrigger>
            <TabsTrigger value="nationality">Nationality</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="hobby">Hobby</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search organizations..." 
            className="pl-10 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrgs.map((org, index) => (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full group hover:shadow-xl transition-all duration-300 border-none bg-card/60 backdrop-blur-md shadow-sm hover:ring-1 ring-[#2B4156]/20">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-[#2B4156]/5 text-[#2B4156] border-[#2B4156]/20">
                    {org.category}
                  </Badge>
                  <div className="flex gap-2">
                    {org.socialLinks.instagram && (
                      <a href={org.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-pink-500 transition-colors">
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {org.socialLinks.line && (
                      <a href={org.socialLinks.line} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-green-500 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">{org.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-3 min-h-18">
                  {org.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 py-2 border-y border-zinc-100">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{org.membersCount} Members</span>
                  </div>
                  <div className="h-4 w-px bg-zinc-200" />
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{org.upcomingEvents.length} Events</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Upcoming</h4>
                  <ul className="space-y-2">
                    {org.upcomingEvents.map((event, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full h-10 group-hover:-translate-y-0.5 transition-transform">
                  View Profile & Join
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
