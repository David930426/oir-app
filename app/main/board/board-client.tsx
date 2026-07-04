"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCircle2,
  Clock,
  EyeOff,
  FileText,
  Lock,
  MapPin,
  Package,
  Search,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  searchNoticesByStudentId,
  type FullNotice,
  type PublicNotice,
} from "@/lib/actions/notice.action";

type NoticeType = FullNotice["type"];
type NoticeStatus = FullNotice["status"];

const STATUS_STYLES: Record<NoticeStatus, string> = {
  Ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Action Needed": "bg-amber-50 text-amber-700 border-amber-200",
  "Picked Up": "bg-slate-100 text-slate-600 border-slate-200",
};

const STATUS_ACCENT: Record<NoticeStatus, string> = {
  Ready: "border-l-emerald-500",
  "Action Needed": "border-l-amber-500",
  "Picked Up": "border-l-slate-300",
};

// Higher = more important; Picked Up sinks to the bottom.
const STATUS_PRIORITY: Record<NoticeStatus, number> = {
  "Action Needed": 0,
  Ready: 1,
  "Picked Up": 2,
};

function sortByPriority<T extends { status: NoticeStatus; createdAt: string }>(
  notices: T[],
): T[] {
  return [...notices].sort((a, b) => {
    const diff = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
    if (diff !== 0) return diff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function typeIcon(type: NoticeType) {
  switch (type) {
    case "Package":
      return Package;
    case "Document":
    case "Letter":
      return FileText;
    case "ARC":
      return CheckCircle2;
    default:
      return Bell;
  }
}

interface Props {
  ownerBatchId: string | null;
  ownerNotices: FullNotice[];
}

type SearchState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "empty"; queried: string }
  | { kind: "public"; queried: string; notices: PublicNotice[] }
  | { kind: "full"; queried: string; notices: FullNotice[] };

export default function BoardClient({ ownerBatchId, ownerNotices }: Props) {
  // Logged-in owner: skip search UI entirely, show their notices directly.
  if (ownerBatchId) {
    return (
      <OwnerView batchId={ownerBatchId} notices={ownerNotices} />
    );
  }
  return <SearchView />;
}

function OwnerView({
  batchId,
  notices,
}: {
  batchId: string;
  notices: FullNotice[];
}) {
  const sorted = sortByPriority(notices);
  const activeCount = sorted.filter((n) => n.status !== "Picked Up").length;
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl space-y-8">
      <div className="text-center space-y-3">
        <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary/60">
          Mail &amp; documents
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-medium tracking-tight">
          Your notice board
        </h1>
        <p className="text-muted-foreground">
          Showing notices for{" "}
          <span className="font-mono font-semibold text-foreground">
            {batchId}
          </span>
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 flex items-center gap-3 text-sm text-emerald-800">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        You&apos;re signed in, so full details are visible only to you.
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          title="You're all caught up"
          message="No pending notices on file for your Student ID."
        />
      ) : (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">
            {activeCount > 0
              ? `${activeCount} active notice${activeCount === 1 ? "" : "s"}`
              : "Recent notices"}
          </h3>
          {sorted.map((n, idx) => (
            <FullNoticeCard key={n._id} notice={n} index={idx} />
          ))}
          <p className="pt-4 text-center text-sm text-muted-foreground border-t">
            Please bring your Student ID card to the OIR office for collection.
          </p>
        </div>
      )}

      <ContactStrip />
    </div>
  );
}

