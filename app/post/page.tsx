"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

type Category = "positive" | "negative" | "factual";

export default function PostClaimPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    text: "",
    category: "negative" as Category,
    evidence: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ subject: "", text: "", category: "negative", evidence: "" });
      alert(
        "Claim submitted! (Demo mode — in production this saves to the database and triggers email/SMS notifications.)"
      );
    }, 700);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to directory</span>
      </Link>

      <div className="mb-6">
        <div className="section-header text-[#C9A24B]">Ledger</div>
        <h1 className="font-display text-4xl tracking-tighter text-[#0B2545]">
          Post a public claim
        </h1>
        <p className="text-slate-600 mt-2">
          Good or bad. The record is transparent. Verified voices carry full
          weight.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="section-header text-slate-500 block mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder="Full name or handle (e.g. Marcus Thompson)"
              required
              className="w-full border border-slate-200 focus:border-[#C9A24B] transition-colors rounded-2xl px-4 py-3 text-base"
            />
          </div>

          <div>
            <label className="section-header text-slate-500 block mb-1.5">
              Your claim
            </label>
            <textarea
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              placeholder="State the specific claim clearly. Include dates, sources, or context where possible."
              rows={5}
              required
              className="w-full border border-slate-200 focus:border-[#C9A24B] transition-colors rounded-2xl px-4 py-3 text-base resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="section-header text-slate-500 block mb-1.5">
                Category
              </label>
              <div className="flex gap-2">
                <CategoryPill
                  label="Positive / Defense"
                  active={formData.category === "positive"}
                  activeClass="bg-emerald-50 border-emerald-300 text-emerald-800"
                  onClick={() =>
                    setFormData({ ...formData, category: "positive" })
                  }
                />
                <CategoryPill
                  label="Negative / Criticism"
                  active={formData.category === "negative"}
                  activeClass="bg-rose-50 border-rose-300 text-rose-800"
                  onClick={() =>
                    setFormData({ ...formData, category: "negative" })
                  }
                />
                <CategoryPill
                  label="Factual Statement"
                  active={formData.category === "factual"}
                  activeClass="bg-sky-50 border-sky-300 text-sky-800"
                  onClick={() =>
                    setFormData({ ...formData, category: "factual" })
                  }
                />
              </div>
            </div>

            <div>
              <label className="section-header text-slate-500 block mb-1.5">
                Evidence (optional)
              </label>
              <input
                type="url"
                value={formData.evidence}
                onChange={(e) =>
                  setFormData({ ...formData, evidence: e.target.value })
                }
                placeholder="https://link-to-source.com/article"
                className="w-full border border-slate-200 focus:border-[#C9A24B] transition-colors rounded-2xl px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div className="text-xs px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 flex gap-2 items-start">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              You are posting as <span className="font-semibold">Guest</span>.
              This claim will be visible but your votes carry{" "}
              <span className="font-bold">0.1× weight</span> until you claim a
              name.
            </div>
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="w-full mt-2 bg-[#0B2545] hover:bg-[#132c52] disabled:opacity-70 transition-all active:scale-[0.985] text-white font-semibold py-3.5 rounded-2xl text-sm tracking-wide"
          >
            {submitted ? "SUBMITTING TO LEDGER…" : "PUBLISH TO PUBLIC LEDGER"}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-slate-500 mt-6">
        In production this saves to the database and automatically notifies
        anyone watching or claiming this name.
      </p>
    </div>
  );
}

function CategoryPill({
  label,
  active,
  activeClass,
  onClick,
}: {
  label: string;
  active: boolean;
  activeClass: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 border rounded-2xl py-2 px-2 text-center text-[12px] font-medium transition-all leading-tight ${
        active
          ? activeClass
          : "border-slate-200 text-slate-700 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}
