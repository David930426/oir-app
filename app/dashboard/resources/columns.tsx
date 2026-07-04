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
import type { AdminResource } from "@/lib/actions/resource.action";

interface ColumnProps {
  onDelete: (resource: AdminResource) => void;
}

export const getColumns = ({
  onDelete,
}: ColumnProps): ColumnDef<AdminResource>[] => [
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
    // Fused accessor so the search box matches title, category, and description.
    accessorFn: (row) => `${row.title} ${row.category} ${row.description}`,
    id: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/resources/${row.original._id}/edit`}
        className="truncate font-semibold text-slate-900 hover:text-blue-600 hover:underline hover:cursor-pointer"
      >
        {row.original.title}
      </Link>
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
    accessorKey: "fileType",
    header: "File Type",
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-xs">
        {row.original.fileType}
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
      const resource = row.original;
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
                      href={`/dashboard/resources/${resource._id}/edit`}
                      aria-label={`Edit ${resource.title}`}
                    />
                  }
                  nativeButton={false}
                  className="h-8 w-8 hover:text-blue-600 hover:bg-blue-50 hover:cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>Edit resource</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(resource)}
                  className="h-8 w-8 hover:text-red-600 hover:bg-red-50 hover:cursor-pointer"
                  aria-label={`Delete ${resource.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>Delete resource</TooltipContent>
          </Tooltip>
        </div>
      );
    },
    meta: { stopClick: true },
  },
];
