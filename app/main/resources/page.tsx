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
import { mockResources } from '@/lib/mockData';
import { Resource } from '@/types';

export default function Resources() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredResources = mockResources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                         r.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory ? r.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { name: 'Essential', icon: FileCheck, color: 'text-[#2B4156]', bg: 'bg-[#2B4156]/5' },
    { name: 'Guideline', icon: BookOpen, color: 'text-[#4A6D8C]', bg: 'bg-[#4A6D8C]/5' },
    { name: 'Form', icon: FileBox, color: 'text-[#6D8DA6]', bg: 'bg-[#6D8DA6]/5' },
    { name: 'Other', icon: HelpCircle, color: 'text-[#8BA4B4]', bg: 'bg-[#8BA4B4]/5' },
  ];

  const getFileTypeIcon = (type: Resource['fileType']) => {
    switch (type) {
      case 'PDF': return <Badge className="text-[10px] bg-[#2B4156] border-none">PDF</Badge>;
      case 'Doc': return <Badge className="text-[10px] bg-[#4A6D8C] border-none text-white">DOC</Badge>;
      case 'Link': return <Badge className="text-[10px] bg-[#8BA4B4]/20 text-[#2B4156] border-none">URL</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">Resources & Downloads</h1>
        <p className="text-lg text-muted-foreground">
          Find all official university documents, application forms, and international student guidelines in one place.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-6 md:sticky md:top-24">
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
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-2">Categories</h3>
            <div className="space-y-1">
              <button 
                onClick={() => setActiveCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!activeCategory ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted'}`}
              >
                All Resources
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === cat.name ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted'}`}
                >
                  <span className="flex items-center gap-2">
                    <cat.icon className="h-4 w-4" />
                    {cat.name}s
                  </span>
                  <span className="text-[10px] opacity-60">
                    ({mockResources.filter(r => r.category === cat.name).length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {filteredResources.length === 0 ? (
            <Card className="border-none shadow-sm bg-muted/20 text-center p-12">
              <CardContent className="space-y-4">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No documents found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms or category filters.</p>
                </div>
                <Button variant="outline" onClick={() => { setSearch(''); setActiveCategory(null); }}>
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredResources.map((resource, i) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="h-full flex flex-col group hover:shadow-md transition-all border-none bg-card/60 backdrop-blur-sm shadow-sm ring-1 ring-zinc-100 hover:ring-[#2B4156]/20">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2.5 rounded-xl ${categories.find(c => c.name === resource.category)?.bg || 'bg-zinc-50'} ${categories.find(c => c.name === resource.category)?.color || 'text-zinc-600'}`}>
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
                       <Button variant="ghost" className="w-full justify-between hover:bg-primary/5 hover:text-primary text-sm font-medium h-9 group/btn">
                        {resource.fileType === 'Link' ? (
                          <>
                            Visit Resource
                            <ExternalLink className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Download File
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

      <section className="bg-zinc-900 text-white rounded-3xl p-8 md:p-12 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 space-y-6 max-w-2xl">
          <h2 className="text-3xl font-bold">Can't find a form?</h2>
          <p className="text-zinc-300 text-lg">
            Our staff at the Office of International Relations is here to help. You can visit us in person or use our AI Assistant to get help with specific procedures.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200">
              Contact Support
            </Button>
            <Button size="lg" variant="outline" className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800">
              Book Appointment
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
