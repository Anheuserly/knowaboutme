"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Eye,
  Mail,
  Search,
  CheckCircle,
  XCircle,
  ExternalLink,
  Sparkles,
  Lock,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  role: "super_admin" | "admin" | "moderator" | "user";
  status: "active" | "suspended" | "deleted";
  created_at: string;
  last_login_at: string | null;
  username: string | null;
  display_name: string | null;
  profile_type: string | null;
  profile_status: string | null;
  is_verified: boolean;
  theme_id: string | null;
}

interface AdminStats {
  totalUsers: number;
  totalProfiles: number;
  verifiedProfiles: number;
  totalViews: number;
  totalMessages: number;
}

export default function AdminConsolePage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/stats"),
      ]);

      const usersJson = await usersRes.json();
      const statsJson = await statsRes.json();

      if (usersJson.success) setUsers(usersJson.users);
      if (statsJson.success) setStats(statsJson.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleVerified = async (user: AdminUser) => {
    setUpdatingId(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          is_verified: !user.is_verified,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, is_verified: !u.is_verified } : u))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const nextStatus = user.status === "active" ? "suspended" : "active";
    setUpdatingId(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          status: nextStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.display_name && u.display_name.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <ShieldCheck size={18} />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
              Platform Administration
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Global governance, moderation, verification badges, and system overview.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 self-start sm:self-auto shadow-xs"
        >
          <span>Return to Dashboard</span>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-semibold">Total Accounts</span>
            <Users size={16} className="text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
            {stats?.totalUsers || 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-semibold">Published Profiles</span>
            <UserCheck size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
            {stats?.totalProfiles || 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-semibold">Verified Identities</span>
            <ShieldCheck size={16} className="text-sky-500" />
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
            {stats?.verifiedProfiles || 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-semibold">Platform Page Views</span>
            <Eye size={16} className="text-purple-500" />
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
            {(stats?.totalViews || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* User Directory */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs overflow-hidden">
        {/* Search header */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search size={14} className="absolute left-3.5 top-3 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, email, or username..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <span className="text-xs text-neutral-500">
            Showing {filteredUsers.length} of {users.length} members
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 font-semibold border-b border-neutral-100 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-4">User / Profile</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Verified</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-300">
                        {user.display_name?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                          <span>{user.display_name || "Unset"}</span>
                          {user.username && (
                            <Link
                              href={`/@${user.username}`}
                              target="_blank"
                              className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono text-[11px]"
                            >
                              @{user.username}
                            </Link>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 font-mono">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        user.role === "super_admin" || user.role === "admin"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                          : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.status === "active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      />
                      <span>{user.status}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleVerified(user)}
                      disabled={updatingId === user.id}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        user.is_verified
                          ? "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                          : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 hover:text-neutral-700"
                      }`}
                    >
                      <ShieldCheck size={13} className={user.is_verified ? "text-sky-500" : "text-neutral-400"} />
                      <span>{user.is_verified ? "Verified" : "Unverified"}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.username && (
                        <Link
                          href={`/@${user.username}`}
                          target="_blank"
                          className="p-1.5 text-neutral-400 hover:text-indigo-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="View public profile"
                        >
                          <ExternalLink size={14} />
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user)}
                        disabled={updatingId === user.id}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                          user.status === "active"
                            ? "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40"
                        }`}
                      >
                        {user.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
