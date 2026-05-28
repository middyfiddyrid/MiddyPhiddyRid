import Link from "next/link";

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="text-[#C9A24B] text-sm tracking-[2px] font-semibold mb-3">PAGE 6 • THE CONCEPT</div>
        <h1 className="font-display text-5xl tracking-tighter text-[#0B2545]">How PsDiary Works</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-md mx-auto">A public reputation ledger that actually protects people from coordinated attacks.</p>
      </div>

      <div className="space-y-10">
        <div className="bg-white border border-slate-200 rounded-3xl p-8">
          <div className="font-semibold text-xl mb-3">1. Anyone can post anything about anyone</div>
          <p className="text-slate-600">Good, bad, or factual claims. The system is transparent by design. There is no gatekeeping on who can speak.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8">
          <div className="font-semibold text-xl mb-3">2. Verified weight is everything</div>
          <p className="text-slate-600">Only people who have <strong>claimed their own name</strong> vote at full strength. Guest / anonymous votes carry just 0.1× weight. This dramatically raises the cost of smear campaigns.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8">
          <div className="font-semibold text-xl mb-3">3. Real-time alerts</div>
          <p className="text-slate-600">When you claim a name or add someone to your Watchlist, you get email and SMS the moment new claims appear. You never have to manually monitor your reputation again.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8">
          <div className="font-semibold text-xl mb-3">4. Grok-powered analysis</div>
          <p className="text-slate-600">Every profile includes a live AI breakdown: pro/con arguments, probability assessment, and detection of coordinated low-weight attack patterns.</p>
        </div>

        {/* Why Claim Your Name? */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8">
          <div className="font-semibold text-xl mb-5 tracking-tight">Why Claim Your Name?</div>
          
          <div className="space-y-6 text-sm text-slate-600">
            <div>
              <span className="font-semibold text-[#0B2545]">Get notified immediately when someone attacks your name.</span><br />
              The second a negative claim is posted about you, you receive an alert. Most people only find out weeks later, if at all.
            </div>

            <div>
              <span className="font-semibold text-[#0B2545]">Five business days to respond before the claim gains momentum.</span><br />
              You get protected time to gather facts, bring in friends and colleagues to provide context, and organize a proper defense.
            </div>

            <div>
              <span className="font-semibold text-[#0B2545]">Mobilize your network at full voting weight.</span><br />
              Only claimed names can effectively rally supporters. Friends and colleagues can add context and vote on claims with real influence.
            </div>

            <div>
              <span className="font-semibold text-[#0B2545]">Access to serious remediation tools.</span><br />
              Hire professional investigators to find exculpatory evidence, force a structured moderated debate with the claimant (with real consequences if they decline), or reserve a private Deconfliction Gallery with hired experts to resolve the underlying issue.
            </div>

            <div>
              <span className="font-semibold text-[#0B2545]">Turn your name into a portable, defensible asset.</span><br />
              Over time, your PsDiary score and history become something you can actually cite — with employers, partners, media, or the public.
            </div>

            <div>
              <span className="font-semibold text-[#0B2545]">Stop being purely reactive.</span><br />
              Claimed names get to play offense. You control the response window, the narrative, and the tools available to you.
            </div>
          </div>
        </div>

        <div className="text-center pt-6">
          <Link href="/sign-in" className="inline-block bg-[#0B2545] text-white px-8 py-3.5 rounded-2xl font-semibold">
            Get started — Claim your name
          </Link>
          <div className="mt-3 text-xs text-slate-500">Takes 30 seconds. Real product in active development.</div>
        </div>
      </div>
    </div>
  );
}
