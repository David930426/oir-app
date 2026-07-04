"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PublicOrganization } from '@/lib/actions/organization.action';
import { Instagram, MessageCircle, Users, Calendar, Search, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

function primaryLink(org: PublicOrganization) {
  return org.socialLinks.instagram || org.socialLinks.line || org.socialLinks.facebook;
}

export default function OrgsClient({
  organizations,
}: {
  organizations: PublicOrganization[];
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || org.category.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-14 space-y-10">
      <div className="max-w-2xl space-y-3 border-b pb-8">
        <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary/60">
          Campus community
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-medium tracking-tight">
          Student organizations
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Connect with other students from your country or explore new hobbies. Tunghai has over 100+ clubs waiting for you.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-2 md:pl-4 md:pr-2 rounded-xl border shadow-sm">
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
            className="pl-11 h-10 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredOrgs.map((org, index) => (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index % 10) * 0.05 }}
            className="h-full"
          >
            <Card className="h-full flex flex-col group transition-all duration-200 hover:border-primary/30 hover:shadow-md overflow-hidden">
              <CardHeader className="p-6 pb-4 flex-none">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-medium px-3 py-1 rounded-full text-xs">
                    {org.category}
                  </Badge>
                  <div className="flex gap-2">
                    {org.socialLinks.instagram && (
                      <a href={org.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-pink-500 transition-colors" aria-label={`${org.name} on Instagram`}>
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                    {org.socialLinks.line && (
                      <a href={org.socialLinks.line} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-green-600 transition-colors" aria-label={`${org.name} on Line`}>
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
                <div className="flex items-center gap-4 py-3 border-y mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span><strong className="text-foreground">{org.membersCount}</strong> members</span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span><strong className="text-foreground">{org.upcomingEvents.length}</strong> events</span>
                  </div>
                </div>

                {org.upcomingEvents.length > 0 && (
                  <div className="space-y-3 mb-6">
                    <h4 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Upcoming</h4>
                    <ul className="space-y-2">
                      {org.upcomingEvents.map((event, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-brass mt-1.5 shrink-0" />
                          <span className="line-clamp-1">{event}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {primaryLink(org) && (
                  <div className="mt-auto">
                    <Button
                      variant="outline"
                      render={
                        <a
                          href={primaryLink(org)}
                          target="_blank"
                          rel="noreferrer"
                        />
                      }
                      nativeButton={false}
                      className="w-full rounded-lg h-10 gap-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-200"
                    >
                      Visit &amp; join
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredOrgs.length === 0 && (
        <div className="rounded-xl border border-dashed text-center p-12 space-y-3">
          <Users className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">No organizations found</h3>
            <p className="text-muted-foreground">Try a different search or category.</p>
          </div>
        </div>
      )}
    </div>
  );
}
