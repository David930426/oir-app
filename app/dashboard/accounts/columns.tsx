"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ShieldAlert, Check } from "lucide-react"

export type UserType = {
  _id: string;
  name: string;
  email: string;
  batchId: string;
  role: string;
  approved: boolean;
}

interface ColumnProps {
  onApprove: (id: string, currentStatus: boolean) => void;
  onEdit: (user: UserType) => void;
  onDelete: (id: string) => void;
}

export const getColumns = ({ onApprove, onEdit, onDelete }: ColumnProps): ColumnDef<UserType>[] => [
  {
    accessorFn: (row) => `${row.name} ${row.email}`,
    id: "name_email",
    header: "Name & Email",
    cell: ({ row }) => {
      return (
        <div>
          <p className="font-semibold text-slate-900">{row.original.name}</p>
          <p className="text-xs text-slate-500">{row.original.email}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "batchId",
    header: "Student ID",
    cell: ({ row }) => <div className="font-mono text-xs text-slate-600">{row.getValue("batchId")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant={role === "admin" ? "default" : "secondary"} className="uppercase text-[10px]">
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "approved",
    header: "Status",
    cell: ({ row }) => {
      const approved = row.getValue("approved") as boolean;
      return approved ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Approved
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          Pending
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant={user.approved ? "outline" : "default"} 
            size="sm" 
            className={`hover:cursor-pointer text-xs h-8 ${!user.approved ? "bg-green-600 hover:bg-green-700 text-white" : "text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"}`}
            onClick={() => onApprove(user._id, user.approved)}
          >
            {user.approved ? <ShieldAlert className="h-3.5 w-3.5 mr-1" /> : <Check className="h-3.5 w-3.5 mr-1" />}
            {user.approved ? "Revoke" : "Approve"}
          </Button>
          <Button variant="ghost" size="icon" className="hover:cursor-pointer hover:text-blue-600 hover:bg-blue-50 h-8 w-8" onClick={() => onEdit(user)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:cursor-pointer hover:text-red-600 hover:bg-red-50 h-8 w-8" onClick={() => onDelete(user._id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]