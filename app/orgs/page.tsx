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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Student Organizations</h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Connect with other students from your country or explore new hobbies. Tunghai has over 100+ clubs waiting for you.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/40 p-2 md:pl-4 md:pr-2 rounded-3xl md:rounded-full border border-primary/10 shadow-sm backdrop-blur-md">
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
          <TabsList className="bg-transparent h-auto p-0 gap-1 w-full justify-start overflow-x-auto scrollbar-hide">
            <TabsTrigger value="all" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">All</TabsTrigger>
            <TabsTrigger value="international" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">International</TabsTrigger>
            <TabsTrigger value="nationality" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Nationality</TabsTrigger>
            <TabsTrigger value="social" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Social</TabsTrigger>
            <TabsTrigger value="hobby" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Hobby</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search organizations..." 
            className="pl-11 h-10 rounded-full bg-background border-primary/10 focus-visible:ring-primary/30 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredOrgs.map((org, index) => (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index % 10) * 0.1 }}
            className="h-full"
          >
            <Card className="h-full flex flex-col group border border-primary/10 shadow-sm hover:shadow-lg rounded-3xl transition-all duration-300 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="p-6 pb-4 flex-none">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-medium px-3 py-1 rounded-full text-xs shadow-sm">
                    {org.category}
                  </Badge>
                  <div className="flex gap-2">
                    {org.socialLinks.instagram && (
                      <a href={org.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-pink-500 transition-colors">
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                    {org.socialLinks.line && (
                      <a href={org.socialLinks.line} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-green-500 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">{org.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-3 pt-2 leading-relaxed">
                  {org.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex flex-col flex-1">
                <div className="flex items-center gap-4 py-3 border-y border-primary/5 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span><strong className="text-foreground">{org.membersCount}</strong> Members</span>
                  </div>
                  <div className="h-4 w-px bg-primary/10" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span><strong className="text-foreground">{org.upcomingEvents.length}</strong> Events</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Upcoming</h4>
                  <ul className="space-y-2">
                    {org.upcomingEvents.map((event, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                        <span className="line-clamp-1">{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <Button variant="outline" className="w-full rounded-full h-10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                    View Profile & Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
