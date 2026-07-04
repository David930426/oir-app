"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PublicBulletin } from "@/lib/actions/bulletin.action";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Newspaper,
  Search,
} from "lucide-react";

interface Props {
  bulletins: PublicBulletin[];
  categories: string[];
}

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

export default function BulletinClient({ bulletins, categories }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const categoryTabs = useMemo(() => ["All", ...categories], [categories]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return bulletins.filter((item) => {
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [bulletins, searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );
  const featured = pageItems[0];
  const rest = pageItems.slice(1);

  const resetToFirstPage = () => setCurrentPage(1);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-14 space-y-10">
      {/* Header */}
      <div className="max-w-2xl space-y-3 border-b pb-8">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary/60"
        >
          From the office
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl md:text-5xl font-medium tracking-tight"
        >
          OIR Bulletin
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground leading-relaxed"
        >
          Campus announcements, scholarship opportunities, and upcoming events
          for the Tunghai international community.
        </motion.p>
      </div>

      {/* Filter chips + search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {categoryTabs.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? "default" : "outline"}
              className="rounded-full"
              onClick={() => {
                setSelectedCategory(cat);
                resetToFirstPage();
              }}
            >
              {cat}
            </Button>
          ))}
        </div>
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bulletins..."
            className="pl-9 rounded-lg"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              resetToFirstPage();
            }}
          />
        </div>
      </div>

      {/* Feed */}
      {bulletins.length === 0 ? (
        <EmptyState
          title="No bulletins yet"
          message="Check back soon for campus announcements and events."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No results"
          message="No bulletins match your search."
          action={
            <Button
              variant="outline"
              className="rounded-full"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {featured && <FeaturedCard item={featured} />}

          {rest.length > 0 && (
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              {rest.map((item) => (
                <BulletinCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col items-center gap-4 pt-4">
            {totalPages > 1 && (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page <span className="text-foreground">{page}</span> of{" "}
                  <span className="text-foreground">{totalPages}</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={page === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  resetToFirstPage();
                }}
                className="bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
              <span>per page</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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

function FeaturedCard({ item }: { item: PublicBulletin }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link href={`/main/bulletin/${item.id}`} className="block group">
        <div className="flex flex-col md:flex-row overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-md">
          <div className="md:w-72 shrink-0 aspect-video md:aspect-auto bg-ink relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('/tunghai.jpg')] bg-cover bg-center opacity-20" />
            <Newspaper className="relative h-12 w-12 text-brass/80" />
          </div>
          <div className="flex-1 p-6 md:p-8 space-y-3">
            <Pills item={item} />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(item.createdAt)}
            </div>
            <h3 className="font-heading text-2xl md:text-3xl font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed line-clamp-2">
              {item.description}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
              Read more <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function BulletinCard({ item }: { item: PublicBulletin }) {
  return (
    <Link href={`/main/bulletin/${item.id}`} className="block group h-full">
      <div className="h-full flex flex-col rounded-xl border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-md">
        <div className="flex-1 p-5 space-y-2.5">
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
        <div className="px-5 pb-5">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
            Read more <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-20 rounded-xl border border-dashed">
      <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
        <Inbox className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-muted-foreground">{message}</p>
      </div>
      {action}
    </div>
  );
}
