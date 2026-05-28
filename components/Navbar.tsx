"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, BookOpen } from "lucide-react";
import { HowItWorksModal } from "./HowItWorksModal";

export function Navbar() {
  const isDemoMode =
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    process.env.DEMO_MODE === "true";

  const [howOpen, setHowOpen] = useState(false);

  return (
    <>
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 gap-3">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 bg-[#0B2545] rounded-xl flex items-center justify-center">
                <span className="text-[#C9A24B] text-xl font-bold tracking-tighter">
                  P6
                </span>
              </div>
              <div>
                <div className="font-display text-2xl tracking-tighter font-semibold text-[#0B2545] leading-none">
                  PsDiary
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5 font-semibold tracking-[1px]">
                  PUBLIC REPUTATION LEDGER
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2 text-sm font-medium">
              <button
                onClick={() => setHowOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0B2545] px-3 py-1.5"
              >
                <BookOpen className="w-4 h-4 text-[#C9A24B]" />
                <span>How it works</span>
              </button>
              <Link
                href="/dashboard"
                className="hidden md:inline text-slate-600 hover:text-[#0B2545] px-3 py-1.5"
              >
                Dashboard
              </Link>

              <button
                className="relative flex items-center justify-center w-9 h-9 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-500" />
              </button>

              {isDemoMode ? (
                <div className="ml-1 px-3.5 py-1.5 text-xs bg-amber-100 text-amber-800 rounded-2xl font-semibold tracking-wide">
                  DEMO
                </div>
              ) : (
                <Link href="/sign-in">
                  <button className="ml-1 bg-[#0B2545] text-white px-5 py-2 rounded-2xl text-sm font-semibold hover:bg-[#132c52]">
                    Sign in
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <HowItWorksModal open={howOpen} onClose={() => setHowOpen(false)} />
    </>
  );
}
