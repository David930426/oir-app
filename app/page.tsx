"use client";

import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import AISearchSection from '@/components/AI-search-section';
import { Highlights } from '@/components/highlights';
import { QuickActions } from '@/components/quick-actionss';


export default function Home() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative min-h-160 lg:min-h-[85vh] flex items-center justify-center text-center overflow-hidden bg-zinc-950 text-white rounded-[2.5rem] mx-4 sm:mx-6 lg:mx-8 mt-6 border border-white/5 shadow-2xl">
        <img 
          src="tunghai.jpg" 
          alt="University" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-b from-zinc-950/10 via-zinc-950/60 to-zinc-950/90" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950/30 via-transparent to-zinc-950/30" />
        <div className="relative z-10 px-4 py-20 lg:py-28 max-w-5xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-medium text-sky-300 shadow-xl"
          >
            <Sparkles className="h-3 w-3" />
            AI-Powered Student Support
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            Your Journey at Tunghai, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-300 via-slate-200 to-slate-400 drop-shadow-sm">Simplified.</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed drop-shadow"
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

      <QuickActions />

      <Highlights />
    </div>
  );
}
