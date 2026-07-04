"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileBox, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/confirm-dialog";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./columns";
import {
  type AdminResource,
  type ActionResult,
  deleteResource,
  bulkDeleteResources,
} from "@/lib/actions/resource.action";

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

export default function ResourceClient({
  initialResources,
}: {
  initialResources: AdminResource[];
}) {
  const resources = initialResources;
  const router = useRouter();
  const [isMutating, startMutate] = useTransition();
  const confirm = useConfirm();

  const handleDelete = async (resource: AdminResource) => {
    const ok = await confirm({
      title: `Delete "${resource.title}"?`,
      description: "This permanently removes the resource and cannot be undone.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    startMutate(async () => {
      const result = await deleteResource(resource._id);
      if (handleResult(result, "Failed to delete resource.")) {
        router.refresh();
      }
    });
  };

  const handleBulkDelete = async (rows: AdminResource[], clear: () => void) => {
    const ok = await confirm({
      title: `Delete ${rows.length} resource${rows.length === 1 ? "" : "s"}?`,
      description:
        "This permanently removes the selected resources and cannot be undone.",
      confirmLabel: "Delete all",
      tone: "danger",
    });
    if (!ok) return;
    startMutate(async () => {
      const result = await bulkDeleteResources(rows.map((r) => r._id));
      if (handleResult(result, "Failed to delete resources.")) {
        clear();
        router.refresh();
      }
    });
  };

  const emptyState =
    resources.length === 0 ? (
      <div className="flex flex-col items-center text-center gap-3 py-8">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
          <FileBox className="h-6 w-6 text-slate-400" />
        </div>
        <div>
          <p className="font-semibold text-slate-700">No resources yet</p>
          <p className="text-sm text-slate-500">
            Add your first document, form, or link to show it on the resources
            page.
          </p>
        </div>
        <Button
          render={<Link href="/dashboard/resources/new" />}
          nativeButton={false}
          size="sm"
          className="gap-2 bg-[#2B4156] hover:bg-[#1f3142] hover:cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Resource
        </Button>
      </div>
    ) : (
      "No resources match your search."
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Resource Manager
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage downloadable forms, guidelines, and external links.
          </p>
        </div>
        <Button
          render={<Link href="/dashboard/resources/new" />}
          nativeButton={false}
          className="gap-2 bg-[#2B4156] hover:bg-[#1f3142] hover:cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Resource
        </Button>
      </div>

      <DataTable
        columns={getColumns({ onDelete: handleDelete })}
        data={resources}
        getRowId={(r) => r._id}
        searchColumnId="title"
        searchPlaceholder="Search by title or category..."
        countNoun={{ one: "resource", other: "resources" }}
        emptyMessage={emptyState}
        onRowClick={(r) => router.push(`/dashboard/resources/${r._id}/edit`)}
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
