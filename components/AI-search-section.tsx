"use client";

import { useState, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

const SUGGESTIONS = [
  "How do I renew my ARC?",
  "Where is the OIR office?",
  "How can I apply for scholarships?",
  "What time does the mailroom close?",
  "How to get a work permit?",
];

export default function AISearchSection() {
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SUGGESTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerChat = (text?: string) => {
    const finalQuery = text || query;
    if (!finalQuery.trim()) return;

    window.dispatchEvent(
      new CustomEvent("open-ai-chat", {
        detail: { query: finalQuery },
      }),
    );
    setQuery("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-linear-to-r from-sky-400/40 via-indigo-500/40 to-sky-400/40 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <motion.div
          initial={false}
          animate={{ scale: query ? 1.02 : 1 }}
          className="relative overflow-hidden p-0.5 rounded-full bg-linear-to-r from-sky-400/20 via-indigo-500/20 to-sky-400/20 shadow-2xl group-hover:from-sky-400/40 group-hover:via-indigo-500/40 group-hover:to-sky-400/40 transition-colors duration-500"
        >
          <div className="bg-zinc-950/80 backdrop-blur-xl rounded-full flex items-center pr-2">
            <div className="pl-6 pr-3">
              <Sparkles className="h-5 w-5 text-sky-400 animate-pulse" />
            </div>
            <div className="flex-1 relative flex items-center h-14">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTriggerChat()}
                className="h-full bg-transparent border-none text-white text-lg placeholder:text-zinc-500 focus-visible:ring-0 w-full px-0 shadow-none"
                placeholder=""
              />
              {!query && (
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-zinc-500 text-lg overflow-hidden whitespace-nowrap">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={placeholderIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      {SUGGESTIONS[placeholderIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
            <Button
              onClick={() => handleTriggerChat()}
              disabled={!query.trim()}
              className="rounded-full bg-sky-500 hover:bg-sky-400 text-white h-10 px-5 group/btn font-semibold tracking-wide disabled:opacity-50 disabled:hover:bg-sky-500"
            >
              <Send className="h-4 w-4 mr-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform" />
              Ask OIR
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.slice(0, 3).map((suggestion, i) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            onClick={() => handleTriggerChat(suggestion)}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm hover:bg-white/10 hover:text-white hover:border-white/20 transition-all flex items-center gap-2 backdrop-blur-sm hover:cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-sky-400" />
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
