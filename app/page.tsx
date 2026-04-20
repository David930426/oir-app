"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Newspaper, Users, ArrowRight, FileText, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { mockNews } from '@/lib/mockData';
import { motion } from 'motion/react';
import AISearchSection from '@/components/Home/AISearchSection';


export default function Home() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative h-150 flex items-center justify-center text-center overflow-hidden bg-zinc-900 text-white rounded-3xl mx-4 mt-6">
        <img 
          src="https://picsum.photos/seed/univ/1920/1080?blur=2" 
          alt="University" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="relative z-10 px-4 max-w-5xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#8BA4B4]"
          >
            <Sparkles className="h-3 w-3" />
            AI-Powered Student Support
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
          >
            Your Journey at Tunghai, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-[#8BA4B4]">Simplified.</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto"
          >
            Access personalized student notices, campus news, and scholarship opportunities through our smart university portal.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-4"
          >
            <AISearchSection />
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Notice Board', icon: Bell, path: '/mail', color: 'bg-[#2B4156]', desc: 'Track mail & docs' },
          { label: 'OIR Bulletin', icon: Newspaper, path: '/news', color: 'bg-[#4A6D8C]', desc: 'Latest updates' },
          { label: 'Resources', icon: FileText, path: '/resources', color: 'bg-[#6D8DA6]', desc: 'Forms & guides' },
          { label: 'Organizations', icon: Users, path: '/orgs', color: 'bg-[#8BA4B4]', desc: 'Student societies' },
        ].map((action, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={action.path}>
              <Card className="h-full hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-3 text-center">
                  <div className={`p-4 rounded-2xl ${action.color} text-white shadow-inner`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-bold text-sm sm:text-base block">{action.label}</span>
                    <span className="text-[10px] text-muted-foreground">{action.desc}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Latest Highlights */}
      <section className="container mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">OIR Bulletin: Updates & Opportunities</h2>
          <Button variant="ghost" className="gap-2 group">
            View Archive <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockNews.map((news) => (
            <motion.div key={news.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}>
              <Card className="overflow-hidden h-full flex flex-col group border-none shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-4/3 overflow-hidden relative">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {news.isNew && (
                    <Badge className="absolute top-3 left-3 bg-red-500 animate-pulse border-none">NEW</Badge>
                  )}
                  <Badge className="absolute bottom-3 right-3 bg-white/90 text-black border-none text-[10px] uppercase font-bold">
                    {news.category}
                  </Badge>
                </div>
                <CardHeader className="p-4 space-y-2 flex-1">
                  <span className="text-xs text-muted-foreground block">{news.date}</span>
                  <CardTitle className="text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {news.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
