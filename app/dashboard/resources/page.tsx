"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  FileText, 
  Trash2, 
  Upload, 
  FileBox,
  LayoutGrid,
  List as ListIcon,
  Edit3
} from 'lucide-react';
import { mockResources } from '@/lib/mockData';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminResources() {
  const [resources, setResources] = useState(mockResources);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = Array.from(new Set(resources.map(r => r.category)));

  const filtered = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? r.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Management</h1>
          <p className="text-sm text-muted-foreground">Manage downloadable forms, guidelines, and external links</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
           <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
             <Upload className="h-4 w-4" />
             Batch Upload
           </Button>
           <Button className="gap-2 flex-1 sm:flex-none">
             <Plus className="h-4 w-4" />
             New Resource
           </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search resources by title or category..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex bg-muted/50 p-1 rounded-lg border">
               <button 
                 onClick={() => setViewMode('grid')}
                 className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
               >
                 <LayoutGrid className="h-4 w-4" />
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
               >
                 <ListIcon className="h-4 w-4" />
               </button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Badge 
            variant={selectedCategory === null ? 'default' : 'secondary'} 
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedCategory(null)}
          >
            All Resources
          </Badge>
          {categories.map(cat => (
            <Badge 
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'secondary'} 
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed flex flex-col items-center justify-center py-16 bg-muted/30">
          <FileBox className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-1">No resources found</h3>
          <p className="text-sm text-muted-foreground mb-6">Try adjusting your search or category filters</p>
          <Button variant="outline" onClick={() => { setSearch(''); setSelectedCategory(null); }}>
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className={viewMode === 'list' ? 'flex flex-col gap-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
          <AnimatePresence mode="popLayout">
            {filtered.map((resource, i) => (
              <motion.div
                layout
                key={resource.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="h-full"
              >
                {viewMode === 'list' ? (
                  <Card className="hover:border-primary/50 transition-all group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
                        <div className="h-12 w-12 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                           <FileText className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex flex-wrap items-center gap-2 mb-1">
                             <h4 className="text-base font-semibold truncate">{resource.title}</h4>
                             <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{resource.fileType}</Badge>
                           </div>
                           <p className="text-sm text-muted-foreground truncate">{resource.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end sm:justify-start">
                           <Badge variant="outline" className="text-[10px] font-mono hidden sm:inline-flex">
                             ID: {resource.id}
                           </Badge>
                           <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                               <Edit3 className="h-4 w-4" />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(resource.id)}>
                               <Trash2 className="h-4 w-4" />
                             </Button>
                           </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full flex flex-col hover:border-primary/50 hover:shadow-md transition-all group overflow-hidden">
                    <CardHeader className="pb-3">
                       <div className="flex justify-between items-start mb-4">
                          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                             <FileBox className="h-6 w-6" />
                          </div>
                          <Badge variant="secondary" className="text-[10px] uppercase">{resource.fileType}</Badge>
                       </div>
                       <CardTitle className="text-lg line-clamp-1" title={resource.title}>{resource.title}</CardTitle>
                       <CardDescription className="text-xs uppercase tracking-wider font-semibold text-primary/80">
                          {resource.category}
                       </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                       <p className="text-sm text-muted-foreground line-clamp-2 mb-6" title={resource.description}>
                         {resource.description}
                       </p>
                       <div className="flex gap-2 pt-4 border-t mt-auto opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="outline" size="sm" className="flex-1 gap-2">
                            <Edit3 className="h-4 w-4" /> Edit
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10 gap-2" onClick={() => handleDelete(resource.id)}>
                            <Trash2 className="h-4 w-4" /> Delete
                          </Button>
                       </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Card className="border-dashed border-2 bg-muted/10">
        <CardContent className="p-12 text-center flex flex-col items-center gap-4">
           <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
           </div>
           <div>
              <h3 className="font-bold">Add Missing Content</h3>
              <p className="text-sm text-muted-foreground">Quickly populate the repository with new student resources.</p>
           </div>
           <Button variant="secondary">Open Resource Builder</Button>
        </CardContent>
      </Card>
    </div>
  );
}
