"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockNews } from '@/lib/mockData';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Bulletin() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">OIR Bulletin</h1>
        <p className="text-lg text-muted-foreground">
          Your central source for campus announcements, scholarship opportunities, and upcoming events for the Tunghai international community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockNews.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col group border-none shadow-sm hover:shadow-lg transition-all overflow-hidden bg-card/60 backdrop-blur-md hover:ring-1 ring-[#2B4156]/20">
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {item.isNew && (
                    <Badge className="bg-[#2B4156] border-none shadow-sm">NEW</Badge>
                  )}
                  <Badge variant="secondary" className="bg-white/90 text-black border-none font-bold">
                    {item.category}
                  </Badge>
                </div>
              </div>
              <CardHeader className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="h-3 w-3" />
                  {item.date}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors leading-snug">
                  {item.title}
                </CardTitle>
                <CardDescription className="line-clamp-4 pt-2">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <div className="p-6 pt-0 mt-auto">
                <Button className="w-full gap-2 group/btn">
                  Read Full Details
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <h2 className="text-3xl font-bold">Stay Notified</h2>
            <p className="opacity-90">Get the latest scholarship deadlines and campus updates sent directly to your student inbox.</p>
          </div>
          <Button variant="secondary" size="lg" className="h-14 px-8 font-bold text-lg">
            Subscribe to Newsletter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
