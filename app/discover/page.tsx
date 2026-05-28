'use client';

import Link from "next/link";
import { useState } from "react";

export default function DiscoverPage() {
  const [search, setSearch] = useState("");

  const demoPeople = [
    { slug: "marcus-thompson", display_name: "Marcus Thompson", score: 47, status: "UNCLAIMED", bio: "Midwest business owner currently targeted by coordinated online attacks." },
    { slug: "dr-elena-vazquez", display_name: "Dr. Elena Vazquez", score: 91, status: "CLAIMED", bio: "Epidemiologist. Successfully defended multiple reputation attacks with verified community support." },
    { slug: "jordan-lee", display_name: "Jordan Lee", score: 84, status: "CLAIMED", bio: "Civic tech engineer. Strong track record with open data and election transparency projects." },
    { slug: "samantha-roe", display_name: "Samantha Roe", score: 58, status: "UNCLAIMED", bio: "Nonprofit founder. Mixed public record with limited verified participation so far." },
    { slug: "alex-rivera", display_name: "Alex Rivera", score: 73, status: "CLAIMED", bio: "Local journalist and community organizer." },
    { slug: "priya-patel", display_name: "Dr. Priya Patel", score: 88, status: "CLAIMED", bio: "Oncologist and patient advocate. Very high community trust score." },
  ];

  const filteredPeople = demoPeople.filter(p =>
    p.display_name.toLowerCase().includes(search.toLowerCase()) ||
    p.bio.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="text-[#C9A24B] text-sm tracking-widest font-semibold">PUBLIC LEDGER</div>
          <h1 className="font-display text-4xl tracking-tighter text-[#0B2545]">Discover</h1>
        </div>
        <Link href="/post" className="text-sm font-medium px-5 py-2.5 rounded-2xl border border-[#C9A24B] hover:bg-[#C9A24B]/5 text-[#0B2545] w-fit">
          Post a Claim
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search names or bios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-slate-200 focus:border-[#C9A24B] transition-colors rounded-2xl px-4 py-3 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoPeople.map((person) => {
          const scoreColor = person.score >= 75 ? "text-emerald-600" : person.score >= 55 ? "text-amber-600" : "text-rose-600";
          return (
            <a 
              key={person.slug} 
              href={`/p/${person.slug}`}
              className="claim-card block bg-white border border-slate-200 rounded-3xl p-6 hover:border-[#C9A24B]/60 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-xl tracking-tight">{person.display_name}</div>
                  <div className={`text-[10px] mt-1 font-medium tracking-wider ${person.status === "CLAIMED" ? "text-[#C9A24B]" : "text-slate-500"}`}>
                    {person.status}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-semibold tabular-nums ps-score ${scoreColor}`}>{person.score}</div>
                  <div className="text-[9px] text-slate-400 -mt-1">PSDIARY</div>
                </div>
              </div>
              {person.bio && (
                <p className="text-sm text-slate-600 mt-5 leading-snug line-clamp-3">{person.bio}</p>
              )}
            </a>
          );
        })}
      </div>

      <div className="mt-8 text-center text-xs text-slate-500">
        This is early demo data. Real profiles + live claims coming soon.
      </div>
    </div>
  )
}
