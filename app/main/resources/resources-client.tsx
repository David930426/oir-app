"use client";

import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  BookOpen,
  FileCheck,
  HelpCircle,
  FileBox
} from 'lucide-react';
import { useState } from 'react';
import type { PublicResource } from '@/lib/actions/resource.action';

export default function ResourcesClient({
  resources,
}: {
  resources: PublicResource[];
}) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                         r.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory ? r.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { name: 'Essential', icon: FileCheck, color: 'text-blue-700', bg: 'bg-blue-50' },
    { name: 'Guideline', icon: BookOpen, color: 'text-teal-700', bg: 'bg-teal-50' },
    { name: 'Form', icon: FileBox, color: 'text-amber-700', bg: 'bg-amber-50' },
    { name: 'Other', icon: HelpCircle, color: 'text-violet-700', bg: 'bg-violet-50' },
  ];

  const getFileTypeIcon = (type: PublicResource['fileType']) => {
    switch (type) {
      case 'PDF': return <Badge className="text-[10px] bg-primary border-none">PDF</Badge>;
      case 'Doc': return <Badge className="text-[10px] bg-secondary text-secondary-foreground border-none">DOC</Badge>;
      case 'Link': return <Badge className="text-[10px] bg-primary/10 text-primary border-none">URL</Badge>;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 pt-10 pb-16 md:pt-14 max-w-6xl space-y-10">
      <div className="max-w-2xl space-y-3 border-b pb-8">
        <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary/60">
          Documents &amp; guides
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-medium tracking-tight">
          Resources &amp; downloads
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Find all official university documents, application forms, and international student guidelines in one place.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-6 md:sticky md:top-32">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="pl-9 h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground px-2">Categories</h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:cursor-pointer ${!activeCategory ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted'}`}
              >
                All resources
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors hover:cursor-pointer ${activeCategory === cat.name ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted'}`}
                >
                  <span className="flex items-center gap-2">
                    <cat.icon className="h-4 w-4" />
                    {cat.name}s
                  </span>
                  <span className="text-[10px] opacity-60">
                    ({resources.filter(r => r.category === cat.name).length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {filteredResources.length === 0 ? (
            <div className="rounded-xl border border-dashed text-center p-12 space-y-4">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No documents found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or category filters.</p>
              </div>
              <Button variant="outline" onClick={() => { setSearch(''); setActiveCategory(null); }}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredResources.map((resource, i) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="h-full flex flex-col group transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2.5 rounded-lg ${categories.find(c => c.name === resource.category)?.bg || 'bg-muted'} ${categories.find(c => c.name === resource.category)?.color || 'text-muted-foreground'}`}>
                          {(() => {
                            const Icon = categories.find(c => c.name === resource.category)?.icon || FileText;
                            return <Icon className="h-5 w-5" />;
                          })()}
                        </div>
                        {getFileTypeIcon(resource.fileType)}
                      </div>
                      <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-xs">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto pt-2">
                      <Button
                        variant="ghost"
                        render={
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                          />
                        }
                        nativeButton={false}
                        className="w-full justify-between hover:bg-primary/5 hover:text-primary text-sm font-medium h-9 group/btn"
                      >
                        {resource.fileType === 'Link' ? (
                          <>
                            Visit resource
                            <ExternalLink className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Download file
                            <Download className="h-4 w-4 transition-transform group-hover/btn:translate-y-0.5" />
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="relative overflow-hidden rounded-xl bg-ink text-white">
        <div className="absolute inset-0 bg-[url('/tunghai.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/90 to-ink/70" />
        <div className="relative z-10 p-8 md:p-12 space-y-5 max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-brass">
            Need help?
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-medium tracking-tight">
            Can&apos;t find a form?
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            Our staff at the Office of International Relations is here to help. You can visit us in person or use our AI assistant to get help with specific procedures.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              render={<a href="mailto:oir@thu.edu.tw" />}
              nativeButton={false}
              className="bg-white text-ink hover:bg-white/90 font-semibold"
            >
              Contact support
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
