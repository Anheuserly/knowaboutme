"use client";

import React, { useState } from "react";
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderGit2,
  Palette,
  Trophy,
  Heart,
  Quote,
  Clock,
  ExternalLink,
  Mail,
  Send,
  CheckCircle,
  X,
  Maximize2,
  Layers,
  ChevronRight,
} from "lucide-react";
import { SocialIcon } from "@/components/profile/SocialIcon";
import type { PublicProfile } from "@/types/profile";
import type { ThemeConfig } from "@/lib/themes";
import { formatDate } from "@/lib/utils";
import { SafeImage } from "@/components/ui/SafeImage";

interface ProfileSectionsProps {
  profile: PublicProfile;
  theme: ThemeConfig;
  contactRef?: React.RefObject<HTMLDivElement | null>;
}

export function ProfileSections({
  profile,
  theme,
  contactRef,
}: ProfileSectionsProps) {
  // Contact form state
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Lightbox modal state for Artwork & Project images
  const [activeLightboxImage, setActiveLightboxImage] = useState<{
    src: string;
    title: string;
    description?: string | null;
    externalUrl?: string | null;
  } | null>(null);

  const accentColor = profile.accent_color || theme.accentColor || "#6366f1";

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          name: senderName,
          email: senderEmail,
          message,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSentSuccess(true);
        setMessage("");
      } else {
        setErrorMessage(data.error || "Failed to send message. Please try again.");
      }
    } catch {
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  // Section anchor jump helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <div className="space-y-12 py-6 max-w-4xl mx-auto px-4 sm:px-8">
        {/* Navigation Quick-Jump Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {(profile.short_bio || profile.long_bio) && (
            <button
              onClick={() => scrollTo("section-bio")}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0"
            >
              Story
            </button>
          )}
          {profile.projects && profile.projects.length > 0 && (
            <button
              onClick={() => scrollTo("section-projects")}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0"
            >
              Projects ({profile.projects.length})
            </button>
          )}
          {profile.artwork && profile.artwork.length > 0 && (
            <button
              onClick={() => scrollTo("section-artwork")}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0"
            >
              Artwork ({profile.artwork.length})
            </button>
          )}
          {profile.experiences && profile.experiences.length > 0 && (
            <button
              onClick={() => scrollTo("section-experience")}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0"
            >
              Experience
            </button>
          )}
          {profile.skills && profile.skills.length > 0 && (
            <button
              onClick={() => scrollTo("section-skills")}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0"
            >
              Skills
            </button>
          )}
          {profile.education && profile.education.length > 0 && (
            <button
              onClick={() => scrollTo("section-education")}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0"
            >
              Education
            </button>
          )}
          {profile.settings?.allow_contact !== false && (
            <button
              onClick={() => scrollTo("section-contact")}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0"
            >
              Contact
            </button>
          )}
        </div>

        {/* 1. ABOUT & BIOGRAPHY */}
        {(profile.short_bio || profile.long_bio) && (
          <section id="section-bio" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <Sparkles size={16} style={{ color: accentColor }} />
              <span>Biography &amp; Story</span>
            </div>

            <div className={`${theme.cardClass} rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm`}>
              {profile.short_bio && (
                <p className="text-base sm:text-lg font-medium leading-relaxed">
                  {profile.short_bio}
                </p>
              )}
              {profile.long_bio && (
                <div className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 space-y-3 whitespace-pre-line border-t border-neutral-100 dark:border-neutral-800/80 pt-4">
                  {profile.long_bio}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 2. FEATURED PROJECTS */}
        {profile.projects && profile.projects.length > 0 && (
          <section id="section-projects" className="space-y-4 scroll-mt-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <FolderGit2 size={16} style={{ color: accentColor }} />
                <span>Featured Projects</span>
              </div>
              <span className="text-xs text-neutral-400">
                {profile.projects.length} {profile.projects.length === 1 ? "project" : "projects"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {profile.projects.map((proj) => {
                let techList: string[] = [];
                if (Array.isArray(proj.technologies)) {
                  techList = proj.technologies;
                } else if (typeof proj.technologies === "string") {
                  try {
                    const parsed = JSON.parse(proj.technologies);
                    techList = Array.isArray(parsed) ? parsed : [proj.technologies];
                  } catch {
                    techList = proj.technologies.split(",").map((s: string) => s.trim()).filter(Boolean);
                  }
                }

                return (
                  <div
                    key={proj.id}
                    className={`${theme.cardClass} rounded-3xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl border border-neutral-200/80 dark:border-neutral-800/80 hover:-translate-y-1`}
                  >
                    {/* Project Cover Banner */}
                    <div
                      className="aspect-[16/9] w-full overflow-hidden relative bg-neutral-100 dark:bg-neutral-900 cursor-pointer"
                      onClick={() => {
                        if (proj.cover_image_url) {
                          setActiveLightboxImage({
                            src: proj.cover_image_url,
                            title: proj.name,
                            description: proj.description,
                            externalUrl: proj.project_url,
                          });
                        }
                      }}
                    >
                      <SafeImage
                        src={proj.cover_image_url}
                        alt={proj.name}
                        fallbackType="project"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {proj.cover_image_url && (
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="p-2.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                            <Maximize2 size={16} />
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {proj.name}
                          </h4>
                          {proj.role && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 shrink-0">
                              {proj.role}
                            </span>
                          )}
                        </div>

                        {proj.description && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mt-2 line-clamp-3">
                            {proj.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3 pt-2">
                        {techList.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {techList.map((t: string, idx: number) => (
                              <span
                                key={idx}
                                className="text-[11px] px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                          {proj.project_url && (
                            <a
                              href={proj.project_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                              style={{ color: accentColor }}
                            >
                              <span>Visit Project</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                          {proj.github_url && (
                            <a
                              href={proj.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                            >
                              <SocialIcon platform="github" size={13} />
                              <span>Code</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. ARTWORK & VISUAL EXPLORATIONS */}
        {profile.artwork && profile.artwork.length > 0 && (
          <section id="section-artwork" className="space-y-4 scroll-mt-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <Palette size={16} style={{ color: accentColor }} />
                <span>Artwork &amp; Visual Explorations</span>
              </div>
              <span className="text-xs text-neutral-400">
                {profile.artwork.length} {profile.artwork.length === 1 ? "piece" : "pieces"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {profile.artwork.map((art) => (
                <div
                  key={art.id}
                  className={`${theme.cardClass} rounded-3xl overflow-hidden group flex flex-col border border-neutral-200/80 dark:border-neutral-800/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                >
                  {/* Artwork Image Tile with Click-to-Zoom */}
                  <div
                    className="aspect-square w-full overflow-hidden relative bg-neutral-100 dark:bg-neutral-900 cursor-pointer"
                    onClick={() => {
                      if (art.image_url) {
                        setActiveLightboxImage({
                          src: art.image_url,
                          title: art.title,
                          description: art.description,
                          externalUrl: art.external_url,
                        });
                      }
                    }}
                  >
                    <SafeImage
                      src={art.image_url}
                      alt={art.title}
                      fallbackType="artwork"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {art.category && (
                      <span className="absolute top-3 left-3 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md shadow-sm">
                        {art.category}
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="p-2.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                        <Maximize2 size={16} />
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {art.title}
                      </h4>
                      {art.description && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1.5 line-clamp-2">
                          {art.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-xs">
                      {art.external_url ? (
                        <a
                          href={art.external_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold hover:underline"
                          style={{ color: accentColor }}
                        >
                          <span>View Piece</span>
                          <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="text-[10px] text-neutral-400">Original Work</span>
                      )}

                      {art.license && (
                        <span className="text-[10px] text-neutral-400">{art.license}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. PROFESSIONAL EXPERIENCE */}
        {profile.experiences && profile.experiences.length > 0 && (
          <section id="section-experience" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <Briefcase size={16} style={{ color: accentColor }} />
              <span>Professional Journey &amp; Experience</span>
            </div>

            <div className="space-y-4">
              {profile.experiences.map((exp) => (
                <div
                  key={exp.id}
                  className={`${theme.cardClass} rounded-3xl p-6 sm:p-7 border border-neutral-200/80 dark:border-neutral-800/80 transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                        {exp.position}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
                        {exp.company_url ? (
                          <a
                            href={exp.company_url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline inline-flex items-center gap-1 font-semibold"
                            style={{ color: accentColor }}
                          >
                            <span>{exp.company_name}</span>
                            <ExternalLink size={11} />
                          </a>
                        ) : (
                          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                            {exp.company_name}
                          </span>
                        )}
                        {exp.location && <span>&bull; {exp.location}</span>}
                      </div>
                    </div>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 w-fit shrink-0">
                      {formatDate(exp.start_date)} &mdash;{" "}
                      {exp.is_current ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          Present
                        </span>
                      ) : (
                        formatDate(exp.end_date)
                      )}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mt-3">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. SKILLS & COMPETENCIES */}
        {profile.skills && profile.skills.length > 0 && (
          <section id="section-skills" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <Sparkles size={16} style={{ color: accentColor }} />
              <span>Skills &amp; Competencies</span>
            </div>

            <div className={`${theme.cardClass} rounded-3xl p-6 sm:p-7 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm`}>
              <div className="flex flex-wrap gap-2.5">
                {profile.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/70 border border-neutral-200/60 dark:border-neutral-700/60 text-xs font-medium text-neutral-800 dark:text-neutral-200 shadow-2xs hover:scale-105 transition-transform"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                    <span>{skill.name}</span>
                    {skill.years_experience && (
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {skill.years_experience}y
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. EDUCATION & CREDENTIALS */}
        {profile.education && profile.education.length > 0 && (
          <section id="section-education" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <GraduationCap size={16} style={{ color: accentColor }} />
              <span>Education &amp; Credentials</span>
            </div>

            <div className="space-y-3">
              {profile.education.map((edu) => (
                <div
                  key={edu.id}
                  className={`${theme.cardClass} rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800/80`}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {edu.degree || "Degree"} &bull; {edu.field_of_study}
                      </h4>
                      <p className="text-xs text-neutral-500 font-medium mt-0.5">
                        {edu.institution_name} {edu.location && `(${edu.location})`}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">
                      {formatDate(edu.start_date)} &mdash; {formatDate(edu.end_date)}
                    </span>
                  </div>
                  {edu.grade && (
                    <p
                      className="text-xs font-medium mt-2"
                      style={{ color: accentColor }}
                    >
                      {edu.grade}
                    </p>
                  )}
                  {edu.description && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. ACHIEVEMENTS & HONORS */}
        {profile.achievements && profile.achievements.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <Trophy size={16} style={{ color: accentColor }} />
              <span>Honors &amp; Achievements</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`${theme.cardClass} rounded-2xl p-5 flex gap-4 border border-neutral-200/80 dark:border-neutral-800/80`}
                >
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0 h-fit">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {ach.title}
                    </h5>
                    {ach.organization && (
                      <p className="text-[11px] text-neutral-500 mt-0.5">{ach.organization}</p>
                    )}
                    {ach.description && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1.5">
                        {ach.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. TESTIMONIALS */}
        {profile.testimonials && profile.testimonials.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <Quote size={16} style={{ color: accentColor }} />
              <span>Testimonials &amp; Endorsements</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.testimonials.map((test) => (
                <div
                  key={test.id}
                  className={`${theme.cardClass} rounded-3xl p-6 flex flex-col justify-between space-y-4 border border-neutral-200/80 dark:border-neutral-800/80`}
                >
                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 italic leading-relaxed">
                    &ldquo;{test.message}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                      <SafeImage
                        src={test.photo_url}
                        alt={test.name}
                        fallbackType="avatar"
                        initials={test.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        {test.name}
                      </h5>
                      <p className="text-[11px] text-neutral-500">
                        {test.role} {test.company && `at ${test.company}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 9. CONTACT MESSAGE SECTION */}
        {profile.settings?.allow_contact !== false && (
          <section id="section-contact" ref={contactRef} className="space-y-4 pt-4 scroll-mt-20">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <Mail size={16} style={{ color: accentColor }} />
              <span>Get in Touch</span>
            </div>

            <div className={`${theme.cardClass} rounded-3xl p-6 sm:p-8 space-y-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-md`}>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Send a message to {profile.display_name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Have a question, collaboration inquiry, or simply want to say hello? Your message goes directly to their verified inbox.
                </p>
              </div>

              {sentSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 mb-1">
                    <CheckCircle size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Thank you. {profile.display_name} has received your message and will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSentSuccess(false)}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-900/60 rounded-xl hover:bg-emerald-200 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="Alex Parker"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your note here..."
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-xl text-white text-xs font-semibold shadow-md hover:opacity-95 transition-all disabled:opacity-50"
                    style={{
                      backgroundColor: accentColor,
                      boxShadow: `0 8px 20px -4px ${accentColor}40`,
                    }}
                  >
                    <Send size={14} />
                    <span>{sending ? "Sending Note..." : "Send Message"}</span>
                  </button>
                </form>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox Modal for Fullscreen Image Zoom */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-neutral-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="relative max-h-[70vh] overflow-hidden flex items-center justify-center bg-black">
              <SafeImage
                src={activeLightboxImage.src}
                alt={activeLightboxImage.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-neutral-900 text-white space-y-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-bold">{activeLightboxImage.title}</h3>
                {activeLightboxImage.externalUrl && (
                  <a
                    href={activeLightboxImage.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
                  >
                    <span>View Link</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
              {activeLightboxImage.description && (
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {activeLightboxImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
