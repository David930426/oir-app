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

const SUGGESTED_CHIPS = [
  "How do I renew my ARC?",
  "Where is the OIR office?",
  "Scholarship deadlines?",
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
    <div className="w-full max-w-2xl mx-auto space-y-5">
      <div className="rounded-xl border border-white/15 bg-white/[0.06] backdrop-blur-md shadow-2xl focus-within:border-brass/60 transition-colors">
        <div className="flex items-center pr-2">
          <div className="pl-5 pr-3">
            <Sparkles className="h-4 w-4 text-brass" />
          </div>
          <div className="flex-1 relative flex items-center h-14">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTriggerChat()}
              className="h-full bg-transparent border-none text-white text-base placeholder:text-white/40 focus-visible:ring-0 w-full px-0 shadow-none"
              placeholder=""
              aria-label="Ask the OIR assistant"
            />
            {!query && (
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-white/40 text-base overflow-hidden whitespace-nowrap">
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
            className="rounded-lg bg-white text-ink hover:bg-white/90 h-10 px-5 font-semibold disabled:opacity-40 disabled:hover:bg-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Ask OIR
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
        {SUGGESTED_CHIPS.map((suggestion, i) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            onClick={() => setQuery(suggestion)}
            className="px-3.5 py-1.5 rounded-full border border-white/15 text-white/60 text-[13px] hover:text-white hover:border-brass/50 transition-colors flex items-center gap-2 hover:cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="h-3 w-3 text-brass shrink-0" />
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
