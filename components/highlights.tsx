"use client";

import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Inbox, Newspaper } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import type { PublicBulletin } from '@/lib/actions/bulletin.action';

const RECENT_WINDOW_MS = 48 * 60 * 60 * 1000;

function isRecent(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < RECENT_WINDOW_MS;
}

function formatDate(createdAt: string) {
  return new Date(createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Pills({ item }: { item: PublicBulletin }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {isRecent(item.createdAt) && (
        <Badge variant="destructive" className="rounded-full">
          New
        </Badge>
      )}
      <Badge className="rounded-full border-transparent bg-primary/10 text-primary">
        {item.category}
      </Badge>
    </div>
  );
}

export function Highlights({ bulletins }: { bulletins: PublicBulletin[] }) {
  const [featured, ...rest] = bulletins.slice(0, 4);

  return (
    <section className="max-w-6xl mx-auto px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b pb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary/60 mb-2">
            From the office
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-medium tracking-tight">
            OIR Bulletin
          </h2>
        </div>
        <Link
          href="/main/bulletin"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary shrink-0"
        >
          View all
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {!featured ? (
        <div className="flex flex-col items-center text-center gap-4 py-16 rounded-xl border border-dashed">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
            <Inbox className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold">No bulletins yet</p>
            <p className="text-muted-foreground">Check back soon for campus announcements and events.</p>
          </div>
        </div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Link href={`/main/bulletin/${featured.id}`} className="block group">
              <div className="flex flex-col md:flex-row overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                <div className="md:w-72 shrink-0 aspect-video md:aspect-auto bg-ink relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/tunghai.jpg')] bg-cover bg-center opacity-20" />
                  <Newspaper className="relative h-12 w-12 text-brass/80" />
                </div>
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center gap-3">
                  <Pills item={featured} />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Latest highlight · {formatDate(featured.createdAt)}
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {featured.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed line-clamp-2">
                    {featured.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all w-fit">
                    Read more <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((item) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="h-full">
                  <Link href={`/main/bulletin/${item.id}`} className="block group h-full">
                    <div className="h-full flex flex-col gap-2.5 p-5 rounded-xl border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                      <Pills item={item} />
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.createdAt)}
                      </div>
                      <h3 className="text-lg font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
