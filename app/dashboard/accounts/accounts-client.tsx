"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, X } from "lucide-react";
import { toggleApproveAccount, deleteAccount, createOrUpdateAccount } from "@/lib/actions/account.action";
import { UserType, getColumns } from "./columns";
import { DataTable } from "./data-table";

export default function AccountsClient({ users }: { users: UserType[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    batchId: "",
    role: "user",
    password: "",
  });

  const handleApprove = async (id: string, currentStatus: boolean) => {
    await toggleApproveAccount(id, !currentStatus);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this account? This action cannot be undone.")) {
      await deleteAccount(id);
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", batchId: "", role: "user", password: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      batchId: user.batchId,
      role: user.role,
      password: "", // Leave blank to avoid accidental overwrite
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Pass null for ID if creating a new user
    const res = await createOrUpdateAccount(editingUser ? editingUser._id : null, formData);
    setIsLoading(false);
    
    if (res?.error) {
      alert(res.error);
    } else {
      closeModal();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Accounts</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage user roles, approvals, and access.</p>
        </div>
        <Button onClick={openAddModal} className="gap-2 bg-blue-600 hover:bg-blue-700 hover:cursor-pointer shadow-sm">
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
      />

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-2xl border-none">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">{editingUser ? "Edit Account" : "Add New Account"}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 hover:cursor-pointer transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Student / Batch ID</label>
                  <Input
                    required
                    value={formData.batchId}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                    placeholder="S12345678"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Account Role</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 hover:cursor-pointer"
                  >
                    <option value="user">User (Student)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Password {editingUser && <span className="text-xs text-slate-400 font-normal">(Leave blank to keep unchanged)</span>}
                  </label>
                  <Input
                    type="password"
                    required={!editingUser} // Required if creating new
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={closeModal} className="hover:cursor-pointer">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer">
                    {isLoading ? "Saving..." : editingUser ? "Save Changes" : "Create Account"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}