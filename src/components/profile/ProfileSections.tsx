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
} from "lucide-react";
import { SocialIcon } from "@/components/profile/SocialIcon";
import type { PublicProfile } from "@/types/profile";
import type { ThemeConfig } from "@/lib/themes";
import { formatDate } from "@/lib/utils";

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
    } catch (err: any) {
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-12 py-8 max-w-4xl mx-auto px-4 sm:px-8">
      {/* 1. ABOUT & BIOGRAPHY */}
      {(profile.short_bio || profile.long_bio) && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <Sparkles size={16} className="text-indigo-500" />
            <span>Biography &amp; Story</span>
          </div>

          <div className={`${theme.cardClass} rounded-2xl p-6 sm:p-8 space-y-4`}>
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

      {/* 2. EXPERIENCE */}
      {profile.experiences && profile.experiences.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <Briefcase size={16} className="text-indigo-500" />
            <span>Professional Journey &amp; Experience</span>
          </div>

          <div className="space-y-4">
            {profile.experiences.map((exp) => (
              <div
                key={exp.id}
                className={`${theme.cardClass} rounded-2xl p-6 transition-all hover:translate-y-[-2px]`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {exp.position}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      {exp.company_url ? (
                        <a
                          href={exp.company_url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1"
                        >
                          <span>{exp.company_name}</span>
                          <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span>{exp.company_name}</span>
                      )}
                      {exp.location && <span>&bull; {exp.location}</span>}
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 w-fit mt-1 sm:mt-0">
                    {formatDate(exp.start_date)} &mdash;{" "}
                    {exp.is_current ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Present</span>
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

      {/* 3. PROJECTS */}
      {profile.projects && profile.projects.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <FolderGit2 size={16} className="text-indigo-500" />
            <span>Featured Projects</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {profile.projects.map((proj) => {
              let techList: string[] = [];
              if (Array.isArray(proj.technologies)) {
                techList = proj.technologies;
              } else if (typeof proj.technologies === "string") {
                try {
                  const parsed = JSON.parse(proj.technologies);
                  if (Array.isArray(parsed)) techList = parsed;
                  else techList = proj.technologies.split(",").map((s: string) => s.trim()).filter(Boolean);
                } catch {
                  techList = proj.technologies.split(",").map((s: string) => s.trim()).filter(Boolean);
                }
              }

              return (
                <div
                  key={proj.id}
                  className={`${theme.cardClass} rounded-2xl overflow-hidden flex flex-col group transition-all hover:shadow-xl`}
                >
                  {proj.cover_image_url && (
                    <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src={proj.cover_image_url}
                        alt={proj.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                        {proj.name}
                      </h4>
                      {proj.role && (
                        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {proj.role}
                        </p>
                      )}
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
                              className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                        {proj.project_url && (
                          <a
                            href={proj.project_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            <span>Live Demo</span>
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
                            <span>Source</span>
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

      {/* 4. SKILLS */}
      {profile.skills && profile.skills.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <Sparkles size={16} className="text-indigo-500" />
            <span>Skills &amp; Competencies</span>
          </div>

          <div className={`${theme.cardClass} rounded-2xl p-6 sm:p-7`}>
            <div className="flex flex-wrap gap-2.5">
              {profile.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 text-xs font-medium text-neutral-800 dark:text-neutral-200 shadow-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>{skill.name}</span>
                  {skill.years_experience && (
                    <span className="text-[10px] text-neutral-400">
                      ({skill.years_experience}y)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. ARTWORK & CREATIVE WORKS */}
      {profile.artwork && profile.artwork.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <Palette size={16} className="text-indigo-500" />
            <span>Artwork &amp; Visual Explorations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {profile.artwork.map((art) => (
              <div
                key={art.id}
                className={`${theme.cardClass} rounded-2xl overflow-hidden group flex flex-col`}
              >
                {art.image_url && (
                  <div className="aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={art.image_url}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {art.title}
                    </h4>
                    {art.category && (
                      <span className="text-[11px] text-neutral-400">{art.category}</span>
                    )}
                    {art.description && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2 line-clamp-2">
                        {art.description}
                      </p>
                    )}
                  </div>
                  {art.license && (
                    <div className="text-[10px] text-neutral-400 mt-2">
                      {art.license}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. EDUCATION */}
      {profile.education && profile.education.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <GraduationCap size={16} className="text-indigo-500" />
            <span>Education &amp; Credentials</span>
          </div>

          <div className="space-y-3">
            {profile.education.map((edu) => (
              <div key={edu.id} className={`${theme.cardClass} rounded-2xl p-5`}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {edu.degree || "Degree"} &bull; {edu.field_of_study}
                    </h4>
                    <p className="text-xs text-neutral-500 font-medium">
                      {edu.institution_name} {edu.location && `(${edu.location})`}
                    </p>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {formatDate(edu.start_date)} &mdash; {formatDate(edu.end_date)}
                  </span>
                </div>
                {edu.grade && (
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-2">
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

      {/* 7. ACHIEVEMENTS */}
      {profile.achievements && profile.achievements.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <Trophy size={16} className="text-indigo-500" />
            <span>Honors &amp; Achievements</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.achievements.map((ach) => (
              <div key={ach.id} className={`${theme.cardClass} rounded-xl p-4 flex gap-3.5`}>
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 shrink-0 h-fit">
                  <Trophy size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {ach.title}
                  </h5>
                  {ach.organization && (
                    <p className="text-[11px] text-neutral-500 mt-0.5">{ach.organization}</p>
                  )}
                  {ach.description && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                      {ach.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. TIMELINE */}
      {profile.timeline_events && profile.timeline_events.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <Clock size={16} className="text-indigo-500" />
            <span>Milestones &amp; Journey</span>
          </div>

          <div className={`${theme.cardClass} rounded-2xl p-6 sm:p-8 space-y-6 relative`}>
            {profile.timeline_events.map((ev, idx) => (
              <div key={ev.id} className="relative flex gap-4 pl-2">
                <div className="flex flex-col items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-950" />
                  {idx !== profile.timeline_events.length - 1 && (
                    <span className="w-0.5 flex-1 bg-neutral-200 dark:bg-neutral-800 my-1" />
                  )}
                </div>
                <div className="pb-4">
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {formatDate(ev.event_date)}
                  </span>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                    {ev.title}
                  </h4>
                  {ev.description && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                      {ev.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. TESTIMONIALS */}
      {profile.testimonials && profile.testimonials.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <Quote size={16} className="text-indigo-500" />
            <span>Testimonials &amp; Endorsements</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.testimonials.map((test) => (
              <div
                key={test.id}
                className={`${theme.cardClass} rounded-2xl p-6 flex flex-col justify-between space-y-4`}
              >
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 italic leading-relaxed">
                  &ldquo;{test.message}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                  {test.photo_url && (
                    <img
                      src={test.photo_url}
                      alt={test.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
                    />
                  )}
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

      {/* 10. HOBBIES & INTERESTS */}
      {profile.hobbies && profile.hobbies.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <Heart size={16} className="text-indigo-500" />
            <span>Hobbies &amp; Personal Interests</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.hobbies.map((h) => (
              <div key={h.id} className={`${theme.cardClass} rounded-xl p-4 flex gap-3`}>
                <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 shrink-0 h-fit">
                  <Heart size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {h.name}
                  </h5>
                  {h.description && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                      {h.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 11. CONTACT MESSAGE SECTION */}
      {profile.settings?.allow_contact !== false && (
        <section ref={contactRef} className="space-y-4 pt-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <Mail size={16} className="text-indigo-500" />
            <span>Direct Concierge &amp; Inquiries</span>
          </div>

          <div className={`${theme.cardClass} rounded-2xl p-6 sm:p-8`}>
            {sentSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle size={24} />
                </div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Message Delivered
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                  Your message has been sent directly to {profile.display_name}&apos;s verified inbox.
                </p>
                <button
                  onClick={() => setSentSuccess(false)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline pt-2"
                >
                  Send another note
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Maya Chen"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="maya@example.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Inquire about collaborations, speaking opportunities, or just say hello..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md shadow-indigo-600/20"
                >
                  <Send size={14} />
                  <span>{sending ? "Delivering..." : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
