"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Pencil, Activity, BookOpen, UserCheck, ShieldCheck } from "lucide-react";
import { HowItWorksModal } from "@/components/HowItWorksModal";
import { DEMO_PEOPLE, scoreColorClass } from "@/lib/demoData";

type Tab = "discover" | "post" | "activity";
type Category = "positive" | "negative" | "factual";

export default function Home() {
  const [tab, setTab] = useState<Tab>("discover");
  const [search, setSearch] = useState("");
  const [howOpen, setHowOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [postCategory, setPostCategory] = useState<Category>("positive");
  const [postSubject, setPostSubject] = useState("");
  const [postText, setPostText] = useState("");
  const [postEvidence, setPostEvidence] = useState("");

  const filteredPeople = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return DEMO_PEOPLE;
    return DEMO_PEOPLE.filter(
      (p) =>
        p.displayName.toLowerCase().includes(q) ||
        p.slug.includes(q) ||
        p.bio.toLowerCase().includes(q)
    );
  }, [search]);

  const activityFeed = useMemo(() => {
    return DEMO_PEOPLE.flatMap((p) =>
      p.claims.map((c) => ({ ...c, person: p }))
    ).sort((a, b) => a.id < b.id ? 1 : -1).slice(0, 12);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setPostSubject("");
      setPostText("");
      setPostEvidence("");
      alert(
        "Claim submitted! (Demo mode — in production this writes to the ledger and triggers email/SMS to watchers.)"
      );
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-8 pb-24">
      {/* Hero */}
      <div className="flex items-end justify-between mb-8 gap-6">
        <div>
          <div className="section-header text-[#C9A24B] mb-1">
            Page 6 • Clearinghouse
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-[#0B2545] leading-[1.02]">
            Curate your name.
            <br />
            Own the record.
          </h1>
          <p className="mt-4 max-w-lg text-lg text-slate-600">
            The public ledger where verified individuals control the weight of
            claims made about them. AI-augmented. Immutable in intent.
          </p>
        </div>
        <button
          onClick={() => setHowOpen(true)}
          className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white hover:border-[#C9A24B]/50 text-sm font-medium transition-colors shrink-0"
        >
          <BookOpen className="w-4 h-4 text-[#C9A24B]" />
          <span>How it works</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 mb-8 overflow-x-auto">
        <TabButton
          active={tab === "discover"}
          onClick={() => setTab("discover")}
          icon={<Search className="w-4 h-4" />}
          label="Discover"
        />
        <TabButton
          active={tab === "post"}
          onClick={() => setTab("post")}
          icon={<Pencil className="w-4 h-4" />}
          label="Post a Claim"
        />
        <TabButton
          active={tab === "activity"}
          onClick={() => setTab("activity")}
          icon={<Activity className="w-4 h-4" />}
          label="Recent Activity"
        />
      </div>

      {/* DISCOVER */}
      {tab === "discover" && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search any name — Marcus Thompson, Elena Vazquez, or anyone..."
                className="w-full bg-white border border-slate-200 focus:border-[#C9A24B] transition-colors pl-11 pr-4 py-3 rounded-2xl text-base placeholder:text-slate-400"
              />
            </div>
            <Link
              href="/sign-in"
              className="shrink-0 inline-flex items-center gap-2 bg-[#0B2545] hover:bg-[#132c52] transition-colors text-white font-semibold px-6 py-3 rounded-2xl text-sm"
            >
              <UserCheck className="w-4 h-4" />
              <span>Claim Your Name</span>
            </Link>
          </div>

          {filteredPeople.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              No matches. Try posting the first claim about this person to
              create their page.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPeople.map((person) => {
                const scoreColor = scoreColorClass(person.score);
                const isClaimed = !!person.claimedHandle;
                return (
                  <Link
                    key={person.slug}
                    href={`/p/${person.slug}`}
                    className="claim-card block bg-white border border-slate-200 rounded-3xl p-5 hover:border-[#C9A24B]/60"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-lg tracking-tight truncate">
                          {person.displayName}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                          {isClaimed ? (
                            <span className="inline-block px-2 py-px bg-[#C9A24B]/10 text-[#C9A24B] rounded font-medium text-[10px] tracking-wider">
                              CLAIMED
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-px bg-slate-200 text-slate-500 rounded font-medium text-[10px] tracking-wider">
                              UNCLAIMED
                            </span>
                          )}
                          <span>
                            {person.claims.length} claim
                            {person.claims.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div
                          className={`text-4xl font-semibold tabular-nums ps-score ${scoreColor} leading-none`}
                        >
                          {person.score}
                        </div>
                        <div className="text-[9px] text-slate-400 mt-1 font-medium tracking-wider">
                          PSDIARY
                        </div>
                      </div>
                    </div>
                    {person.bio && (
                      <div className="text-xs text-slate-500 mt-4 line-clamp-2 leading-snug">
                        {person.bio}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-6 text-xs text-slate-500 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <div>Anyone can be added the moment the first claim is posted</div>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
        </div>
      )}

      {/* POST */}
      {tab === "post" && (
        <div className="max-w-2xl">
          <div className="bg-white border border-slate-200 rounded-3xl p-8">
            <div className="mb-6">
              <div className="font-semibold text-xl tracking-tight text-[#0B2545]">
                Post a public claim
              </div>
              <div className="text-slate-600 text-sm mt-1">
                Good or bad. The record is transparent. Verified voices carry
                full weight.
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="section-header text-slate-500 block mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={postSubject}
                  onChange={(e) => setPostSubject(e.target.value)}
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
                  rows={4}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="State the specific claim clearly. Include dates, sources, or context where possible."
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
                      active={postCategory === "positive"}
                      activeBg="bg-emerald-50 border-emerald-300 text-emerald-800"
                      onClick={() => setPostCategory("positive")}
                    />
                    <CategoryPill
                      label="Negative / Criticism"
                      active={postCategory === "negative"}
                      activeBg="bg-rose-50 border-rose-300 text-rose-800"
                      onClick={() => setPostCategory("negative")}
                    />
                    <CategoryPill
                      label="Factual Statement"
                      active={postCategory === "factual"}
                      activeBg="bg-sky-50 border-sky-300 text-sky-800"
                      onClick={() => setPostCategory("factual")}
                    />
                  </div>
                </div>

                <div>
                  <label className="section-header text-slate-500 block mb-1.5">
                    Evidence (optional)
                  </label>
                  <input
                    type="url"
                    value={postEvidence}
                    onChange={(e) => setPostEvidence(e.target.value)}
                    placeholder="https://link-to-source.com/article"
                    className="w-full border border-slate-200 focus:border-[#C9A24B] transition-colors rounded-2xl px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div className="text-xs px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 flex gap-2 items-start">
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  You are posting as <span className="font-semibold">Guest</span>.
                  This claim will be visible but your votes carry{" "}
                  <span className="font-bold">0.1× weight</span> until you claim
                  a name.
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
        </div>
      )}

      {/* ACTIVITY */}
      {tab === "activity" && (
        <div>
          <div className="mb-5 flex items-baseline justify-between">
            <div>
              <div className="font-semibold text-xl tracking-tight text-[#0B2545]">
                Recent public claims
              </div>
              <div className="text-sm text-slate-500">
                Chronological feed across all subjects
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {activityFeed.map((c) => (
              <Link
                key={`${c.person.slug}-${c.id}`}
                href={`/p/${c.person.slug}`}
                className="claim-card block bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#C9A24B]/60"
              >
                <div className="flex items-center gap-2 text-xs mb-2 flex-wrap">
                  <CategoryBadge category={c.category} />
                  <span className="text-slate-400">•</span>
                  <span
                    className={`font-medium ${
                      c.posterVerified ? "text-[#C9A24B]" : "text-slate-500"
                    }`}
                  >
                    {c.posterVerified ? `@${c.poster}` : "Guest"}
                  </span>
                  <span className="text-slate-400">• {c.timeAgo}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">
                    on{" "}
                    <span className="font-medium text-[#0B2545]">
                      {c.person.displayName}
                    </span>
                  </span>
                </div>
                <div className="text-[15px] text-slate-800 leading-snug">
                  {c.text}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <HowItWorksModal open={howOpen} onClose={() => setHowOpen(false)} />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 text-sm cursor-pointer flex items-center gap-2 whitespace-nowrap transition-colors ${
        active
          ? "border-b-[3px] border-[#C9A24B] text-[#0B2545] font-semibold -mb-px"
          : "border-b-[3px] border-transparent text-slate-500 hover:text-slate-700 font-medium"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function CategoryPill({
  label,
  active,
  activeBg,
  onClick,
}: {
  label: string;
  active: boolean;
  activeBg: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 border rounded-2xl py-2 px-2 text-center text-[12px] font-medium transition-all ${
        active
          ? activeBg
          : "border-slate-200 text-slate-700 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

function CategoryBadge({ category }: { category: Category }) {
  if (category === "positive")
    return (
      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-medium tracking-wider">
        POSITIVE
      </span>
    );
  if (category === "negative")
    return (
      <span className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-700 rounded font-medium tracking-wider">
        NEGATIVE
      </span>
    );
  return (
    <span className="text-[10px] px-2 py-0.5 bg-sky-100 text-sky-700 rounded font-medium tracking-wider">
      FACTUAL
    </span>
  );
}
