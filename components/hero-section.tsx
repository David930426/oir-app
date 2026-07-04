"use client";

import { motion } from "motion/react";
import AISearchSection from "@/components/AI-search-section";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <img
        src="/tunghai.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-25"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-linear-to-b from-ink/60 via-ink/80 to-ink" />

      <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center pt-14 md:pt-18 lg:pt-20 pb-24 md:pb-28 space-y-6">
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] md:text-xs uppercase tracking-[0.28em] font-semibold text-brass"
        >
          Office of International Relations
        </motion.p>

        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.12]"
        >
          Your journey at Tunghai,
          <br />
          <span className="italic text-white/80">simplified.</span>
        </motion.h1>

        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed"
        >
          Personalized student notices, campus news, and scholarship
          opportunities — in one official university portal.
        </motion.p>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-4"
        >
          <AISearchSection />
        </motion.div>
      </div>
    </section>
  );
}
