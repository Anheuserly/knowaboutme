"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { X, Copy, Check, Download, Share2, QrCode } from "lucide-react";
import type { PublicProfile } from "@/types/profile";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PublicProfile;
}

export function ShareModal({ isOpen, onClose, profile }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const profileUrl = typeof window !== "undefined"
    ? `${window.location.origin}/@${profile.username}`
    : `https://knowaboutme.com/@${profile.username}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(profileUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: "#09090b",
          light: "#ffffff",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Code error:", err));
    }
  }, [isOpen, profileUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.display_name} | KnowAboutMe`,
          text: profile.headline || `Check out ${profile.display_name}'s identity profile.`,
          url: profileUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopy();
    }
  };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${profile.display_name};;;;
FN:${profile.display_name}
TITLE:${profile.headline || ""}
URL:${profile.website_url || profileUrl}
NOTE:${profile.short_bio || ""}
X-KNOWABOUTME-USERNAME:${profile.username}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${profile.username}-contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-3">
            <Share2 size={22} />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
            Share Identity Profile
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Connect anyone to your story with a single shareable link or scan.
          </p>
        </div>

        {/* QR Code */}
        {qrDataUrl && (
          <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950/60 rounded-xl border border-neutral-200 dark:border-neutral-800/80 mb-5">
            <img
              src={qrDataUrl}
              alt={`${profile.display_name} QR Code`}
              className="w-44 h-44 rounded-lg bg-white p-2 shadow-sm"
            />
            <div className="flex gap-2 mt-3">
              <a
                href={qrDataUrl}
                download={`${profile.username}-qr-code.png`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-neutral-400 transition-colors shadow-sm"
              >
                <Download size={14} />
                <span>Save QR Image</span>
              </a>
              <button
                onClick={downloadVCard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:border-indigo-400 transition-colors"
              >
                <Download size={14} />
                <span>vCard Contact</span>
              </button>
            </div>
          </div>
        )}

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <input
            type="text"
            readOnly
            value={profileUrl}
            className="flex-1 bg-transparent px-3 text-xs text-neutral-700 dark:text-neutral-300 font-mono focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Native share option if supported */}
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Share2 size={15} />
            <span>Share via Apps &amp; Messages</span>
          </button>
        </div>
      </div>
    </div>
  );
}
