"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Shield,
  KeyRound,
  EyeOff,
  Globe,
  CheckCircle,
  AlertCircle,
  Save,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Settings state
  const [settings, setSettings] = useState({
    profile_status: "published",
    allow_contact: true,
    show_email: false,
    show_phone: false,
    allow_indexing: true,
    show_social_links: true,
    show_location: true,
    show_view_count: false,
    maintenance_mode: false,
    email: "",
  });

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.settings) {
          setSettings({
            profile_status: json.settings.profile_status || "published",
            allow_contact: Boolean(json.settings.allow_contact),
            show_email: Boolean(json.settings.show_email),
            show_phone: Boolean(json.settings.show_phone),
            allow_indexing: Boolean(json.settings.allow_indexing),
            show_social_links: Boolean(json.settings.show_social_links),
            show_location: Boolean(json.settings.show_location),
            show_view_count: Boolean(json.settings.show_view_count),
            maintenance_mode: Boolean(json.settings.maintenance_mode),
            email: json.settings.email || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePrivacy = async () => {
    setSavingPrivacy(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setStatusMessage({ type: "error", text: json.error || "Failed to update settings" });
      } else {
        setStatusMessage({ type: "success", text: "Settings saved successfully!" });
        setTimeout(() => setStatusMessage(null), 3500);
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setSavingPrivacy(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (newPassword.length < 8) {
      setStatusMessage({ type: "error", text: "New password must be at least 8 characters" });
      return;
    }

    setSavingPassword(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setStatusMessage({ type: "error", text: json.error || "Failed to update password" });
      } else {
        setStatusMessage({ type: "success", text: "Password updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setStatusMessage(null), 3500);
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
          <Settings className="text-indigo-600" size={24} />
          <span>Settings & Privacy Controls</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Configure profile visibility, contact controls, search engine indexing, and account credentials.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
            statusMessage.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : "bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle size={16} className="text-emerald-500" />
          ) : (
            <AlertCircle size={16} className="text-rose-500" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Profile Status */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Globe size={16} className="text-indigo-600" />
          <span>Profile Visibility Status</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "published", label: "Published", desc: "Live and accessible to the public" },
            { id: "private", label: "Private", desc: "Only logged-in you can view" },
            { id: "draft", label: "Draft", desc: "Hidden while you prepare content" },
          ].map((status) => (
            <button
              key={status.id}
              type="button"
              onClick={() => setSettings((p) => ({ ...p, profile_status: status.id }))}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                settings.profile_status === status.id
                  ? "border-indigo-600 ring-2 ring-indigo-600/20 bg-indigo-50/40 dark:bg-indigo-950/40"
                  : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
              }`}
            >
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block">
                {status.label}
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                {status.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Toggles */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Shield size={16} className="text-indigo-600" />
          <span>Privacy & Contact Permissions</span>
        </h2>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                Allow Contact Form Inquiries
              </p>
              <p className="text-[11px] text-neutral-500">
                Visitors can message you without revealing your private email address.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.allow_contact}
              onChange={() => handleToggle("allow_contact")}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                Allow Search Engine Indexing
              </p>
              <p className="text-[11px] text-neutral-500">
                Include your profile in Google, Bing, and search engines.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.allow_indexing}
              onChange={() => handleToggle("allow_indexing")}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                Show Location
              </p>
              <p className="text-[11px] text-neutral-500">
                Display your city/country on your public profile header.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.show_location}
              onChange={() => handleToggle("show_location")}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                Show Live View Counter
              </p>
              <p className="text-[11px] text-neutral-500">
                Render view statistics badge on public profile.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.show_view_count}
              onChange={() => handleToggle("show_view_count")}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSavePrivacy}
            disabled={savingPrivacy}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all disabled:opacity-50"
          >
            {savingPrivacy ? "Saving..." : "Save Privacy Settings"}
          </button>
        </div>
      </div>

      {/* Security: Change Password */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <KeyRound size={16} className="text-indigo-600" />
          <span>Security & Password</span>
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              New Password * (min 8 characters)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 transition-all disabled:opacity-50"
          >
            {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
