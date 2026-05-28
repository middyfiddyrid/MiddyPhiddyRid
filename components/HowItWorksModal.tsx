"use client";

import { useEffect } from "react";
import { X, BookOpen } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const POINTS = [
  {
    title: "Claim your name.",
    body: "Anyone can register a public identity. Once claimed, only that verified actor (or their proxies) votes at full weight on statements made about them.",
  },
  {
    title: "Anyone can post anything.",
    body: "Good, bad, or factual claims about any person or organization. The ledger is transparent and append-only in spirit.",
  },
  {
    title: "Weight is everything.",
    body: "Like quality signals on major platforms, unverified accounts cast votes at 0.1× strength. Verified (claimed-name) participants vote at full strength. This dramatically raises the cost of smear campaigns.",
  },
  {
    title: "AI adjudication.",
    body: "Any profile can request a full pro/con analysis + probability assessment. The model weighs verified vs unverified volume, sourcing patterns, rebuttal success, and temporal clustering to surface coordinated attacks.",
  },
  {
    title: "Instant citation.",
    body: "Victims of online attacks can immediately point to their PsDiary score and the underlying AI-backed analysis as a public, defensible reference.",
  },
];

export function HowItWorksModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white max-w-2xl w-full rounded-3xl p-8 shadow-2xl text-sm leading-relaxed max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-[#C9A24B]/10 text-[#C9A24B] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="font-display text-2xl tracking-tight text-[#0B2545]">
            How PsDiary works
          </div>
        </div>

        <div className="space-y-5 text-slate-600">
          {POINTS.map((p, i) => (
            <div key={i}>
              <span className="font-semibold text-[#0B2545]">
                {i + 1}. {p.title}
              </span>{" "}
              {p.body}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t text-xs text-slate-400">
          This is the early production preview. The full version adds cryptographic identity, persistent storage, Grok/xAI-powered deep analysis, moderation tooling, and exportable signed attestations.
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-[#0B2545] hover:bg-[#132c52] transition-colors text-white rounded-2xl text-sm font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
}
