"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Gavel,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  UserSearch,
  Users,
  X,
} from "lucide-react";
import type { DemoClaim } from "@/lib/demoData";

type ModalKind = "sleuth" | "debate" | "gallery" | null;

interface Props {
  displayName: string;
  claims: DemoClaim[];
  /** Remove a claim and its supporting votes; bumps the score. */
  onStrikeClaim: (claimId: number) => void;
  /** Append a verified investigator rebuttal that adds context. */
  onAddContext: (targetClaimId: number) => void;
  /** Mark a private resolution as in progress (shows a pill on the profile). */
  onReserveGallery: (seats: number) => void;
}

export function RemediationCenter({
  displayName,
  claims,
  onStrikeClaim,
  onAddContext,
  onReserveGallery,
}: Props) {
  const [modal, setModal] = useState<ModalKind>(null);

  const negativeClaims = useMemo(
    () => claims.filter((c) => c.category === "negative"),
    [claims]
  );

  const close = () => setModal(null);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modal]);

  return (
    <>
      {negativeClaims.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-xl bg-[#C9A24B]/10 text-[#C9A24B] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="font-semibold text-lg tracking-tight text-[#0B2545]">
              Ways to Improve This Score
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            A low score isn&rsquo;t a verdict. Put real-world process behind your
            defense — investigate, challenge, or resolve.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ToolCard
              icon={<UserSearch className="w-5 h-5" />}
              title="Hire a Sleuth"
              body="A vetted investigator unearths exculpatory evidence and missing context, then files a verified rebuttal to the ledger."
              price="From $850"
              onClick={() => setModal("sleuth")}
            />
            <ToolCard
              icon={<Gavel className="w-5 h-5" />}
              title="Challenge to a Moderated Debate"
              body="Fund a neutral, recorded debate. If the claimant declines or no-shows, the claim — and every vote supporting it — is struck."
              price="From $1,200"
              highlight
              onClick={() => setModal("debate")}
            />
            <ToolCard
              icon={<Users className="w-5 h-5" />}
              title="Reserve a Deconfliction Gallery"
              body="Open a private room and hire as many humans as you like — mediators, fact-checkers, witnesses — to de-escalate the grievance."
              price="From $2,400"
              onClick={() => setModal("gallery")}
            />
          </div>
        </div>
      )}

      {modal === "sleuth" && (
        <SleuthModal
          displayName={displayName}
          negativeClaims={negativeClaims}
          onClose={close}
          onAddContext={onAddContext}
        />
      )}
      {modal === "debate" && (
        <DebateModal
          displayName={displayName}
          negativeClaims={negativeClaims}
          onClose={close}
          onStrikeClaim={onStrikeClaim}
        />
      )}
      {modal === "gallery" && (
        <GalleryModal onClose={close} onReserve={onReserveGallery} />
      )}
    </>
  );
}

/* ---------- shared bits ---------- */

