"use client";

import { useState, useEffect } from 'react';
import { Search, Sparkles, Send, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

const SUGGESTIONS = [
  "How do I renew my ARC?",
  "Where is the OIR office?",
  "How can I apply for scholarships?",
  "What time does the mailroom close?",
  "How to get a work permit?"
];

export default function AISearchSection() {
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % SUGGESTIONS.length);
        setIsTyping(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerChat = (text?: string) => {
    const finalQuery = text || query;
    if (!finalQuery.trim()) return;
    
    window.dispatchEvent(new CustomEvent('open-ai-chat', { 
      detail: { query: finalQuery } 
    }));
    setQuery('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="relative group">
        <motion.div 
          initial={false}
          animate={{ scale: query ? 1.02 : 1 }}
          className="relative overflow-hidden p-0.5 rounded-2xl bg-linear-to-r from-[#2B4156] via-[#4A6D8C] to-[#8BA4B4] shadow-xl"
        >
          <div className="bg-[#1a252f] rounded-[14px] flex items-center pr-2">
            <div className="pl-4 pr-2">
              <Sparkles className="h-5 w-5 text-[#8BA4B4] animate-pulse" />
            </div>
            <div className="flex-1 relative">
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTriggerChat()}
                className="h-14 bg-transparent border-none text-white text-lg placeholder:text-zinc-500 focus-visible:ring-0 w-full"
                placeholder=""
              />
              <AnimatePresence mode="wait">
                {!query && (
                  <motion.div
                    key={placeholderIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 flex items-center pointer-events-none text-zinc-500 text-lg overflow-hidden whitespace-nowrap"
                  >
                    {isTyping ? SUGGESTIONS[placeholderIndex] : ""}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button 
              onClick={() => handleTriggerChat()}
              disabled={!query.trim()}
              className="rounded-xl bg-white text-[#2B4156] hover:bg-zinc-200 h-10 px-4 group/btn font-bold"
            >
              <Send className="h-4 w-4 mr-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform" />
              Ask OIR
            </Button>
          </div>
        </motion.div>
        
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-linear-to-r from-[#2D4356] to-[#8BA4B4] rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity pointer-events-none" />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.slice(0, 3).map((suggestion, i) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            onClick={() => handleTriggerChat(suggestion)}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs hover:bg-white/10 hover:text-white transition-all flex items-center gap-2 backdrop-blur-sm"
          >
            <Sparkles className="h-3 w-3 text-[#8BA4B4]" />
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
