"use client";

import React, { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import {
  bulkApproveAccounts,
  bulkDeleteAccounts,
  createOrUpdateAccount,
  deleteAccount,
  toggleApproveAccount,
  type ActionResult,
} from "@/lib/actions/account.action";
import { UserType, getColumns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useConfirm } from "@/components/confirm-dialog";
import { RequiredMark } from "@/components/ui/required-mark";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FormState = {
  name: string;
  email: string;
  batchId: string;
  role: "student" | "admin";
  password: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  batchId: "",
  role: "student",
  password: "",
};

function handleResult(result: ActionResult | undefined, fallbackError: string) {
  if (!result) {
    toast.error(fallbackError);
    return false;
  }
  if (result.success) {
    if (result.message) toast.success(result.message);
    return true;
  }
  toast.error(result.error);
  return false;
}

export default function AccountsClient({ users }: { users: UserType[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const [isBulkPending, startBulk] = useTransition();
  const confirm = useConfirm();

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleApprove = (id: string, currentStatus: boolean) => {
    startBulk(async () => {
      const result = await toggleApproveAccount(id, !currentStatus);
      handleResult(result, "Failed to update approval.");
    });
  };

  const handleDelete = async (id: string) => {
    const target = users.find((u) => u._id === id);
    const ok = await confirm({
      title: target ? `Delete ${target.name}?` : "Delete this account?",
      description:
        "This permanently removes the account and cannot be undone.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    startBulk(async () => {
      const result = await deleteAccount(id);
      handleResult(result, "Failed to delete account.");
    });
  };

  const handleBulkApprove = (rows: UserType[], clear: () => void) => {
    const pending = rows.filter((u) => !u.approved);
    if (pending.length === 0) {
      toast.info("All selected accounts are already approved.");
      return;
    }
    startBulk(async () => {
      const result = await bulkApproveAccounts(pending.map((u) => u._id));
      if (handleResult(result, "Failed to approve accounts.")) clear();
    });
  };

  const handleBulkDelete = async (rows: UserType[], clear: () => void) => {
    const ok = await confirm({
      title: `Delete ${rows.length} account${rows.length === 1 ? "" : "s"}?`,
      description:
        "This permanently removes the selected accounts and cannot be undone.",
      confirmLabel: "Delete all",
      tone: "danger",
    });
    if (!ok) return;
    startBulk(async () => {
      const result = await bulkDeleteAccounts(rows.map((u) => u._id));
      if (handleResult(result, "Failed to delete accounts.")) clear();
    });
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData(EMPTY_FORM);
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      batchId: user.batchId,
      role: user.role === "admin" ? "admin" : "student",
      password: "",
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startSaving(async () => {
      const result = await createOrUpdateAccount(
        editingUser ? editingUser._id : null,
        formData,
      );
      if (handleResult(result, "Failed to save account.")) {
        setIsModalOpen(false);
        setEditingUser(null);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Accounts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor users, approve student registrations, and manage access.
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="gap-2 bg-[#2B4156] hover:bg-[#1f3142] hover:cursor-pointer shadow-sm"
        >
          <UserPlus className="h-4 w-4" /> Add Account
        </Button>
      </div>

      <DataTable
        columns={getColumns({
          onApprove: handleApprove,
          onEdit: openEditModal,
          onDelete: handleDelete,
        })}
        data={users}
        getRowId={(row) => row._id}
        searchColumnId="name_email"
        searchPlaceholder="Search by name or email..."
        countNoun={{ one: "account", other: "accounts" }}
        emptyMessage="No accounts found."
        renderToolbar={(rows, clear) => (
          <>
            <span className="text-sm text-slate-600">
              {rows.length} selected
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={isBulkPending}
              onClick={() => handleBulkApprove(rows, clear)}
              className="hover:cursor-pointer text-xs h-8 bg-green-600 hover:bg-green-700 text-white border-transparent"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={isBulkPending}
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

      {mounted &&
        isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-modal-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
          <Card className="w-full max-w-md shadow-2xl border-none">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2
                id="account-modal-title"
                className="text-xl font-bold text-slate-900"
              >
                {editingUser ? "Edit Account" : "Add New Account"}
              </h2>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={isSaving}
                      aria-label="Close"
                      className="text-slate-400 hover:text-slate-700 hover:cursor-pointer transition-colors disabled:opacity-50"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  }
                />
                <TooltipContent>Close</TooltipContent>
              </Tooltip>
            </div>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <label
                    htmlFor="account-name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Full Name
                    <RequiredMark />
                  </label>
                  <Input
                    id="account-name"
                    required
                    autoFocus
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="account-batchId"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Student / Batch ID
                    <RequiredMark />
                  </label>
                  <Input
                    id="account-batchId"
                    required
                    autoCapitalize="characters"
                    spellCheck={false}
                    value={formData.batchId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        batchId: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="S12345678 or A00000001"
                    className="font-mono uppercase"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="account-email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email Address
                    <RequiredMark />
                  </label>
                  <Input
                    id="account-email"
                    required
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="user@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="account-role"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Account Role
                    <RequiredMark />
                  </label>
                  <select
                    id="account-role"
                    required
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as FormState["role"],
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 hover:cursor-pointer"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="account-password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                    {editingUser ? (
                      <span className="ml-1 text-xs text-slate-400 font-normal">
                        (Leave blank to keep unchanged)
                      </span>
                    ) : (
                      <RequiredMark />
                    )}
                  </label>
                  <div className="relative">
                    <Input
                      id="account-password"
                      type={showPassword ? "text" : "password"}
                      required={!editingUser}
                      minLength={6}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="pr-10"
                    />
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            aria-pressed={showPassword}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700 hover:cursor-pointer transition-colors focus:outline-none focus-visible:text-blue-600"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        }
                      />
                      <TooltipContent>
                        {showPassword ? "Hide password" : "Show password"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={isSaving}
                    className="hover:cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#2B4156] hover:bg-[#1f3142] hover:cursor-pointer gap-2"
                  >
                    {isSaving && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {isSaving
                      ? "Saving..."
                      : editingUser
                        ? "Save Changes"
                        : "Create Account"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          </div>,
          document.body,
        )}
    </div>
  );
}
