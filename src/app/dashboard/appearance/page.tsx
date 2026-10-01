"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { THEMES } from "@/lib/themes";
import {
  Palette,
  CheckCircle,
  Save,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Type,
  Eye,
} from "lucide-react";

const ACCENT_PRESETS = [
  { name: "Indigo", color: "#6366f1" },
  { name: "Sky", color: "#0284c7" },
  { name: "Cyan", color: "#06b6d4" },
  { name: "Emerald", color: "#10b981" },
  { name: "Gold", color: "#c59b27" },
  { name: "Orange", color: "#f97316" },
  { name: "Rose", color: "#f43f5e" },
  { name: "Purple", color: "#a855f7" },
  { name: "Slate", color: "#475569" },
  { name: "Charcoal", color: "#171717" },
];

export default function AppearancePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [username, setUsername] = useState("");
  const [themeId, setThemeId] = useState("creative");
  const [accentColor, setAccentColor] = useState("#6366f1");
  const [fontFamily, setFontFamily] = useState("sans");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (json.success && json.profile) {
          setUsername(json.profile.username || "");
          setThemeId(json.profile.theme_id || "creative");
          setAccentColor(json.profile.accent_color || "#6366f1");
          setFontFamily(json.profile.font_family || "sans");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage("");
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme_id: themeId,
          accent_color: accentColor,
          font_family: fontFamily,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMessage(json.error || "Failed to update appearance");
      } else {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error");
    } finally {
      setSaving(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Palette className="text-indigo-600" size={24} />
            <span>Appearance & Themes</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Transform your profile aesthetic with curated themes, typography, and custom accent colors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/@${username}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors"
          >
            <Eye size={13} />
            <span>Preview Live</span>
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            <span>{saving ? "Saving..." : "Apply Changes"}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 text-xs font-semibold">
          <CheckCircle size={16} className="text-emerald-500" />
          <span>Appearance settings saved! Changes are live on your profile.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center gap-3 text-xs font-semibold">
          <AlertCircle size={16} className="text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Theme Cards Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-600" />
            <span>Select Your Theme</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Choose from 9 bespoke design layouts tuned for different disciplines and personal styles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(THEMES).map(([id, theme]) => {
            const isSelected = themeId === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setThemeId(id)}
                className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                  isSelected
                    ? "border-indigo-600 ring-2 ring-indigo-600/30 bg-indigo-50/20 dark:bg-indigo-950/30"
                    : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-xs"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full p-1 shadow-sm">
                    <CheckCircle size={14} />
                  </span>
                )}

                {/* Color swatches preview bar */}
                <div className="h-14 rounded-xl mb-3 flex items-center justify-between p-2.5 overflow-hidden border border-neutral-200/50 dark:border-neutral-800"
                  style={{
                    backgroundColor: id === "creative" ? "#0b0f19" : id === "dark" ? "#000000" : id === "glass" ? "#1e1b4b" : id === "elegant" ? "#fcfaf7" : "#ffffff"
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full shadow-xs"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                    <span
                      className="text-[10px] font-bold"
                      style={{
                        color: id === "creative" || id === "dark" || id === "glass" ? "#ffffff" : "#171717"
                      }}
                    >
                      {theme.name}
                    </span>
                  </div>
                  <span
                    className="text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold"
                    style={{
                      backgroundColor: theme.accentColor + "25",
                      color: theme.accentColor
                    }}
                  >
                    {theme.fontFamily}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {theme.name}
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {theme.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color Customizer */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Accent Brand Color
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            This color highlights buttons, links, skill meters, and active tabs across your profile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {ACCENT_PRESETS.map((preset) => {
            const isChosen = accentColor.toLowerCase() === preset.color.toLowerCase();
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => setAccentColor(preset.color)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  isChosen
                    ? "border-neutral-900 dark:border-white shadow-xs font-bold ring-2 ring-neutral-400/40"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: preset.color }}
                />
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Custom Hex:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
            />
            <input
              type="text"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              placeholder="#6366f1"
              maxLength={7}
              className="w-28 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-mono text-neutral-900 dark:text-neutral-100 uppercase"
            />
          </div>
        </div>
      </div>

      {/* Font Family Options */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Type size={16} className="text-indigo-600" />
            <span>Typography Style</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Select the primary typeface system for titles and narrative prose.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "sans", name: "Sans-Serif", preview: "Inter & System UI", desc: "Clean, modern, highly legible on all screens" },
            { id: "serif", name: "Serif", preview: "Georgia & Editorial", desc: "Classic, literary, warm, and prestigious" },
            { id: "mono", name: "Monospace", preview: "JetBrains & Fira", desc: "Technical, developer-first, terminal vibe" },
          ].map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => setFontFamily(font.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                fontFamily === font.id
                  ? "border-indigo-600 ring-2 ring-indigo-600/20 bg-indigo-50/30 dark:bg-indigo-950/30"
                  : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
              }`}
            >
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block">
                {font.name}
              </span>
              <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 block mt-0.5 font-mono">
                {font.preview}
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block mt-1">
                {font.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={14} />
          )}
          <span>{saving ? "Saving Changes..." : "Save Appearance"}</span>
        </button>
      </div>
    </div>
  );
}
