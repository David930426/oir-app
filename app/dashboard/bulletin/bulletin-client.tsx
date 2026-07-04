"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Newspaper, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/components/confirm-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./columns";
import {
  type AdminBulletin,
  type CategoryWithCount,
  type ActionResult,
  deleteBulletin,
  bulkDeleteBulletins,
  createCategory,
  renameCategory,
  deleteCategory,
} from "@/lib/actions/bulletin.action";

function handleResult(result: ActionResult | undefined, fallback: string) {
  if (!result) {
    toast.error(fallback);
    return false;
  }
  if (result.success) {
    if (result.message) toast.success(result.message);
    return true;
  }
  toast.error(result.error);
  return false;
}

export default function BulletinClient({
  initialBulletins,
  categories,
}: {
  initialBulletins: AdminBulletin[];
  categories: CategoryWithCount[];
}) {
  const bulletins = initialBulletins;
  const router = useRouter();
  const [isMutating, startMutate] = useTransition();
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const confirm = useConfirm();

  const hasCategories = categories.length > 0;

  const handleDelete = async (b: AdminBulletin) => {
    const ok = await confirm({
      title: `Delete "${b.title}"?`,
      description: "This permanently removes the bulletin and cannot be undone.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    startMutate(async () => {
      const result = await deleteBulletin(b._id);
      if (handleResult(result, "Failed to delete bulletin.")) {
        router.refresh();
      }
    });
  };

  const handleBulkDelete = async (rows: AdminBulletin[], clear: () => void) => {
    const ok = await confirm({
      title: `Delete ${rows.length} bulletin${rows.length === 1 ? "" : "s"}?`,
      description:
        "This permanently removes the selected bulletins and cannot be undone.",
      confirmLabel: "Delete all",
      tone: "danger",
    });
    if (!ok) return;
    startMutate(async () => {
      const result = await bulkDeleteBulletins(rows.map((b) => b._id));
      if (handleResult(result, "Failed to delete bulletins.")) {
        clear();
        router.refresh();
      }
    });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategory.trim();
    if (!name) return;
    startMutate(async () => {
      const result = await createCategory(name);
      if (handleResult(result, "Failed to add category.")) {
        setNewCategory("");
        router.refresh();
      }
    });
  };

  const handleDeleteCategory = async (cat: CategoryWithCount) => {
    const ok = await confirm({
      title: `Delete category "${cat.name}"?`,
      description:
        "You can only delete a category that no bulletins are using.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    startMutate(async () => {
      const result = await deleteCategory(cat._id);
      if (handleResult(result, "Failed to delete category.")) {
        router.refresh();
      }
    });
  };

  const startRename = (cat: CategoryWithCount) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditingName("");
  };

  const submitRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const name = editingName.trim();
    if (!name) return;
    const current = categories.find((c) => c._id === editingId);
    if (current && name === current.name) {
      cancelRename();
      return;
    }
    startMutate(async () => {
      const result = await renameCategory(editingId, name);
      if (handleResult(result, "Failed to rename category.")) {
        cancelRename();
        router.refresh();
      }
    });
  };

  const emptyState =
    bulletins.length === 0 ? (
      <div className="flex flex-col items-center text-center gap-3 py-8">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
          <Newspaper className="h-6 w-6 text-slate-400" />
        </div>
        <div>
          <p className="font-semibold text-slate-700">No bulletins yet</p>
          <p className="text-sm text-slate-500">
            {hasCategories
              ? "Publish your first announcement to show it on the bulletin page."
              : "Add a category above, then publish your first announcement."}
          </p>
        </div>
        {hasCategories && (
          <Button
            render={<Link href="/dashboard/bulletin/new" />}
            nativeButton={false}
            size="sm"
            className="gap-2 bg-[#2B4156] hover:bg-[#1f3142] hover:cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Article
          </Button>
        )}
      </div>
    ) : (
      "No bulletins match your search."
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            OIR Bulletin Manager
          </h1>
          <p className="text-sm text-muted-foreground">
            Publish and manage campus-wide announcements and news.
          </p>
        </div>
        {hasCategories ? (
          <Button
            render={<Link href="/dashboard/bulletin/new" />}
            nativeButton={false}
            className="gap-2 bg-[#2B4156] hover:bg-[#1f3142] hover:cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Article
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  disabled
                  className="gap-2 bg-[#2B4156] hover:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  Create Article
                </Button>
              }
            />
            <TooltipContent>Add a category first</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Category manager */}
      <Card>
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-slate-700">
                  Categories
                </h2>
              </div>
              <span className="text-xs text-muted-foreground">
                {categories.length}{" "}
                {categories.length === 1 ? "category" : "categories"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Organize bulletins by topic. Renaming a category updates every
              bulletin that uses it.
            </p>
          </div>

          {/* Add row */}
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name (e.g. Scholarship)"
              maxLength={60}
              className="h-10"
            />
            <Button
              type="submit"
              variant="outline"
              disabled={isMutating || !newCategory.trim()}
              className="gap-2 hover:cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </form>

          {/* List */}
          {categories.length === 0 ? (
            <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-slate-200 py-8 text-center">
              <p className="text-sm font-medium text-slate-600">
                No categories yet
              </p>
              <p className="text-xs text-muted-foreground">
                Add your first category above to start publishing bulletins.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {categories.map((cat) => {
                const inUse = cat.articleCount > 0;
                const isEditing = editingId === cat._id;
                return (
                  <li key={cat._id}>
                    {isEditing ? (
                      <form
                        onSubmit={submitRename}
                        className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/40 px-3 py-2"
                      >
                        <Input
                          autoFocus
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") cancelRename();
                          }}
                          maxLength={60}
                          aria-label={`Rename ${cat.name}`}
                          className="h-8 flex-1"
                        />
                        <Button
                          type="submit"
                          size="sm"
                          disabled={isMutating || !editingName.trim()}
                          className="gap-1 bg-[#2B4156] hover:bg-[#1f3142] hover:cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Save
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={cancelRename}
                          disabled={isMutating}
                          className="hover:cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
                        <span className="flex-1 min-w-0 truncate font-medium text-slate-800">
                          {cat.name}
                        </span>
                        <Badge
                          variant="secondary"
                          className="shrink-0 font-normal text-xs"
                        >
                          {inUse
                            ? `${cat.articleCount} article${cat.articleCount === 1 ? "" : "s"}`
                            : "No articles"}
                        </Badge>
                        <div className="flex items-center gap-1 shrink-0">
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isMutating}
                                  onClick={() => startRename(cat)}
                                  aria-label={`Rename ${cat.name}`}
                                  className="h-8 w-8 hover:text-blue-600 hover:bg-blue-50 hover:cursor-pointer"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <TooltipContent>Rename category</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-disabled={inUse || isMutating}
                                  onClick={() => {
                                    if (inUse || isMutating) return;
                                    handleDeleteCategory(cat);
                                  }}
                                  aria-label={`Delete ${cat.name}`}
                                  className={cn(
                                    "h-8 w-8 hover:cursor-pointer",
                                    inUse
                                      ? "opacity-40 cursor-not-allowed"
                                      : "hover:text-red-600 hover:bg-red-50",
                                  )}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <TooltipContent>
                              {inUse
                                ? "Reassign or remove its bulletins first"
                                : "Delete category"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <DataTable
        columns={getColumns({ onDelete: handleDelete })}
        data={bulletins}
        getRowId={(b) => b._id}
        searchColumnId="title"
        searchPlaceholder="Search by title, category, or content..."
        countNoun={{ one: "bulletin", other: "bulletins" }}
        emptyMessage={emptyState}
        onRowClick={(b) => router.push(`/dashboard/bulletin/${b._id}`)}
        renderToolbar={(rows, clear) => (
          <>
            <span className="text-sm text-slate-600">
              {rows.length} selected
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={isMutating}
              onClick={() => handleBulkDelete(rows, clear)}
              className="hover:cursor-pointer text-xs h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={clear}
              className="hover:cursor-pointer text-xs h-8 text-slate-500 hover:text-slate-700"
            >
              Clear
            </Button>
          </>
        )}
      />
    </div>
  );
}
