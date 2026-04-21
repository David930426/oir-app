"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockNews } from '@/lib/mockData';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { SearchFilter } from '@/components/search-filter';

export default function Bulletin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Extract unique categories from the mock data
  const categories = useMemo(() => {
    const cats = new Set(mockNews.map(item => item.category));
    return ["All", ...Array.from(cats)];
  }, []);

  // Filter data based on search and category
  const filteredNews = useMemo(() => {
    return mockNews.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Featured logic
  const isFirstPage = currentPage === 1 && searchQuery === "" && selectedCategory === "All";
  const featuredNews = isFirstPage ? paginatedNews.slice(0, 2) : [];
  const regularNews = isFirstPage ? paginatedNews.slice(2) : paginatedNews;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      {/* Hero Section */}
      <div className="relative py-8 md:py-12 text-center space-y-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            OIR <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-indigo-500">Bulletin</span>
          </h1>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Your central source for campus announcements, scholarship opportunities, and upcoming events for the Tunghai international community.
        </motion.p>
      </div>

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      >
        <SearchFilter 
          searchQuery={searchQuery}
          onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
          selectedCategory={selectedCategory}
          onCategoryChange={(c) => { setSelectedCategory(c); setCurrentPage(1); }}
          categories={categories}
        />
      </motion.div>

      {/* News Grid */}
      {paginatedNews.length === 0 ? (
        <div className="text-center py-24 bg-card/30 rounded-3xl border border-dashed border-primary/20">
          <p className="text-xl font-semibold text-muted-foreground mb-4">No bulletins found matching your criteria.</p>
          <Button variant="outline" className="rounded-full" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Featured News (Only on first page without active filters) */}
          {featuredNews.length > 0 && (
            <div className={`grid grid-cols-1 gap-6 md:gap-8 ${featuredNews.length === 1 ? '' : 'md:grid-cols-2'}`}>
              {featuredNews.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className="h-full flex flex-col group border border-primary/20 shadow-lg hover:shadow-2xl rounded-[2rem] transition-all duration-500 bg-card/50 backdrop-blur-sm overflow-hidden">
                    <div className="aspect-video] overflow-hidden relative">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-4 left-4 flex gap-2 z-10">
                        {item.isNew && (
                          <Badge className="bg-red-500 animate-pulse border-none shadow-md px-3 py-1 text-xs">NEW</Badge>
                        )}
                        <Badge variant="secondary" className="bg-white text-black border-none font-bold px-3 py-1 shadow-md text-xs uppercase">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="flex-1 p-8">
                      <div className="flex items-center gap-2 text-sm text-primary/80 font-semibold uppercase tracking-wider mb-2">
                        <Calendar className="h-4 w-4" />
                        {item.date}
                      </div>
                      <CardTitle className="text-2xl md:text-3xl line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 pt-4 text-base leading-relaxed">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <div className="p-8 pt-0 mt-auto">
                      <Button className="w-fit rounded-full gap-2 group/btn" size="lg">
                        Read Article
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Regular News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {regularNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col group border border-primary/10 shadow-md hover:shadow-xl rounded-3xl transition-all duration-300 bg-card/50 backdrop-blur-sm overflow-hidden">
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {item.isNew && (
                        <Badge className="bg-red-500 animate-pulse border-none shadow-sm px-3 py-1">NEW</Badge>
                      )}
                      <Badge variant="secondary" className="bg-white/95 text-black border-none font-bold px-3 py-1 shadow-sm">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="flex-1 p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </div>
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 pt-3 leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <div className="p-6 pt-0 mt-auto">
                    <Button className="w-full rounded-full gap-2 group/btn" variant="outline">
                      Read Full Details
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {filteredNews.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-primary/10 mt-8">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Show</span>
            <select 
              value={itemsPerPage} 
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-card border border-primary/20 rounded-lg px-3 py-1.5 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm cursor-pointer"
            >
              <option value={6}>6 items</option>
              <option value={12}>12 items</option>
              <option value={24}>24 items</option>
            </select>
            <span>per page</span>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="rounded-full shadow-sm gap-2" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                Page <span className="text-foreground">{currentPage}</span> of <span className="text-foreground">{totalPages}</span>
              </span>
              <Button 
                variant="outline" 
                className="rounded-full shadow-sm gap-2" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Newsletter Section */}
      <Card className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground rounded-[2.5rem] border-none shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/tunghai.jpg')] opacity-10 mix-blend-overlay object-cover"></div>
        <CardContent className="p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Stay Notified</h2>
            <p className="text-lg opacity-90 leading-relaxed">Get the latest scholarship deadlines and campus updates sent directly to your student inbox.</p>
          </div>
          <Button variant="secondary" size="lg" className="h-14 px-8 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg">
            Subscribe to Newsletter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
