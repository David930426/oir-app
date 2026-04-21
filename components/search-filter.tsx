"use client";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories
}: SearchFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-card/40 p-2 md:pl-4 md:pr-2 rounded-3xl md:rounded-full border border-primary/10 shadow-sm backdrop-blur-md max-w-5xl mx-auto">
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0 mr-1 hidden md:block" />
        {categories.map(cat => (
          <Button 
            key={cat} 
            variant={selectedCategory === cat ? "default" : "ghost"}
            size="sm"
            className={`rounded-full shrink-0 transition-all ${selectedCategory === cat ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>
      <div className="relative w-full md:w-72 shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search news, events..." 
          className="pl-10 h-10 rounded-full bg-background border-primary/10 focus-visible:ring-primary/30 text-sm shadow-inner"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
