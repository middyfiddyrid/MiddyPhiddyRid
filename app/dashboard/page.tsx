import Link from "next/link";
import { Bell, UserCheck, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

async function getDisplayEmail(): Promise<string | null> {
  const isDemoMode = process.env.DEMO_MODE === "true";
  if (isDemoMode) return null;
  try {
    const { currentUser } = await import("@clerk/nextjs/server");
    const user = await currentUser();
    return user?.emailAddresses?.[0]?.emailAddress ?? null;
  } catch {
    return null;
  }
}

export default async function Dashboard() {
  const email = await getDisplayEmail();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="section-header text-[#C9A24B]">Your account</div>
        <h1 className="font-display text-4xl tracking-tighter text-[#0B2545]">
          Your PsDiary
        </h1>
        <p className="text-slate-600 mt-2">
          Manage names you have claimed, watchlist entries, and notification
          preferences.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-7">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#C9A24B]/10 text-[#C9A24B] flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="font-semibold text-[#0B2545]">
                Names you claim
              </div>
            </div>
            <span className="text-xs font-medium px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
              0
            </span>
          </div>
          <div className="text-sm text-slate-500 mb-5 leading-snug">
            When you claim a name, you get full voting weight and real-time
            alerts on every new claim posted about it.
          </div>
          <Link
            href="/sign-in"
            className="text-sm font-semibold text-[#C9A24B] hover:underline"
          >
            Claim your first name →
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-7">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
              <div className="font-semibold text-[#0B2545]">
                Your watchlist
              </div>
            </div>
            <span className="text-xs font-medium px-3 py-1 bg-sky-100 text-sky-700 rounded-full">
              0
            </span>
          </div>
          <div className="text-sm text-slate-500 mb-5 leading-snug">
            Add any name to your watchlist to receive email and SMS alerts when
            new claims are posted — even if you don&rsquo;t own that name.
          </div>
          <Link
            href="/"
            className="text-sm font-semibold text-[#C9A24B] hover:underline"
          >
            Browse and add names →
          </Link>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-[#C9A24B]" />
          <div className="font-semibold text-[#0B2545]">Notifications</div>
        </div>
        <div className="text-slate-600">
          Email and SMS alerts are enabled for any names you claim or watch. You
          can manage per-name preferences on each profile.
        </div>
        {email && (
          <div className="mt-3 text-xs text-slate-500">
            Signed in as:{" "}
            <span className="font-medium text-slate-700">{email}</span>
          </div>
        )}
      </div>
    </div>
  );
}
