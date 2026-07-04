"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RequiredMark } from "@/components/ui/required-mark";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  type AdminBulletin,
  type CategoryItem,
  createBulletin,
  updateBulletin,
} from "@/lib/actions/bulletin.action";

interface FormState {
  title: string;
  category: string;
  description: string;
  published: boolean;
}

// The "New" badge is automatic: it shows for 48h after a bulletin is posted.
const RECENT_WINDOW_MS = 48 * 60 * 60 * 1000;

export default function BulletinForm({
  categories,
  bulletin,
}: {
  categories: CategoryItem[];
  bulletin?: AdminBulletin;
}) {
  const router = useRouter();
  const isEditing = !!bulletin;
  const [isSaving, startSaving] = useTransition();
  const [form, setForm] = useState<FormState>({
    title: bulletin?.title ?? "",
    category: bulletin?.category ?? categories[0]?.name ?? "",
    description: bulletin?.description ?? "",
    published: bulletin?.published ?? true,
  });

  // New bulletins are "New" immediately; when editing, it depends on post age.
  const showNewBadge = bulletin
    ? Date.now() - new Date(bulletin.createdAt).getTime() < RECENT_WINDOW_MS
    : true;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) {
      toast.error("Pick a category.");
      return;
    }
    startSaving(async () => {
      const result = isEditing
        ? await updateBulletin(bulletin._id, form)
        : await createBulletin(form);
      if (!result) {
        toast.error("Failed to save bulletin.");
        return;
      }
      if (result.success) {
        if (result.message) toast.success(result.message);
        router.push("/dashboard/bulletin");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          render={<Link href="/dashboard/bulletin" aria-label="Back to bulletins" />}
          nativeButton={false}
          className="hover:cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? "Edit Bulletin" : "Create Bulletin"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Update this announcement."
              : "Publish a new campus-wide announcement."}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start"
      >
        {/* Left: the editor */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="title" className="text-sm font-semibold text-slate-700">
                  Title
                  <RequiredMark />
                </label>
                <Input
                  id="title"
                  required
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="University Scholarship Results: Autumn 2026"
                  className="h-11 text-base"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-semibold text-slate-700">
                  Category
                  <RequiredMark />
                </label>
                <select
                  id="category"
                  required
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="content" className="text-sm font-semibold text-slate-700">
                  Content
                  <RequiredMark />
                </label>
                <textarea
                  id="content"
                  required
                  rows={9}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Write the full announcement here. Include dates, eligibility, links, and any action students need to take."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 resize-y leading-relaxed"
                />
                <p className="text-xs text-slate-400">
                  {form.description.length} / 5000 characters
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => set("published", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 hover:cursor-pointer"
                />
                Publish (visible on main page)
              </label>

              <p className="sm:col-span-2 text-xs text-slate-400">
                A &quot;New&quot; badge shows automatically for 48 hours after a
                bulletin is posted.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              render={<Link href="/dashboard/bulletin" />}
              nativeButton={false}
              className="hover:cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="gap-2 bg-[#2B4156] hover:bg-[#1f3142] hover:cursor-pointer"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Publish Bulletin"}
            </Button>
          </div>
        </div>

        {/* Right: live preview */}
        <div className="lg:sticky lg:top-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Live preview
          </p>
          <Card className="overflow-hidden border shadow-md">
            <CardHeader className="p-5">
              <div className="flex items-center gap-2 mb-2">
                {showNewBadge && (
                  <Badge className="bg-red-500 border-none shadow px-2.5 py-0.5 text-xs">
                    New
                  </Badge>
                )}
                {form.category && (
                  <Badge variant="secondary" className="font-bold px-2.5 py-0.5 text-xs uppercase">
                    {form.category}
                  </Badge>
                )}
                {!form.published && (
                  <Badge variant="outline" className="ml-auto text-[10px] bg-slate-100 text-slate-600 border-slate-200">
                    Draft
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Calendar className="h-3 w-3" />
                {new Date().toISOString().split("T")[0]}
              </div>
              <CardTitle className="text-lg leading-snug line-clamp-2">
                {form.title || "Bulletin title"}
              </CardTitle>
              <CardDescription className="line-clamp-3 pt-2 leading-relaxed">
                {form.description || "Your announcement content will appear here."}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </form>
    </div>
  );
}
