"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Sparkles,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Camera,
  Image as ImageIcon,
  MapPin,
  Globe,
  Briefcase,
  Layers,
  FileText,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    display_name: "",
    headline: "",
    profile_type: "creator",
    pronouns: "",
    availability_status: "Open to opportunities",
    location: "",
    website_url: "",
    short_bio: "",
    long_bio: "",
    profile_photo_url: "",
    cover_image_url: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (json.success && json.profile) {
          setFormData({
            username: json.profile.username || "",
            display_name: json.profile.display_name || "",
            headline: json.profile.headline || "",
            profile_type: json.profile.profile_type || "creator",
            pronouns: json.profile.pronouns || "",
            availability_status: json.profile.availability_status || "Open to opportunities",
            location: json.profile.location || "",
            website_url: json.profile.website_url || "",
            short_bio: json.profile.short_bio || "",
            long_bio: json.profile.long_bio || "",
            profile_photo_url: json.profile.profile_photo_url || "",
            cover_image_url: json.profile.cover_image_url || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMessage(json.error || "Failed to update profile");
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <User className="text-indigo-600" size={24} />
            <span>Edit Profile</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Customize how you present your digital identity to the world.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/@${formData.username}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors"
          >
            <ExternalLink size={13} />
            <span>View Public Page</span>
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 text-xs font-semibold">
          <CheckCircle size={16} className="text-emerald-500" />
          <span>Profile changes saved successfully! Changes are live on your public page.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center gap-3 text-xs font-semibold">
          <AlertCircle size={16} className="text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Visual Identity / Images */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <Camera size={16} className="text-indigo-600" />
            <span>Profile & Cover Images</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Profile Photo URL
              </label>
              <div className="flex items-center gap-3">
                {formData.profile_photo_url ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700 shrink-0">
                    <SafeImage
                      src={formData.profile_photo_url}
                      alt="Preview"
                      fallbackType="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-400">
                    <User size={20} />
                  </div>
                )}
                <input
                  type="url"
                  name="profile_photo_url"
                  value={formData.profile_photo_url}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mr-1">Presets:</span>
                {[
                  { label: "Creator", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" },
                  { label: "Dev", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" },
                  { label: "Studio", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80" },
                  { label: "Minimal", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80" },
                ].map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, profile_photo_url: p.url }))}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Cover Banner Image URL
              </label>
              <div className="flex items-center gap-3">
                {formData.cover_image_url ? (
                  <div className="w-16 h-10 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 shrink-0">
                    <SafeImage
                      src={formData.cover_image_url}
                      alt="Cover Preview"
                      fallbackType="cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-400">
                    <ImageIcon size={18} />
                  </div>
                )}
                <input
                  type="url"
                  name="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mr-1">Presets:</span>
                {[
                  { label: "Cosmic", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1800&q=80" },
                  { label: "Obsidian", url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1800&q=80" },
                  { label: "Tech Work", url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1800&q=80" },
                  { label: "Neon", url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1800&q=80" },
                ].map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, cover_image_url: p.url }))}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <User size={16} className="text-indigo-600" />
            <span>Basic Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Display Name *
              </label>
              <input
                type="text"
                name="display_name"
                required
                value={formData.display_name}
                onChange={handleChange}
                placeholder="Alex Morgan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Headline / Title
              </label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="Product Architect & Creative Technologist"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Profile Type
              </label>
              <select
                name="profile_type"
                value={formData.profile_type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="creator">Creator / Multi-disciplinary</option>
                <option value="developer">Software Engineer / Developer</option>
                <option value="designer">Designer / Art Director</option>
                <option value="professional">Professional / Executive</option>
                <option value="researcher">Researcher / Academic</option>
                <option value="artist">Visual Artist / Photographer</option>
                <option value="student">Student / Early Career</option>
                <option value="personal">Personal Identity</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Pronouns
              </label>
              <input
                type="text"
                name="pronouns"
                value={formData.pronouns}
                onChange={handleChange}
                placeholder="they/them, she/her, he/him"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3.5 top-3 text-neutral-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="San Francisco, CA or Remote"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Availability Badge
              </label>
              <div className="relative">
                <Briefcase size={14} className="absolute left-3.5 top-3 text-neutral-400" />
                <input
                  type="text"
                  name="availability_status"
                  value={formData.availability_status}
                  onChange={handleChange}
                  placeholder="Open to opportunities / Consulting"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Personal Website URL
              </label>
              <div className="relative">
                <Globe size={14} className="absolute left-3.5 top-3 text-neutral-400" />
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  placeholder="https://yourdomain.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Biographies */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <FileText size={16} className="text-indigo-600" />
            <span>Biographies & Story</span>
          </h2>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Short Bio (Elevator Pitch)
                </label>
                <span className="text-[11px] text-neutral-400">
                  {formData.short_bio.length}/300 chars
                </span>
              </div>
              <textarea
                name="short_bio"
                rows={3}
                maxLength={300}
                value={formData.short_bio}
                onChange={handleChange}
                placeholder="A concise, compelling 2-3 sentence overview of who you are and what you do..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Full Biography (Your Complete Story)
              </label>
              <textarea
                name="long_bio"
                rows={8}
                value={formData.long_bio}
                onChange={handleChange}
                placeholder="Share your background, journey, what inspires you, core philosophy, and where you're heading next..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
              />
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5">
                Renders in your biography section with clean paragraph breaks and formatting.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
