"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Archive,
  Trash2,
  Reply,
  CheckCircle2,
  Clock,
  Inbox,
  Filter,
} from "lucide-react";

interface MessageItem {
  id: string;
  sender_name: string | null;
  sender_email: string | null;
  subject: string | null;
  message: string;
  status: "new" | "read" | "archived" | "spam";
  created_at: string;
}

export default function MessagesInboxPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "archived">("all");
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);

  const loadMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const json = await res.json();
      if (json.success && json.messages) {
        setMessages(json.messages);
        if (json.messages.length > 0 && !selectedMessage) {
          setSelectedMessage(json.messages[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: "read" | "archived" | "new") => {
    try {
      const res = await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this message?")) return;

    try {
      const res = await fetch(`/api/messages?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          const remaining = messages.filter((m) => m.id !== id);
          setSelectedMessage(remaining.length > 0 ? remaining[0] : null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === "new") return m.status === "new";
    if (filter === "archived") return m.status === "archived";
    return true;
  });

  return (
    <div className="max-w-6xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Mail className="text-indigo-600" size={24} />
            <span>Inquiries & Messages</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Direct communications sent to you via your verified public contact form.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === "all"
                ? "bg-indigo-600 text-white"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter("new")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === "new"
                ? "bg-indigo-600 text-white"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            }`}
          >
            New ({messages.filter((m) => m.status === "new").length})
          </button>
          <button
            onClick={() => setFilter("archived")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === "archived"
                ? "bg-indigo-600 text-white"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            }`}
          >
            Archived ({messages.filter((m) => m.status === "archived").length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-16 text-center text-neutral-400">
          <Inbox size={40} className="mx-auto mb-3 opacity-40 text-indigo-500" />
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Your inbox is empty
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            When visitors use the contact form on your public profile, inquiries will appear here safely without exposing your private email.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
          {/* List column */}
          <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800">
            {filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              const isNew = msg.status === "new";

              return (
                <button
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (isNew) handleUpdateStatus(msg.id, "read");
                  }}
                  className={`w-full text-left p-4 transition-colors block ${
                    isSelected
                      ? "bg-indigo-50/60 dark:bg-indigo-950/40"
                      : "hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                        {msg.sender_name || "Anonymous Visitor"}
                      </span>
                      {isNew && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate mb-1">
                    {msg.subject || "(No subject)"}
                  </p>

                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Details Preview column */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            {selectedMessage ? (
              <div className="space-y-6">
                {/* Header info */}
                <div className="border-b border-neutral-100 dark:border-neutral-800 pb-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                        {selectedMessage.subject || "Message from Public Profile"}
                      </h2>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedMessage.sender_name || "Anonymous"}
                        </span>
                        <span>•</span>
                        <span className="font-mono">{selectedMessage.sender_email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {selectedMessage.sender_email && (
                        <a
                          href={`mailto:${selectedMessage.sender_email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "Inquiry")}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                        >
                          <Reply size={13} />
                          <span>Reply</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(
                            selectedMessage.id,
                            selectedMessage.status === "archived" ? "read" : "archived"
                          )
                        }
                        className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        title="Archive message"
                      >
                        <Archive size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(selectedMessage.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Delete message"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-3 font-mono">
                    <Clock size={12} />
                    <span>
                      Received on {new Date(selectedMessage.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Message body */}
                <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-neutral-400">
                <p className="text-xs">Select a message from the list to view its contents.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
