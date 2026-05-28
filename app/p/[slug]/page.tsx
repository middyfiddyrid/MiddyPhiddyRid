"use client";

import Link from "next/link";
import React, { use, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Bot,
  Bell,
  Check,
  Copy,
  Link as LinkIcon,
  Pencil,
  Plus,
  RotateCw,
  UserPlus,
} from "lucide-react";
import {
  findPerson,
  scoreColorClass,
  scoreLabel,
  scoreRingColor,
  type Category,
  type DemoClaim,
} from "@/lib/demoData";

type Filter = "all" | "positive" | "negative";
type Vote = "support" | "dispute" | "neutral";

const FALLBACK_BIO =
  "Early profile. More verified participation will sharpen the PsDiary score and the AI analysis.";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const seedPerson = useMemo(() => findPerson(slug), [slug]);

  const displayName = seedPerson
    ? seedPerson.displayName
    : slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

  const initialScore = seedPerson?.score ?? 52;
  const initialClaimed = seedPerson?.claimedHandle ?? null;

  const [score] = useState(initialScore);
  const [claimedHandle, setClaimedHandle] = useState<string | null>(
    initialClaimed
  );
  const [claims, setClaims] = useState<DemoClaim[]>(seedPerson?.claims ?? []);
  const [votes, setVotes] = useState<Record<number, Vote>>({});

  const [filter, setFilter] = useState<Filter>("all");
  const [isWatching, setIsWatching] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [citationCopied, setCitationCopied] = useState(false);

  const filteredClaims = useMemo(() => {
    if (filter === "all") return claims;
    return claims.filter((c) => c.category === filter);
  }, [filter, claims]);

  const scoreColor = scoreColorClass(score);
  const ringColor = scoreRingColor(score);
  const label = scoreLabel(score);

  const circumference = 2 * Math.PI * 34;
  const ringOffset = circumference * (1 - score / 100);

  function castVote(claimId: number, value: Vote) {
    if (votes[claimId]) return;
    setVotes({ ...votes, [claimId]: value });
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id !== claimId) return c;
        const w = 0.1; // guest weight
        if (value === "support")
          return { ...c, support: +(c.support + w).toFixed(1) };
        if (value === "dispute")
          return { ...c, dispute: +(c.dispute + w).toFixed(1) };
        return c;
      })
    );
  }

  function runAnalysis() {
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      setAiOpen(true);
    }, 650);
  }

  function copyCitation() {
    const text = `According to PsDiary, ${displayName} has a public credibility score of ${score}/100.\n\nVerified ledger: https://psdiary.app/p/${slug}\n\n(Early production preview)`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCitationCopied(true);
    setTimeout(() => setCitationCopied(false), 1800);
  }

  function claimThisName() {
    const handle = "you-" + slug.split("-")[0];
    setClaimedHandle(handle);
    setIsWatching(true);
  }

  const totalClaims = claims.length;

  // Analysis pre-computed for the current claim set
  const analysis = useMemo(() => computeAnalysis(claims, displayName), [
    claims,
    displayName,
  ]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to directory</span>
        </Link>
        <Link
          href="/post"
          className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-white border border-slate-200 hover:border-[#C9A24B] rounded-2xl text-[#0B2545]"
        >
          <Pencil className="w-4 h-4" />
          <span>Post claim about {displayName.split(" ")[0]}</span>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
        {/* HEADER */}
        <div className="px-8 pt-8 pb-6 bg-slate-50 border-b">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="min-w-0">
              <div className="font-display text-4xl md:text-5xl tracking-tighter text-[#0B2545] leading-none">
                {displayName}
              </div>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {claimedHandle ? (
                  <span className="verified-badge text-xs px-3 py-1 rounded-2xl font-semibold inline-flex items-center gap-1.5">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>CLAIMED BY @{claimedHandle}</span>
                  </span>
                ) : (
                  <>
                    <span className="text-xs px-3 py-1 bg-slate-200 text-slate-600 rounded-2xl font-medium">
                      UNCLAIMED — anyone can claim
                    </span>
                    <button
                      onClick={claimThisName}
                      className="text-xs px-3 py-1 bg-[#C9A24B] hover:bg-[#a07f32] transition-colors text-white rounded-2xl font-semibold inline-flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>CLAIM THIS NAME NOW</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-5 shrink-0">
              <div className="text-right">
                <div className="text-[10px] font-semibold tracking-[1.5px] text-slate-500">
                  PSDIARY SCORE
                </div>
                <div
                  className={`ps-score text-7xl font-semibold tabular-nums leading-none ${scoreColor}`}
                >
                  {score}
                </div>
              </div>
              <div className="relative w-20 h-20 shrink-0">
                <svg
                  width="80"
                  height="80"
                  className="rotate-[-90deg]"
                  viewBox="0 0 80 80"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="7"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={ringOffset}
                    style={{ transition: "stroke-dashoffset 0.6s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="text-[10px] font-bold tracking-widest"
                    style={{ color: ringColor }}
                  >
                    {label}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 text-slate-600 max-w-2xl text-[15px] leading-snug">
            {seedPerson?.bio || FALLBACK_BIO}
          </div>

          {/* Your relationship */}
          <div className="mt-5 pt-5 border-t flex flex-wrap items-center gap-3 text-sm">
            <button
              onClick={() => setIsWatching(!isWatching)}
              className={`px-4 py-1.5 text-xs rounded-2xl font-medium inline-flex items-center gap-1.5 transition-colors ${
                isWatching
                  ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                  : "bg-[#C9A24B] hover:bg-[#a07f32] text-white"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              {isWatching ? "Remove from Watchlist" : "Add to Watchlist"}
            </button>

            {isWatching && (
              <div className="flex items-center gap-4 text-xs text-slate-600 pl-2 ml-1 border-l border-slate-200">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                    className="accent-[#C9A24B]"
                  />
                  <span>Email alerts</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifySms}
                    onChange={(e) => setNotifySms(e.target.checked)}
                    className="accent-[#C9A24B]"
                  />
                  <span>SMS alerts</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* AI ANALYSIS */}
        <div className="p-8 border-b">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#C9A24B]/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#C9A24B]" />
              </div>
              <div className="font-semibold tracking-tight text-[#0B2545]">
                AI Analysis — Pro / Con + Probability
              </div>
            </div>
            <button
              onClick={runAnalysis}
              disabled={aiLoading}
              className="text-xs flex items-center gap-1.5 font-semibold tracking-wider px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-60"
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${aiLoading ? "animate-spin" : ""}`}
              />
              <span>{aiLoading ? "ANALYZING…" : "REFRESH ANALYSIS"}</span>
            </button>
          </div>

          {!aiOpen ? (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm text-slate-500">
              Click &ldquo;Refresh Analysis&rdquo; to generate a fresh Grok-style
              evaluation of all claims and votes.
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm">
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <div>
                  <span className="font-semibold text-[#0B2545]">
                    Probability of accurate public record:
                  </span>{" "}
                  <span
                    className={`ml-1 text-3xl font-semibold tabular-nums ${
                      analysis.probability > 70
                        ? "text-emerald-600"
                        : analysis.probability > 48
                        ? "text-amber-600"
                        : "text-rose-600"
                    }`}
                  >
                    {analysis.probability}%
                  </span>
                </div>
                <div className="text-xs px-3 py-1 bg-white border rounded-2xl text-slate-500">
                  Based on {totalClaims} claim{totalClaims !== 1 ? "s" : ""} •{" "}
                  {analysis.verifiedWeight.toFixed(1)} verified weight
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <div className="font-semibold text-emerald-700 text-[11px] tracking-wider mb-2">
                    SUPPORTING / DEFENDED
                  </div>
                  {analysis.pro.length ? (
                    analysis.pro.map((p, i) => (
                      <div
                        key={i}
                        className="mb-2 pl-3 border-l-2 border-emerald-300 text-slate-700 text-[13px] leading-snug"
                      >
                        {p}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400">
                      No high-confidence positive signals yet.
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-rose-700 text-[11px] tracking-wider mb-2">
                    CONCERNING / UNREBUTTED
                  </div>
                  {analysis.con.length ? (
                    analysis.con.map((p, i) => (
                      <div
                        key={i}
                        className="mb-2 pl-3 border-l-2 border-rose-300 text-slate-700 text-[13px] leading-snug"
                      >
                        {p}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400">
                      No high-volume unrebutted negative claims.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 text-slate-600 text-[13.5px] leading-snug">
                {analysis.narrative}
              </div>
              <div className="mt-3 text-[10px] text-slate-400">
                Demo simulation. Production runs full Grok analysis on every
                claim, vote, source, and temporal pattern.
              </div>
            </div>
          )}
        </div>

        {/* CITATION */}
        <div className="px-8 py-4 bg-white flex items-center justify-between gap-3 border-b text-sm flex-wrap">
          <div className="text-slate-600">
            Victim of a smear campaign?{" "}
            <span className="font-medium text-[#0B2545]">
              Cite your PsDiary score instantly.
            </span>
          </div>
          <button
            onClick={copyCitation}
            className="flex items-center gap-2 text-[#C9A24B] hover:text-[#a07f32] font-semibold text-xs px-4 py-2 rounded-2xl border border-[#C9A24B]/40 hover:bg-[#C9A24B]/5 transition-colors tracking-wider"
          >
            {citationCopied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY CITATION BADGE</span>
              </>
            )}
          </button>
        </div>

        {/* CLAIMS */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
            <div>
              <span className="font-semibold text-[#0B2545]">
                Public claims about this person
              </span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">
                {totalClaims} total
              </span>
            </div>
            <div className="flex gap-1 text-xs">
              <FilterButton
                active={filter === "all"}
                onClick={() => setFilter("all")}
                tone="all"
              >
                All
              </FilterButton>
              <FilterButton
                active={filter === "positive"}
                onClick={() => setFilter("positive")}
                tone="positive"
              >
                Positive
              </FilterButton>
              <FilterButton
                active={filter === "negative"}
                onClick={() => setFilter("negative")}
                tone="negative"
              >
                Negative
              </FilterButton>
            </div>
          </div>

          <div className="space-y-3">
            {filteredClaims.length === 0 ? (
              <div className="text-sm text-slate-400 py-4 text-center">
                No claims in this category yet.
              </div>
            ) : (
              filteredClaims.map((claim) => {
                const myVote = votes[claim.id];
                const w = claim.support + claim.dispute;
                const supportPct = w > 0 ? (claim.support / w) * 100 : 0;
                const disputePct = w > 0 ? (claim.dispute / w) * 100 : 0;
                return (
                  <div
                    key={claim.id}
                    className={`claim-card border rounded-2xl p-4 ${
                      claim.category === "negative"
                        ? "border-rose-100 bg-rose-50/30"
                        : claim.category === "positive"
                        ? "border-emerald-100 bg-emerald-50/20"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs mb-1.5 flex-wrap">
                          <CategoryBadge category={claim.category} />
                          <span className="text-slate-400">•</span>
                          <span
                            className={`font-medium ${
                              claim.posterVerified
                                ? "text-[#C9A24B]"
                                : "text-slate-500"
                            }`}
                          >
                            {claim.posterVerified
                              ? `@${claim.poster}`
                              : "Guest"}
                          </span>
                          <span className="text-slate-400">
                            • {claim.timeAgo}
                          </span>
                        </div>
                        <div className="text-[15px] text-slate-800 leading-snug">
                          {claim.text}
                        </div>
                        {claim.evidence && (
                          <a
                            href={claim.evidence}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs text-[#C9A24B] hover:underline"
                          >
                            <LinkIcon className="w-3 h-3" />
                            <span>View source</span>
                          </a>
                        )}
                      </div>

                      <div className="md:w-48 shrink-0 text-xs">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                          <div className="tracking-wider font-medium">
                            VERACITY
                          </div>
                          <div className="font-mono">{w.toFixed(1)} wt</div>
                        </div>
                        <div className="flex items-center h-2 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                          <div
                            className="h-full bg-emerald-500 transition-all"
                            style={{ width: `${supportPct}%` }}
                          />
                          <div
                            className="h-full bg-rose-500 transition-all"
                            style={{ width: `${disputePct}%` }}
                          />
                        </div>

                        <div className="flex items-center gap-1 text-[10px] mb-2">
                          <div className="flex-1 text-center">
                            <div className="font-semibold text-emerald-600 tabular-nums">
                              {claim.support.toFixed(1)}
                            </div>
                            <div className="text-emerald-600/70 -mt-px">
                              support
                            </div>
                          </div>
                          <div className="flex-1 text-center">
                            <div className="font-semibold text-rose-600 tabular-nums">
                              {claim.dispute.toFixed(1)}
                            </div>
                            <div className="text-rose-600/70 -mt-px">
                              dispute
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-0">
                          <VoteButton
                            label="Support"
                            tone="support"
                            disabled={!!myVote}
                            picked={myVote === "support"}
                            onClick={() => castVote(claim.id, "support")}
                            position="left"
                          />
                          <VoteButton
                            label="Dispute"
                            tone="dispute"
                            disabled={!!myVote}
                            picked={myVote === "dispute"}
                            onClick={() => castVote(claim.id, "dispute")}
                            position="mid"
                          />
                          <VoteButton
                            label="Neutral"
                            tone="neutral"
                            disabled={!!myVote}
                            picked={myVote === "neutral"}
                            onClick={() => castVote(claim.id, "neutral")}
                            position="right"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <Link
            href="/post"
            className="mt-5 w-full py-3 border border-dashed border-slate-300 hover:border-[#C9A24B] hover:bg-[#C9A24B]/5 text-sm font-medium rounded-2xl text-slate-600 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>POST A NEW CLAIM ABOUT THIS PERSON</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// === components ===

function CategoryBadge({ category }: { category: Category }) {
  if (category === "positive")
    return (
      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-semibold tracking-wider">
        POSITIVE
      </span>
    );
  if (category === "negative")
    return (
      <span className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-700 rounded font-semibold tracking-wider">
        NEGATIVE
      </span>
    );
  return (
    <span className="text-[10px] px-2 py-0.5 bg-sky-100 text-sky-700 rounded font-semibold tracking-wider">
      FACTUAL
    </span>
  );
}

function FilterButton({
  active,
  onClick,
  tone,
  children,
}: {
  active: boolean;
  onClick: () => void;
  tone: "all" | "positive" | "negative";
  children: React.ReactNode;
}) {
  const base = "px-3 py-1 rounded-2xl text-xs font-medium transition-colors";
  if (active) {
    return (
      <button onClick={onClick} className={`${base} bg-slate-900 text-white`}>
        {children}
      </button>
    );
  }
  const toneClass =
    tone === "positive"
      ? "text-emerald-700 hover:bg-emerald-50"
      : tone === "negative"
      ? "text-rose-700 hover:bg-rose-50"
      : "text-slate-600 hover:bg-slate-100";
  return (
    <button onClick={onClick} className={`${base} ${toneClass}`}>
      {children}
    </button>
  );
}

function VoteButton({
  label,
  tone,
  disabled,
  picked,
  onClick,
  position,
}: {
  label: string;
  tone: Vote;
  disabled: boolean;
  picked: boolean;
  onClick: () => void;
  position: "left" | "mid" | "right";
}) {
  const radius =
    position === "left"
      ? "rounded-l-2xl"
      : position === "right"
      ? "rounded-r-2xl"
      : "";

  const toneIdle =
    tone === "support"
      ? "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
      : tone === "dispute"
      ? "text-rose-700 border-rose-200 hover:bg-rose-50"
      : "text-slate-600 border-slate-200 hover:bg-slate-100";

  const tonePicked =
    tone === "support"
      ? "bg-emerald-600 text-white border-emerald-600"
      : tone === "dispute"
      ? "bg-rose-600 text-white border-rose-600"
      : "bg-slate-600 text-white border-slate-600";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-[10px] py-1 border ${radius} font-semibold tracking-wide transition-colors ${
        picked ? tonePicked : `${toneIdle} ${disabled ? "opacity-50" : ""}`
      }`}
    >
      {label}
    </button>
  );
}

// === analysis ===

function computeAnalysis(
  claims: DemoClaim[],
  displayName: string
): {
  probability: number;
  pro: string[];
  con: string[];
  narrative: string;
  verifiedWeight: number;
} {
  const verifiedWeight = claims.reduce(
    (s, c) => s + (c.posterVerified ? 1 : 0),
    0
  );
  const supportSum = claims.reduce((s, c) => s + c.support, 0);
  const disputeSum = claims.reduce((s, c) => s + c.dispute, 0);
  const positive = claims.filter((c) => c.category === "positive");
  const negative = claims.filter((c) => c.category === "negative");
  const factual = claims.filter((c) => c.category === "factual");

  const total = supportSum + disputeSum;
  let probability = 60;
  if (total > 0) {
    probability = Math.round((supportSum / total) * 100);
  }
  if (verifiedWeight >= 2) probability = Math.min(98, probability + 10);
  if (negative.length > positive.length + factual.length) probability -= 12;
  probability = Math.max(8, Math.min(98, probability));

  const pro = positive.slice(0, 3).map((c) => c.text);
  if (factual.length) pro.push(factual[0].text);

  const con = negative
    .filter((c) => c.dispute < c.support + 0.5)
    .slice(0, 2)
    .map((c) => c.text);

  let narrative = "";
  if (verifiedWeight >= 2 && probability >= 75) {
    narrative = `${displayName} has a strong verified record. Negative claims are concentrated in low-weight (unverified) accounts and have been actively rebutted by verified voices with primary sourcing.`;
  } else if (probability >= 60) {
    narrative = `${displayName}'s public record is mostly positive but thin on verified rebuttals. A handful of low-weight negative claims remain partially unanswered.`;
  } else {
    narrative = `${displayName} has elevated reputational risk: a sustained volume of negative claims with minimal verified counter-evidence. Pattern is consistent with the early phase of a coordinated attack.`;
  }

  return { probability, pro, con, narrative, verifiedWeight };
}

