"use client";

import React, { useState, useEffect } from "react";
import {
  FolderGit2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Palette,
  Heart,
  Trophy,
  MessageSquareQuote,
  Milestone,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Layers,
  X,
} from "lucide-react";

type SectionTab =
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "artwork"
  | "hobbies"
  | "achievements"
  | "testimonials"
  | "timeline";

export default function SectionsManagerPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>("experience");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Dynamic form state
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const loadItems = async (type: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sections?type=${type}`);
      const json = await res.json();
      if (json.success && json.items) {
        setItems(json.items);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems(activeTab);
  }, [activeTab]);

  const handleOpenAdd = () => {
    setFormValues({});
    setIsModalOpen(true);
  };

  const handleCloseAdd = () => {
    setIsModalOpen(false);
    setFormValues({});
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormValues((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    // Map tab to singular sectionType for backend
    let sectionType: string = activeTab;
    if (activeTab === "skills") sectionType = "skill";
    if (activeTab === "projects") sectionType = "project";
    if (activeTab === "hobbies") sectionType = "hobby";
    if (activeTab === "achievements") sectionType = "achievement";
    if (activeTab === "testimonials") sectionType = "testimonial";

    try {
      const res = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType,
          data: formValues,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setStatusMessage({ type: "error", text: json.error || "Failed to add item" });
      } else {
        setStatusMessage({ type: "success", text: "New item added successfully!" });
        setIsModalOpen(false);
        setFormValues({});
        loadItems(activeTab);
        setTimeout(() => setStatusMessage(null), 3500);
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`/api/sections/${id}?type=${activeTab}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const tabs: { id: SectionTab; label: string; icon: any }[] = [
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Sparkles },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "artwork", label: "Artwork & Media", icon: Palette },
    { id: "hobbies", label: "Hobbies & Interests", icon: Heart },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { id: "timeline", label: "Milestones", icon: Milestone },
  ];

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Layers className="text-indigo-600" size={24} />
            <span>Sections & Portfolio</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Build your comprehensive digital identity. Add experiences, projects, skills, artwork, and milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Add New {tabs.find((t) => t.id === activeTab)?.label}</span>
        </button>
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

      {/* Tabs navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200 dark:border-neutral-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Items List */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">
            <Layers size={36} className="mx-auto mb-3 opacity-40" />
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              No entries in this section yet
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Add your first {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()} entry to display it on your public page.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100"
            >
              <Plus size={14} />
              <span>Add Entry</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {items.map((item) => (
              <div
                key={item.id}
                className="py-4 flex items-start justify-between gap-4 group"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {item.title || item.name || item.company_name || item.institution_name}
                    </h4>
                    {(item.position || item.degree || item.category || item.role) && (
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
                        {item.position || item.degree || item.category || item.role}
                      </span>
                    )}
                    {item.is_current && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                        Present
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Meta items */}
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 pt-1 flex-wrap">
                    {item.location && <span>📍 {item.location}</span>}
                    {item.organization && <span>🏛️ {item.organization}</span>}
                    {item.proficiency && <span>⚡ {item.proficiency}% proficiency</span>}
                    {item.years_experience && <span>⏳ {item.years_experience} yrs</span>}
                    {item.project_url && (
                      <a
                        href={item.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Link</span>
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    title="Delete item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Add {tabs.find((t) => t.id === activeTab)?.label}
              </h3>
              <button
                onClick={handleCloseAdd}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dynamic fields based on activeTab */}
              {activeTab === "experience" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      required
                      placeholder="e.g. Acme Corp or Self-Employed"
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Job Position / Role *
                    </label>
                    <input
                      type="text"
                      name="position"
                      required
                      placeholder="e.g. Lead Product Designer"
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        placeholder="e.g. San Francisco or Remote"
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Company URL
                      </label>
                      <input
                        type="url"
                        name="company_url"
                        placeholder="https://company.com"
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="is_current"
                      name="is_current"
                      onChange={handleFormChange}
                      className="rounded text-indigo-600"
                    />
                    <label htmlFor="is_current" className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                      I currently work in this role
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      placeholder="Key achievements, projects spearheaded, or impact..."
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

              {activeTab === "education" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Institution / University *
                    </label>
                    <input
                      type="text"
                      name="institution_name"
                      required
                      placeholder="e.g. Stanford University"
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        name="degree"
                        placeholder="e.g. Bachelor of Science"
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        name="field_of_study"
                        placeholder="e.g. Computer Science"
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Description & Honors
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      placeholder="Specializations, thesis, honors, or activities..."
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

              {activeTab === "skills" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Skill Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. TypeScript, Product Strategy, Figma"
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        placeholder="e.g. Engineering, Design, Leadership"
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Proficiency (0-100%)
                      </label>
                      <input
                        type="number"
                        name="proficiency"
                        min="1"
                        max="100"
                        defaultValue="85"
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === "projects" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. NextGen Design System"
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Your Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      placeholder="e.g. Lead Architect & Creator"
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      name="technologies"
                      placeholder="React, Next.js, Tailwind, GraphQL"
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Live Project URL
                      </label>
                      <input
                        type="url"
                        name="project_url"
                        placeholder="https://project.com"
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        GitHub / Source
                      </label>
                      <input
                        type="url"
                        name="github_url"
                        placeholder="https://github.com/..."
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      placeholder="Describe what the project does, key features, and your contribution..."
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

              {activeTab === "artwork" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="e.g. Neon Horizon"
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        placeholder="Photography, 3D, Illustration"
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        name="image_url"
                        placeholder="https://..."
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={2}
                      placeholder="Story or medium behind this work..."
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

              {activeTab === "hobbies" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Hobby / Interest Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Mechanical Keyboards, Marathon Running"
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Short Description
                    </label>
                    <textarea
                      name="description"
                      rows={2}
                      placeholder="What you love about it or recent endeavors..."
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

              {activeTab === "achievements" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Achievement / Award Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="e.g. Design Award of the Year"
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Conferred By / Organization
                    </label>
                    <input
                      type="text"
                      name="organization"
                      placeholder="e.g. Awwwards or Forbes 30 Under 30"
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={2}
                      placeholder="Details regarding this recognition..."
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

              {activeTab === "testimonials" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        name="role"
                        placeholder="e.g. VP of Product"
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        placeholder="e.g. Stripe"
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Quote / Testimonial *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={3}
                      placeholder="What they shared about working with you..."
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

              {activeTab === "timeline" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Milestone Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="e.g. Founded studio or Published first book"
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={2}
                      placeholder="What happened and its impact..."
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={handleCloseAdd}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting ? "Adding..." : "Add to Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
