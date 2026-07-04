"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Edit,
  FileText,
  Package,
  PackageCheck,
  Trash2,
} from "lucide-react";
import { SelectCheckbox } from "@/components/ui/select-checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AdminNotice } from "@/lib/actions/notice.action";

type NoticeType = AdminNotice["type"];
type NoticeStatus = AdminNotice["status"];

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
      return FileText;
  }
}

function statusVariant(status: NoticeStatus) {
  switch (status) {
    case "Ready":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Action Needed":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Picked Up":
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

interface ColumnProps {
  disabled: boolean;
  onMarkPickedUp: (notice: AdminNotice) => void;
  onEdit: (notice: AdminNotice) => void;
  onDelete: (notice: AdminNotice) => void;
}

export const getColumns = ({
  disabled,
  onMarkPickedUp,
  onEdit,
  onDelete,
}: ColumnProps): ColumnDef<AdminNotice>[] => [
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
        ariaLabel={`Select notice for ${row.original.studentId}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    // Fused accessor so the search box matches Student ID, type, and description.
    accessorFn: (row) => `${row.studentId} ${row.type} ${row.description}`,
    id: "studentId",
    header: "Student ID",
    cell: ({ row }) => (
      <span className="font-bold font-mono">{row.original.studentId}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const Icon = typeIcon(row.original.type);
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 opacity-60" />
          {row.original.type}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-muted-foreground line-clamp-1 max-w-sm">
        {row.original.description}
      </span>
    ),
    meta: { className: "hidden md:table-cell" },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`text-xs ${statusVariant(row.original.status)}`}
      >
        {row.original.status}
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
      const notice = row.original;
      return (
        <div className="flex items-center justify-end gap-1">
          {notice.status !== "Picked Up" && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    onClick={() => onMarkPickedUp(notice)}
                    className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:cursor-pointer"
                    aria-label="Mark as picked up"
                  >
                    <PackageCheck className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent>Mark as picked up</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(notice)}
                  className="h-8 w-8 hover:text-blue-600 hover:bg-blue-50 hover:cursor-pointer"
                  aria-label={`Edit notice for ${notice.studentId}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>Edit notice</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  onClick={() => onDelete(notice)}
                  className="h-8 w-8 hover:text-red-600 hover:bg-red-50 hover:cursor-pointer"
                  aria-label={`Delete notice for ${notice.studentId}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>Delete notice</TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];