function ToolCard({
  icon,
  title,
  body,
  price,
  highlight,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  price: string;
  highlight?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-2xl p-5 transition-all bg-white border ${
        highlight
          ? "border-[#C9A24B]/50 ring-1 ring-[#C9A24B]/20 hover:ring-[#C9A24B]/40"
          : "border-slate-200 hover:border-[#C9A24B]/60"
      }`}
    >
      <div className="w-9 h-9 rounded-xl bg-[#0B2545] text-[#C9A24B] flex items-center justify-center mb-3">
        {icon}
      </div>
      <div className="font-semibold text-[15px] text-[#0B2545] leading-tight">
        {title}
      </div>
      <div className="text-xs text-slate-500 mt-1.5 leading-snug">{body}</div>
      <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#C9A24B]">
        {price} <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </button>
  );
}

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="font-display text-2xl tracking-tight text-[#0B2545] pr-8">
          {title}
        </h3>
        {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

function ClaimPicker({
  negativeClaims,
  selectedId,
  onSelect,
}: {
  negativeClaims: DemoClaim[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold tracking-wider text-slate-500">
        WHICH CLAIM?
      </div>
      {negativeClaims.map((c) => {
        const active = c.id === selectedId;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full text-left rounded-2xl border p-3 transition-colors ${
              active
                ? "border-[#C9A24B] bg-[#C9A24B]/5"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start gap-2">
              <div
                className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  active ? "border-[#C9A24B] bg-[#C9A24B]" : "border-slate-300"
                }`}
              >
                {active && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] text-slate-800 leading-snug">
                  {c.text}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  by {c.posterVerified ? `@${c.poster}` : "Guest"} •{" "}
                  {c.support.toFixed(1)} support wt
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Sleuth ---------- */

function SleuthModal({
  displayName,
  negativeClaims,
  onClose,
  onAddContext,
}: {
  displayName: string;
  negativeClaims: DemoClaim[];
  onClose: () => void;
  onAddContext: (id: number) => void;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(
    negativeClaims[0]?.id ?? null
  );
  const [phase, setPhase] = useState<"select" | "working" | "done">("select");

  function engage() {
    if (selectedId == null) return;
    setPhase("working");
    setTimeout(() => {
      onAddContext(selectedId);
      setPhase("done");
    }, 1400);
  }

  return (
    <ModalShell
      title="Hire a Sleuth"
      subtitle={`A licensed investigator works ${displayName}'s case to surface exculpatory evidence and context.`}
      onClose={onClose}
    >
      {phase === "select" && (
        <>
          <ClaimPicker
            negativeClaims={negativeClaims}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <div className="mt-5 bg-slate-50 rounded-2xl p-4 text-sm">
            <div className="font-medium text-[#0B2545]">What you receive</div>
            <ul className="mt-2 space-y-1 text-slate-600 text-[13px] list-disc pl-5">
              <li>Written report within 7 business days</li>
              <li>A verified rebuttal filed directly to the ledger</li>
              <li>Primary sources attached and citable</li>
            </ul>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-slate-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={engage}
              disabled={selectedId == null}
              className="flex-1 py-3 rounded-2xl bg-[#0B2545] hover:bg-[#132c52] text-white font-semibold text-sm disabled:opacity-50"
            >
              Pay $850 &amp; Engage
            </button>
          </div>
          <p className="mt-3 text-[11px] text-slate-400 text-center">
            Demo — no real payment is processed.
          </p>
        </>
      )}

      {phase === "working" && (
        <div className="py-10 text-center">
          <Loader2 className="w-8 h-8 text-[#C9A24B] animate-spin mx-auto" />
          <div className="mt-4 font-medium text-[#0B2545]">
            Investigator working the case…
          </div>
          <div className="text-sm text-slate-500 mt-1">
            Pulling records, sources, and context.
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="py-4 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="mt-4 font-semibold text-[#0B2545]">
            Exculpatory context filed
          </div>
          <p className="text-sm text-slate-600 mt-2">
            The investigator submitted a <strong>verified rebuttal</strong> to
            the ledger. It now appears in the claims list and your score has been
            recalculated.
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full py-3 rounded-2xl bg-[#0B2545] hover:bg-[#132c52] text-white font-semibold text-sm"
          >
            View updated ledger
          </button>
        </div>
      )}
    </ModalShell>
  );
}

/* ---------- Debate ---------- */

function DebateModal({
  displayName,
  negativeClaims,
  onClose,
  onStrikeClaim,
}: {
  displayName: string;
  negativeClaims: DemoClaim[];
  onClose: () => void;
  onStrikeClaim: (id: number) => void;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(
    negativeClaims[0]?.id ?? null
  );
  const [phase, setPhase] = useState<
    "select" | "pending" | "accepted" | "struck"
  >("select");

  const selected = negativeClaims.find((c) => c.id === selectedId);
  const claimant = selected
    ? selected.posterVerified
      ? `@${selected.poster}`
      : "the anonymous guest"
    : "";

  function strike() {
    if (selectedId == null) return;
    onStrikeClaim(selectedId);
    setPhase("struck");
  }

  return (
    <ModalShell
      title="Challenge to a Moderated Debate"
      subtitle={
        phase === "select"
          ? "Fund a neutral, recorded debate. The claimant has 10 days to accept."
          : undefined
      }
      onClose={onClose}
    >
      {phase === "select" && (
        <>
          <ClaimPicker
            negativeClaims={negativeClaims}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <div className="mt-4 text-sm bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800">
            <strong>The stakes:</strong> if {claimant || "the claimant"} declines
            or fails to respond within 10 days, the claim and{" "}
            <strong>every vote supporting it</strong> are permanently struck from
            the record.
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-slate-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => setPhase("pending")}
              disabled={selectedId == null}
              className="flex-1 py-3 rounded-2xl bg-[#0B2545] hover:bg-[#132c52] text-white font-semibold text-sm disabled:opacity-50"
            >
              Pay $1,200 &amp; Issue Challenge
            </button>
          </div>
          <p className="mt-3 text-[11px] text-slate-400 text-center">
            Demo — no real payment is processed.
          </p>
        </>
      )}

      {phase === "pending" && (
        <div>
          <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2 font-medium text-[#0B2545]">
              <Loader2 className="w-4 h-4 text-[#C9A24B] animate-spin" />
              Challenge issued to {claimant}
            </div>
            <div className="mt-2 text-[13px] text-slate-600">
              A neutral moderator has been notified. The clock is running —{" "}
              <strong>10 days</strong> to accept a recorded debate.
            </div>
          </div>

          <div className="mt-5 text-xs font-semibold tracking-wider text-slate-400 text-center">
            SIMULATE THE OUTCOME (DEMO)
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2">
            <button
              onClick={strike}
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm"
            >
              Claimant declines / no-show → strike the claim
            </button>
            <button
              onClick={() => setPhase("accepted")}
              className="w-full py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 font-medium text-sm text-[#0B2545]"
            >
              Claimant accepts → schedule debate
            </button>
          </div>
        </div>
      )}

      {phase === "accepted" && (
        <div className="py-4 text-center">
          <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
            <Gavel className="w-6 h-6" />
          </div>
          <div className="mt-4 font-semibold text-[#0B2545]">
            Debate scheduled
          </div>
          <p className="text-sm text-slate-600 mt-2">
            {claimant} accepted. A moderated, recorded session has been booked.
            Both sides present evidence; the transcript is attached to the claim
            for voters to weigh.
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full py-3 rounded-2xl bg-[#0B2545] hover:bg-[#132c52] text-white font-semibold text-sm"
          >
            Done
          </button>
        </div>
      )}

      {phase === "struck" && (
        <div className="py-4 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <div className="mt-4 font-semibold text-[#0B2545]">
            Claim struck from the record
          </div>
          <p className="text-sm text-slate-600 mt-2">
            {claimant} did not stand behind the claim. It and its supporting
            votes have been removed, and {displayName}&rsquo;s score has been
            recalculated upward.
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full py-3 rounded-2xl bg-[#0B2545] hover:bg-[#132c52] text-white font-semibold text-sm"
          >
            See the updated profile
          </button>
        </div>
      )}
    </ModalShell>
  );
}

/* ---------- Deconfliction Gallery ---------- */

const ROLE_OPTIONS = [
  { role: "Neutral Mediator", rate: 400 },
  { role: "Fact-checker", rate: 250 },
  { role: "Subject-matter Expert", rate: 350 },
  { role: "Witness", rate: 150 },
  { role: "Character Reference", rate: 150 },
];

const GALLERY_BASE = 2400;

function GalleryModal({
  onClose,
  onReserve,
}: {
  onClose: () => void;
  onReserve: (seats: number) => void;
}) {
  const [roomName, setRoomName] = useState("");
  const [seats, setSeats] = useState<{ role: string; rate: number }[]>([]);
  const [done, setDone] = useState(false);

  const total = GALLERY_BASE + seats.reduce((s, x) => s + x.rate, 0);

  return (
    <ModalShell
      title="Reserve a Deconfliction Gallery"
      subtitle={
        done
          ? undefined
          : "A private, logged room to de-escalate the grievance. Hire as many people as you like."
      }
      onClose={onClose}
    >
      {!done ? (
        <>
          <label className="text-xs font-semibold tracking-wider text-slate-500 block mb-1.5">
            ROOM NAME
          </label>
          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="e.g. Resolution — 2024 conduct allegation"
            className="w-full border border-slate-200 focus:border-[#C9A24B] transition-colors rounded-2xl px-4 py-2.5 text-sm"
          />

          <div className="mt-5 text-xs font-semibold tracking-wider text-slate-500">
            ADD PEOPLE TO HIRE
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.role}
                onClick={() => setSeats((s) => [...s, opt])}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 hover:border-[#C9A24B]/60 hover:bg-[#C9A24B]/5 transition-colors"
              >
                <Plus className="w-3 h-3" /> {opt.role}
                <span className="text-slate-400">${opt.rate}</span>
              </button>
            ))}
          </div>

          {seats.length > 0 && (
            <div className="mt-4 space-y-1.5">
              <div className="text-xs font-semibold tracking-wider text-slate-500">
                ROSTER ({seats.length})
              </div>
              {seats.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 text-sm"
                >
                  <span className="text-slate-700">
                    {s.role}{" "}
                    <span className="text-slate-400 text-xs">${s.rate}</span>
                  </span>
                  <button
                    onClick={() =>
                      setSeats((arr) => arr.filter((_, idx) => idx !== i))
                    }
                    className="text-slate-400 hover:text-rose-600"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#0B2545] text-white px-4 py-3">
            <div className="text-sm">
              <div className="text-[11px] text-slate-300 tracking-wider">
                ESTIMATE
              </div>
              <div className="text-[11px] text-slate-400">
                base ${GALLERY_BASE.toLocaleString()} + {seats.length} seat
                {seats.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="text-2xl font-semibold tabular-nums">
              ${total.toLocaleString()}
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-slate-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onReserve(seats.length);
                setDone(true);
              }}
              className="flex-1 py-3 rounded-2xl bg-[#C9A24B] hover:bg-[#a07f32] text-white font-semibold text-sm"
            >
              Reserve Gallery
            </button>
          </div>
          <p className="mt-3 text-[11px] text-slate-400 text-center">
            Demo — no real payment is processed.
          </p>
        </>
      ) : (
        <div className="py-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#C9A24B]/15 text-[#C9A24B] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="mt-4 font-semibold text-[#0B2545]">
            Gallery reserved
          </div>
          <p className="text-sm text-slate-600 mt-2">
            {roomName ? `“${roomName}”` : "Your private room"} is live with{" "}
            {seats.length} invited {seats.length === 1 ? "seat" : "seats"}. A
            secure invite link and intake form are on the way. All activity is
            logged for the record.
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full py-3 rounded-2xl bg-[#0B2545] hover:bg-[#132c52] text-white font-semibold text-sm"
          >
            Done
          </button>
        </div>
      )}
    </ModalShell>
  );
}
