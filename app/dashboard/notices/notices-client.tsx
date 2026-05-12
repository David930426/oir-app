"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Edit,
  FileText,
  Loader2,
  MapPin,
  Package,
  Plus,
  PackageCheck,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useConfirm } from "@/components/confirm-dialog";
import { RequiredMark } from "@/components/ui/required-mark";
import {
  type AdminNotice,
  type ActionResult,
  type StudentOption,
  bulkCreateNotices,
  bulkDeleteNotices,
  deleteNotice,
  setNoticeStatus,
  updateNotice,
} from "@/lib/actions/notice.action";
import { SelectCheckbox } from "@/components/ui/select-checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TYPES = ["Package", "Document", "Letter", "ARC", "Other"] as const;
const STATUSES = ["Ready", "Action Needed", "Picked Up"] as const;

type NoticeType = (typeof TYPES)[number];
type NoticeStatus = (typeof STATUSES)[number];

interface FormState {
  type: NoticeType;
  status: NoticeStatus;
  location: string;
  description: string;
}

const EMPTY_FORM: FormState = {
  type: "Package",
  status: "Ready",
  location: "OIR Office (Front Desk)",
  description: "",
};

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

export default function NoticesClient({
  initialNotices,
  students,
}: {
  initialNotices: AdminNotice[];
  students: StudentOption[];
}) {
  const notices = initialNotices;
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [editing, setEditing] = useState<AdminNotice | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  // Used only in CREATE mode — multi-select student picker
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  // Used only in EDIT mode — the single notice's student id
  const [editingStudentId, setEditingStudentId] = useState("");
  const [isSaving, startSaving] = useTransition();
  const [isMutating, startMutate] = useTransition();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const confirm = useConfirm();

  const studentOptions = useMemo(
    () =>
      students.map((s) => ({
        value: s.batchId,
        label: s.batchId,
        description: s.name,
      })),
    [students],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toUpperCase();
    if (!q) return notices;
    return notices.filter(
      (n) =>
        n.studentId.includes(q) ||
        n.description.toUpperCase().includes(q) ||
        n.type.toUpperCase().includes(q),
    );
  }, [notices, search]);

  useEffect(() => {
    if (!modalOpen) return;
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
  }, [modalOpen]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setSelectedStudentIds([]);
    setEditingStudentId("");
    setModalOpen(true);
  };

  const openEdit = (n: AdminNotice) => {
    setEditing(n);
    setForm({
      type: n.type,
      status: n.status,
      location: n.location,
      description: n.description,
    });
    setEditingStudentId(n.studentId);
    setSelectedStudentIds([]);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing && selectedStudentIds.length === 0) {
      toast.error("Pick at least one student.");
      return;
    }
    startSaving(async () => {
      const result = editing
        ? await updateNotice(editing._id, {
            ...form,
            studentId: editingStudentId,
          })
        : await bulkCreateNotices({
            ...form,
            studentIds: selectedStudentIds,
          });
      if (handleResult(result, "Failed to save notice.")) {
        setModalOpen(false);
        setEditing(null);
        router.refresh();
      }
    });
  };

  const markAs = (n: AdminNotice, status: NoticeStatus) => {
    startMutate(async () => {
      const result = await setNoticeStatus(n._id, status);
      if (handleResult(result, "Failed to update status.")) {
        router.refresh();
      }
    });
  };

  const handleDelete = async (n: AdminNotice) => {
    const ok = await confirm({
      title: `Delete notice for ${n.studentId}?`,
      description:
        "This permanently removes the notice and cannot be undone.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    startMutate(async () => {
      const result = await deleteNotice(n._id);
      if (handleResult(result, "Failed to delete notice.")) {
        setSelectedIds((prev) => {
          if (!prev.has(n._id)) return prev;
          const next = new Set(prev);
          next.delete(n._id);
          return next;
        });
        router.refresh();
      }
    });
  };

  const filteredIds = useMemo(() => filtered.map((n) => n._id), [filtered]);
  const selectedInView = filteredIds.filter((id) => selectedIds.has(id));
  const allInViewSelected =
    filteredIds.length > 0 && selectedInView.length === filteredIds.length;
  const someInViewSelected =
    selectedInView.length > 0 && !allInViewSelected;

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleAllInView = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) filteredIds.forEach((id) => next.add(id));
      else filteredIds.forEach((id) => next.delete(id));
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const ok = await confirm({
      title: `Delete ${ids.length} notice${ids.length === 1 ? "" : "s"}?`,
      description:
        "This permanently removes the selected notices and cannot be undone.",
      confirmLabel: "Delete all",
      tone: "danger",
    });
    if (!ok) return;
    startMutate(async () => {
      const result = await bulkDeleteNotices(ids);
      if (handleResult(result, "Failed to delete notices.")) {
        clearSelection();
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Notices</h1>
          <p className="text-sm text-muted-foreground">
            Register and manage items waiting for student pickup.
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="gap-2 bg-[#2B4156] hover:bg-[#1f3142] hover:cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Register New Item
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by Student ID, type, or description..."
            className="pl-10 h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">
              {selectedIds.size} selected
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={isMutating}
              onClick={handleBulkDelete}
              className="hover:cursor-pointer text-xs h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearSelection}
              className="hover:cursor-pointer text-xs h-8 text-slate-500 hover:text-slate-700"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <SelectCheckbox
                  checked={allInViewSelected}
                  indeterminate={someInViewSelected}
                  onChange={toggleAllInView}
                  ariaLabel="Select all visible notices"
                />
              </TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-slate-500"
                >
                  No notices found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((n) => {
                const Icon = typeIcon(n.type);
                const isSelected = selectedIds.has(n._id);
                return (
                  <TableRow
                    key={n._id}
                    data-state={isSelected ? "selected" : undefined}
                    className="group data-[state=selected]:bg-blue-50/60 transition-colors"
                  >
                    <TableCell>
                      <SelectCheckbox
                        checked={isSelected}
                        onChange={(checked) => toggleRow(n._id, checked)}
                        ariaLabel={`Select notice for ${n.studentId}`}
                      />
                    </TableCell>
                    <TableCell className="font-bold font-mono">
                      {n.studentId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 opacity-60" />
                        {n.type}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground max-w-sm truncate">
                      {n.description}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${statusVariant(n.status)}`}
                      >
                        {n.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {n.status !== "Picked Up" && (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isMutating}
                                  onClick={() => markAs(n, "Picked Up")}
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
                                onClick={() => openEdit(n)}
                                className="h-8 w-8 hover:text-blue-600 hover:bg-blue-50 hover:cursor-pointer"
                                aria-label={`Edit notice for ${n.studentId}`}
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
                                disabled={isMutating}
                                onClick={() => handleDelete(n)}
                                className="h-8 w-8 hover:text-red-600 hover:bg-red-50 hover:cursor-pointer"
                                aria-label={`Delete notice for ${n.studentId}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <TooltipContent>Delete notice</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {modalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="notice-modal-title"
                onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <Card className="w-full max-w-lg shadow-2xl border-none">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h2
                  id="notice-modal-title"
                  className="text-xl font-bold text-slate-900"
                >
                  {editing ? "Edit Notice" : "Register New Notice"}
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
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="space-y-2 sm:col-span-2">
                    <label
                      htmlFor="notice-students"
                      className="text-sm font-semibold text-slate-700"
                    >
                      {editing ? "Student ID" : "Students"}
                      <RequiredMark />
                    </label>
                    {editing ? (
                      <>
                        <Input
                          id="notice-students"
                          required
                          autoCapitalize="characters"
                          spellCheck={false}
                          value={editingStudentId}
                          onChange={(e) =>
                            setEditingStudentId(e.target.value.toUpperCase())
                          }
                          placeholder="S12350130"
                          className="font-mono uppercase"
                        />
                        <p className="text-xs text-slate-500">
                          Format:{" "}
                          <span className="font-mono">S</span> followed by 8
                          digits.
                        </p>
                      </>
                    ) : (
                      <>
                        <MultiSelect
                          id="notice-students"
                          options={studentOptions}
                          value={selectedStudentIds}
                          onValueChange={setSelectedStudentIds}
                          placeholder={
                            studentOptions.length === 0
                              ? "No approved students yet"
                              : "Type to filter, click to pick..."
                          }
                          emptyMessage={
                            studentOptions.length === 0
                              ? "No approved students with an S-format ID."
                              : "No matches."
                          }
                          disabled={studentOptions.length === 0}
                        />
                        <p className="text-xs text-slate-500">
                          {selectedStudentIds.length > 0
                            ? `${selectedStudentIds.length} student${selectedStudentIds.length === 1 ? "" : "s"} will receive this notice.`
                            : "Pick one or more approved students."}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="notice-type"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Type
                      <RequiredMark />
                    </label>
                    <select
                      id="notice-type"
                      required
                      value={form.type}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          type: e.target.value as NoticeType,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      {TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="notice-status"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Status
                      <RequiredMark />
                    </label>
                    <select
                      id="notice-status"
                      required
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value as NoticeStatus,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label
                      htmlFor="notice-location"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Pickup Location
                      <RequiredMark />
                    </label>
                    <Input
                      id="notice-location"
                      required
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      placeholder="OIR Mailroom (Admin Bldg 2F)"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label
                      htmlFor="notice-description"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Description / Notes
                      <RequiredMark />
                    </label>
                    <textarea
                      id="notice-description"
                      required
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="e.g. Large blue box from Amazon, registered letter from embassy, etc."
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 resize-y"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2 flex justify-end gap-3">
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
                      className="gap-2 bg-[#2B4156] hover:bg-[#1f3142] hover:cursor-pointer"
                    >
                      {isSaving && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {isSaving
                        ? "Saving..."
                        : editing
                          ? "Save Changes"
                          : selectedStudentIds.length > 1
                            ? `Create ${selectedStudentIds.length} Notices`
                            : "Create Notice"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      <div className="flex items-center gap-1 text-xs text-slate-500">
        <MapPin className="h-3.5 w-3.5" />
        Notices are visible to students on the public notice board.
      </div>
    </div>
  );
}