function SearchView() {
  const [studentId, setStudentId] = useState("");
  const [state, setState] = useState<SearchState>({ kind: "idle" });
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    const value = studentId.trim().toUpperCase();
    if (!value) return;
    setState({ kind: "loading" });
    startTransition(async () => {
      const result = await searchNoticesByStudentId(value);
      if (!result.ok) {
        setState({ kind: "error", message: result.error });
        return;
      }
      if (result.notices.length === 0) {
        setState({ kind: "empty", queried: value });
        return;
      }
      if (result.level === "full") {
        setState({
          kind: "full",
          queried: value,
          notices: sortByPriority(result.notices),
        });
      } else {
        setState({
          kind: "public",
          queried: value,
          notices: sortByPriority(result.notices),
        });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl space-y-8">
      <div className="text-center space-y-3">
        <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary/60">
          Mail &amp; documents
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-medium tracking-tight">
          Student notice board
        </h1>
        <p className="text-muted-foreground">
          Check by Student ID. For full details, sign in with the matching
          account.
        </p>
      </div>

      <div className="flex gap-2 p-2 bg-card border rounded-xl shadow-sm focus-within:border-primary/40 transition-colors">
        <Input
          placeholder="Enter Student ID (e.g. S12350130)"
          value={studentId}
          autoCapitalize="characters"
          spellCheck={false}
          onChange={(e) => setStudentId(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="border-none focus-visible:ring-0 text-lg h-12 font-mono"
        />
        <Button
          onClick={handleSearch}
          disabled={isPending || !studentId.trim()}
          className="h-12 px-8 rounded-lg font-semibold hover:cursor-pointer"
        >
          {isPending ? "Searching..." : "Check Now"}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {state.kind === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-amber-200 bg-amber-50/60">
              <CardContent className="p-6 text-center text-amber-800 text-sm">
                {state.message}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {state.kind === "empty" && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <EmptyState
              title="No notices found"
              message={
                <>
                  We couldn&apos;t find any notices for{" "}
                  <span className="font-mono text-primary">
                    {state.queried}
                  </span>
                  .
                </>
              }
            />
          </motion.div>
        )}

        {state.kind === "public" && (
          <motion.div
            key="public"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 flex items-center gap-3 text-sm text-slate-700">
              <Lock className="h-4 w-4 shrink-0" />
              Showing limited information.{" "}
              <a href="/login" className="font-semibold underline">
                Sign in
              </a>{" "}
              as the matching student to see full details.
            </div>
            <h3 className="font-semibold text-lg">
              {state.notices.length} notice
              {state.notices.length === 1 ? "" : "s"} on file for{" "}
              <span className="font-mono">{state.queried}</span>
            </h3>
            {state.notices.map((n, idx) => (
              <PublicNoticeCard key={n._id} notice={n} index={idx} />
            ))}
          </motion.div>
        )}

        {state.kind === "full" && (
          <motion.div
            key="full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 flex items-center gap-3 text-sm text-emerald-800">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Identity verified — full details unlocked.
            </div>
            <h3 className="font-semibold text-lg">
              {state.notices.length} notice
              {state.notices.length === 1 ? "" : "s"}
            </h3>
            {state.notices.map((n, idx) => (
              <FullNoticeCard key={n._id} notice={n} index={idx} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <ContactStrip />
    </div>
  );
}

function FullNoticeCard({
  notice,
  index,
}: {
  notice: FullNotice;
  index: number;
}) {
  const Icon = typeIcon(notice.type);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`border-l-4 ${STATUS_ACCENT[notice.status]}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-ink text-brass">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {notice.type} Notification
                </CardTitle>
                <CardDescription className="text-xs">
                  Ref: {notice._id.slice(-6).toUpperCase()}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`text-xs ${STATUS_STYLES[notice.status]}`}
            >
              {notice.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-medium text-sm sm:text-base text-slate-800">
            {notice.description}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{notice.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{new Date(notice.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PublicNoticeCard({
  notice,
  index,
}: {
  notice: PublicNotice;
  index: number;
}) {
  const Icon = typeIcon(notice.type);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`border-l-4 ${STATUS_ACCENT[notice.status]}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-200 text-slate-700">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{notice.type}</CardTitle>
                <CardDescription className="text-xs flex items-center gap-1 text-slate-500">
                  <EyeOff className="h-3 w-3" />
                  Details hidden
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`text-xs ${STATUS_STYLES[notice.status]}`}
            >
              {notice.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Registered {new Date(notice.createdAt).toLocaleDateString()}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyState({
  title,
  message,
}: {
  title: string;
  message: React.ReactNode;
}) {
  return (
    <Card className="border-zinc-200">
      <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-zinc-100 rounded-full">
          <Search className="h-8 w-8 text-zinc-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ContactStrip() {
  return (
    <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { title: "OIR Hours", value: "09:00 - 17:00" },
        { title: "Location", value: "Admin Bldg 2F" },
        { title: "Emergency", value: "+886-4-2359-0121" },
      ].map((item) => (
        <div
          key={item.title}
          className="border bg-card p-4 rounded-xl text-center"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {item.title}
          </p>
          <p className="font-medium">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
