"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SOCIAL_PLATFORMS } from "@/lib/social-platforms";
import { SocialIcon } from "@/components/profile/SocialIcon";
import {
  Share2,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Globe,
} from "lucide-react";

interface SocialLinkItem {
  id: string;
  platform: string;
  label: string | null;
  username: string | null;
  url: string;
  display_order: number;
  is_visible: boolean;
}

export default function SocialLinksPage() {
  const [links, setLinks] = useState<SocialLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [selectedPlatform, setSelectedPlatform] = useState("github");
  const [customLabel, setCustomLabel] = useState("");
  const [userInput, setUserInput] = useState("");

  const loadLinks = async () => {
    try {
      const res = await fetch("/api/social-links");
      const json = await res.json();
      if (json.success && json.socialLinks) {
        setLinks(json.socialLinks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setAdding(true);
    setStatusMessage(null);

    const platformDef = SOCIAL_PLATFORMS[selectedPlatform];
    let finalUrl = userInput.trim();

    // If user provided a username or handle without https://, auto-prefix with platform baseUrlPrefix
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      const cleanHandle = finalUrl.replace(/^@/, "");
      if (platformDef?.baseUrlPrefix) {
        finalUrl = `${platformDef.baseUrlPrefix}${cleanHandle}`;
      } else {
        finalUrl = `https://${finalUrl}`;
      }
    }

    try {
      const res = await fetch("/api/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selectedPlatform,
          label: customLabel.trim() || platformDef?.name || selectedPlatform,
          username: userInput.replace(/^@/, ""),
          url: finalUrl,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setStatusMessage({ type: "error", text: json.error || "Failed to add social link" });
      } else {
        setUserInput("");
        setCustomLabel("");
        setStatusMessage({ type: "success", text: "Link added to your profile!" });
        loadLinks();
        setTimeout(() => setStatusMessage(null), 3500);
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/social-links/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activePlatformDef = SOCIAL_PLATFORMS[selectedPlatform];

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
          <Share2 className="text-indigo-600" size={24} />
          <span>Social Links & Profiles</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Connect all your digital homes. Visitors can find your social networks, portfolios, and media accounts in one place.
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

      {/* Add New Link Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Plus size={16} className="text-indigo-600" />
          <span>Add New Account or Link</span>
        </h2>

        <form onSubmit={handleAddLink} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Platform Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Platform
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => {
                  setSelectedPlatform(e.target.value);
                  setCustomLabel(SOCIAL_PLATFORMS[e.target.value]?.name || "");
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.entries(SOCIAL_PLATFORMS).map(([id, plat]) => (
                  <option key={id} value={id}>
                    {plat.name} ({plat.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Label */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Button Label (Optional)
              </label>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder={activePlatformDef?.name || "e.g. GitHub"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Handle or URL */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Handle or Full URL *
              </label>
              <input
                type="text"
                required
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={activePlatformDef?.placeholder || "username or URL"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Prefixes automatically applied if only handle is provided (e.g. {activePlatformDef?.baseUrlPrefix}username).
            </p>
            <button
              type="submit"
              disabled={adding || !userInput.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {adding ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              <span>Add Link</span>
            </button>
          </div>
        </form>
      </div>

      {/* Active Links List */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <LinkIcon size={16} className="text-indigo-600" />
            <span>Active Links ({links.length})</span>
          </h2>
          <span className="text-[11px] text-neutral-500">
            Visible on your public header & footer
          </span>
        </div>

        {links.length === 0 ? (
          <div className="py-12 text-center text-neutral-400">
            <Globe size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-xs font-medium">No social links added yet.</p>
            <p className="text-[11px] mt-1 text-neutral-500">
              Add your GitHub, LinkedIn, or personal website above!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {links.map((link) => (
              <div
                key={link.id}
                className="py-3.5 flex items-center justify-between gap-4 group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    <SocialIcon platform={link.platform} size={16} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                        {link.label || link.platform}
                      </p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                        {link.platform}
                      </span>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 truncate inline-flex items-center gap-1 mt-0.5 max-w-sm"
                    >
                      <span className="truncate">{link.url}</span>
                      <ExternalLink size={10} className="shrink-0" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteLink(link.id)}
                    disabled={deletingId === link.id}
                    className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    title="Remove Link"
                  >
                    {deletingId === link.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
