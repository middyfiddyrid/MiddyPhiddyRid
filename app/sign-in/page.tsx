"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, Bell, Trophy, MessageSquare } from "lucide-react";

export default function SignInPage() {
  const isDemoMode =
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    process.env.DEMO_MODE === "true";

  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      alert(
        `Welcome, @${handle || "new-user"}! (Demo mode — in production this creates a verified Clerk account and saves your contact info for email/SMS alerts.)`
      );
      setSubmitted(false);
    }, 700);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <div className="section-header text-[#C9A24B] mb-2">Get started</div>
          <h1 className="font-display text-4xl md:text-5xl tracking-tighter text-[#0B2545] leading-[1.05] mb-5">
            Take control of your public record.
          </h1>

          <div className="space-y-3 text-slate-600 text-[15px] leading-snug">
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-[#C9A24B] mt-0.5 shrink-0" />
              <div>
                Claim your name and vote at <strong>full strength</strong> on
                every claim made about you.
              </div>
            </div>
            <div className="flex gap-3">
              <Bell className="w-5 h-5 text-[#C9A24B] mt-0.5 shrink-0" />
              <div>
                Receive real <strong>email &amp; SMS alerts</strong> when claims
                appear on names you own or watch.
              </div>
            </div>
            <div className="flex gap-3">
              <Trophy className="w-5 h-5 text-[#C9A24B] mt-0.5 shrink-0" />
              <div>
                Build a <strong>verifiable reputation history</strong> with
                Grok-backed AI analysis on demand.
              </div>
            </div>
            <div className="flex gap-3">
              <MessageSquare className="w-5 h-5 text-[#C9A24B] mt-0.5 shrink-0" />
              <div>
                Immediately counter smear campaigns with your{" "}
                <strong>citation badge</strong>.
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            Early production preview. Your data is used to demonstrate the
            verified-account workflow.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">
          <div className="font-display text-2xl tracking-tight text-[#0B2545] mb-1">
            Create verified account
          </div>
          <div className="text-sm text-slate-500 mb-6">
            Claim names and receive cell phone / email alerts the moment anyone
            posts on a name you own or watch.
          </div>

          {isDemoMode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5 tracking-wide">
                  YOUR HANDLE
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-2xl border border-r-0 border-slate-200 bg-slate-50 text-slate-400">
                    @
                  </span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="yourname"
                    required
                    className="flex-1 border border-slate-200 rounded-r-2xl px-4 py-3 focus:border-[#C9A24B] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5 tracking-wide">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:border-[#C9A24B] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5 tracking-wide">
                    PHONE (SMS)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 555-1212"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:border-[#C9A24B] transition-colors"
                  />
                </div>
              </div>

              <div className="text-xs bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl text-emerald-800">
                Providing email and phone enables real-time notifications when
                claims appear on any name you claim{" "}
                <strong>or add to your Watchlist</strong>.
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="w-full py-3.5 rounded-2xl bg-[#0B2545] hover:bg-[#132c52] text-white text-sm font-semibold tracking-wide disabled:opacity-70 transition-all active:scale-[0.985]"
              >
                {submitted ? "CREATING ACCOUNT…" : "CREATE ACCOUNT & VERIFY"}
              </button>

              <div className="text-center text-xs text-slate-500">
                Demo mode — in production this uses Clerk authentication with
                email/SMS verification.
              </div>
            </form>
          ) : (
            <ClerkSignInLive />
          )}

          <p className="text-center text-xs text-slate-500 mt-5">
            By signing in you agree to our early preview terms.{" "}
            <Link
              href="/"
              className="underline hover:text-slate-700"
            >
              Back home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function ClerkSignInLive() {
  // Lazy-loaded so the demo build doesn't try to resolve Clerk's React provider context.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { SignIn } = require("@clerk/nextjs");
    return (
      <SignIn
        appearance={{
          elements: {
            card: "shadow-none border border-slate-200",
            headerTitle: "font-display text-2xl tracking-tighter",
          },
        }}
      />
    );
  } catch {
    return (
      <div className="text-sm text-slate-500 py-8 text-center">
        Sign-in unavailable. Switch to DEMO_MODE=true in your environment to try
        the preview flow.
      </div>
    );
  }
}
