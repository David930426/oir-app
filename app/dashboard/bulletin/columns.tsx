"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { SelectCheckbox } from "@/components/ui/select-checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AdminBulletin } from "@/lib/actions/bulletin.action";

// A bulletin is flagged "New" purely by recency — visible for 48h after posting.
const RECENT_WINDOW_MS = 48 * 60 * 60 * 1000;

function isRecent(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < RECENT_WINDOW_MS;
}

interface ColumnProps {
  onDelete: (bulletin: AdminBulletin) => void;
}

export const getColumns = ({
  onDelete,
}: ColumnProps): ColumnDef<AdminBulletin>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <SelectCheckbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() &&
          !table.getIsAllPageRowsSelected()
        }
        onChange={(value) => table.toggleAllPageRowsSelected(value)}
        ariaLabel="Select all rows on this page"
      />
    ),
    cell: ({ row }) => (
      <SelectCheckbox
        checked={row.getIsSelected()}
        onChange={(value) => row.toggleSelected(value)}
        ariaLabel={`Select ${row.original.title}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
    meta: { stopClick: true },
  },
  {
    // Fused accessor so the search box matches title, category, and content.
    accessorFn: (row) => `${row.title} ${row.category} ${row.description}`,
    id: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 max-w-sm">
        <Link
          href={`/dashboard/bulletin/${row.original._id}`}
          className="truncate font-semibold text-slate-900 hover:text-blue-600 hover:underline hover:cursor-pointer"
        >
          {row.original.title}
        </Link>
        {isRecent(row.original.createdAt) && (
          <Badge className="bg-red-500 border-none text-[10px] px-1.5 py-0 shrink-0">
            New
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "published",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`text-xs ${
          row.original.published
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-slate-100 text-slate-600 border-slate-200"
        }`}
      >
        {row.original.published ? "Published" : "Draft"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
    meta: { className: "hidden md:table-cell" },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const bulletin = row.original;
      return (
        <div className="flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  render={
                    <Link
                      href={`/dashboard/bulletin/${bulletin._id}/edit`}
                      aria-label={`Edit ${bulletin.title}`}
                    />
                  }
                  nativeButton={false}
                  className="h-8 w-8 hover:text-blue-600 hover:bg-blue-50 hover:cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>Edit bulletin</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(bulletin)}
                  className="h-8 w-8 hover:text-red-600 hover:bg-red-50 hover:cursor-pointer"
                  aria-label={`Delete ${bulletin.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>Delete bulletin</TooltipContent>
          </Tooltip>
        </div>
      );
    },
    meta: { stopClick: true },
  },
];
