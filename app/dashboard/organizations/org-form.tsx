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
  type AdminOrganization,
  createOrganization,
  updateOrganization,
} from "@/lib/actions/organization.action";

const CATEGORIES = ["International", "Nationality", "Social", "Hobby"] as const;

interface FormState {
  name: string;
  category: (typeof CATEGORIES)[number];
  description: string;
  line: string;
  instagram: string;
  facebook: string;
  upcomingEvents: string;
  membersCount: string;
}

export default function OrgForm({
  organization,
}: {
  organization?: AdminOrganization;
}) {
  const router = useRouter();
  const isEditing = !!organization;
  const [isSaving, startSaving] = useTransition();
  const [form, setForm] = useState<FormState>({
    name: organization?.name ?? "",
    category: (organization?.category as FormState["category"]) ?? CATEGORIES[0],
    description: organization?.description ?? "",
    line: organization?.socialLinks.line ?? "",
    instagram: organization?.socialLinks.instagram ?? "",
    facebook: organization?.socialLinks.facebook ?? "",
    upcomingEvents: organization?.upcomingEvents.join("\n") ?? "",
    membersCount: String(organization?.membersCount ?? 0),
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      category: form.category,
      description: form.description,
      socialLinks: {
        line: form.line,
        instagram: form.instagram,
        facebook: form.facebook,
      },
      upcomingEvents: form.upcomingEvents
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
      membersCount: Number(form.membersCount),
    };
    startSaving(async () => {
      const result = isEditing
        ? await updateOrganization(organization._id, data)
        : await createOrganization(data);
      if (!result) {
        toast.error("Failed to save organization.");
        return;
      }
      if (result.success) {
        if (result.message) toast.success(result.message);
        router.push("/dashboard/organizations");
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
          render={
            <Link
              href="/dashboard/organizations"
              aria-label="Back to organizations"
            />
          }
          nativeButton={false}
          className="hover:cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? "Edit Organization" : "Create Organization"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Update this organization's details."
              : "Add a new student organization."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Card>
          <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                Name
                <RequiredMark />
              </label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Tunghai International Student Association"
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
                onChange={(e) =>
                  set("category", e.target.value as FormState["category"])
                }
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="membersCount"
                className="text-sm font-semibold text-slate-700"
              >
                Members Count
                <RequiredMark />
              </label>
              <Input
                id="membersCount"
                type="number"
                min={0}
                required
                value={form.membersCount}
                onChange={(e) => set("membersCount", e.target.value)}
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="description"
                className="text-sm font-semibold text-slate-700"
              >
                Description
                <RequiredMark />
              </label>
              <textarea
                id="description"
                required
                rows={5}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the organization's mission and activities."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 resize-y leading-relaxed"
              />
              <p className="text-xs text-slate-400">
                {form.description.length} / 1000 characters
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="line" className="text-sm font-semibold text-slate-700">
                Line Link
              </label>
              <Input
                id="line"
                value={form.line}
                onChange={(e) => set("line", e.target.value)}
                placeholder="https://line.me/..."
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="instagram"
                className="text-sm font-semibold text-slate-700"
              >
                Instagram Link
              </label>
              <Input
                id="instagram"
                value={form.instagram}
                onChange={(e) => set("instagram", e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="facebook"
                className="text-sm font-semibold text-slate-700"
              >
                Facebook Link
              </label>
              <Input
                id="facebook"
                value={form.facebook}
                onChange={(e) => set("facebook", e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="upcomingEvents"
                className="text-sm font-semibold text-slate-700"
              >
                Upcoming Events
              </label>
              <textarea
                id="upcomingEvents"
                rows={5}
                value={form.upcomingEvents}
                onChange={(e) => set("upcomingEvents", e.target.value)}
                placeholder={"One event per line, e.g.\nWelcome Party - Sept 5\nCultural Night - Oct 12"}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 resize-y leading-relaxed"
              />
              <p className="text-xs text-slate-400">One event per line.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            render={<Link href="/dashboard/organizations" />}
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
                : "Create Organization"}
          </Button>
        </div>
      </form>
    </div>
  );
}
