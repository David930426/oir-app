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
import type { AdminOrganization } from "@/lib/actions/organization.action";

interface ColumnProps {
  onDelete: (organization: AdminOrganization) => void;
}

export const getColumns = ({
  onDelete,
}: ColumnProps): ColumnDef<AdminOrganization>[] => [
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
        ariaLabel={`Select ${row.original.name}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
    meta: { stopClick: true },
  },
  {
    // Fused accessor so the search box matches name, category, and description.
    accessorFn: (row) => `${row.name} ${row.category} ${row.description}`,
    id: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/organizations/${row.original._id}/edit`}
        className="truncate font-semibold text-slate-900 hover:text-blue-600 hover:underline hover:cursor-pointer"
      >
        {row.original.name}
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
    accessorKey: "membersCount",
    header: "Members",
    cell: ({ row }) => (
      <span className="text-sm text-slate-700">
        {row.original.membersCount}
      </span>
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
      const organization = row.original;
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
                      href={`/dashboard/organizations/${organization._id}/edit`}
                      aria-label={`Edit ${organization.name}`}
                    />
                  }
                  nativeButton={false}
                  className="h-8 w-8 hover:text-blue-600 hover:bg-blue-50 hover:cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>Edit organization</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(organization)}
                  className="h-8 w-8 hover:text-red-600 hover:bg-red-50 hover:cursor-pointer"
                  aria-label={`Delete ${organization.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>Delete organization</TooltipContent>
          </Tooltip>
        </div>
      );
    },
    meta: { stopClick: true },
  },
];
