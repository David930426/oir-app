"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RequiredMark } from "@/components/ui/required-mark";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  type AdminResource,
  createResource,
  updateResource,
} from "@/lib/actions/resource.action";

const CATEGORY_OPTIONS = ["Essential", "Guideline", "Form", "Other"] as const;
const FILE_TYPE_OPTIONS = ["PDF", "Link", "Doc"] as const;

interface FormState {
  title: string;
  category: string;
  description: string;
  fileType: string;
  url: string;
}

export default function ResourceForm({
  resource,
}: {
  resource?: AdminResource;
}) {
  const router = useRouter();
  const isEditing = !!resource;
  const [isSaving, startSaving] = useTransition();
  const [form, setForm] = useState<FormState>({
    title: resource?.title ?? "",
    category: resource?.category ?? CATEGORY_OPTIONS[0],
    description: resource?.description ?? "",
    fileType: resource?.fileType ?? FILE_TYPE_OPTIONS[0],
    url: resource?.url ?? "",
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startSaving(async () => {
      const result = isEditing
        ? await updateResource(resource._id, form)
        : await createResource(form);
      if (!result) {
        toast.error("Failed to save resource.");
        return;
      }
      if (result.success) {
        if (result.message) toast.success(result.message);
        router.push("/dashboard/resources");
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
          render={<Link href="/dashboard/resources" aria-label="Back to resources" />}
          nativeButton={false}
          className="hover:cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? "Edit Resource" : "Create Resource"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Update this resource."
              : "Add a new downloadable form, guideline, or external link."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
                placeholder="Academic Calendar 2026-2027"
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
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="fileType" className="text-sm font-semibold text-slate-700">
                File Type
                <RequiredMark />
              </label>
              <select
                id="fileType"
                required
                value={form.fileType}
                onChange={(e) => set("fileType", e.target.value)}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {FILE_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="description" className="text-sm font-semibold text-slate-700">
                Description
                <RequiredMark />
              </label>
              <textarea
                id="description"
                required
                rows={5}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Briefly describe what this resource is and who needs it."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 resize-y leading-relaxed"
              />
              <p className="text-xs text-slate-400">
                {form.description.length} / 1000 characters
              </p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="url" className="text-sm font-semibold text-slate-700">
                URL / Link
                <RequiredMark />
              </label>
              <Input
                id="url"
                required
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
                placeholder="https://example.com/document.pdf"
                className="h-11 text-base"
              />
              <p className="text-xs text-slate-400">
                Paste a link to an already-hosted file or external page. There
                is no file upload system in this app.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            render={<Link href="/dashboard/resources" />}
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
                : "Create Resource"}
          </Button>
        </div>
      </form>
    </div>
  );
}
