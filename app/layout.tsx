import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";

// Force dynamic rendering so Clerk doesn't break the production build
// (avoids prerendering errors when keys aren't set)
export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

export const metadata: Metadata = {
  title: "PsDiary | Public Reputation Ledger",
  description: "Claim your name. Curate the record. Real-time alerts when claims are made about you or names you watch.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDemoMode = process.env.DEMO_MODE === 'true';

  return (
    <>
      {isDemoMode ? (
        // Pure demo mode - no Clerk at all
        <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
          <body className="bg-slate-50 text-slate-900 font-sans">
            <div className="bg-[#0B2545] text-[#C9A24B] text-center text-xs py-1.5 font-medium tracking-wider">
              LIVE PROTOTYPE — Deployed publicly • Data resets on browser clear • For demo &amp; feedback only
            </div>
            <Navbar />
            <main>{children}</main>
            <footer className="border-t py-8 text-center text-xs text-slate-500">
              <div className="max-w-5xl mx-auto px-6">
                PsDiary — Early Production Preview • Page 6 (Diary) • 
                <Link href="/how-it-works" className="hover:text-slate-700 underline underline-offset-2">How it works</Link>
              </div>
            </footer>
          </body>
        </html>
      ) : (
        <ClerkProvider>
          <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
            <body className="bg-slate-50 text-slate-900 font-sans">
              <div className="bg-[#0B2545] text-[#C9A24B] text-center text-xs py-1.5 font-medium tracking-wider">
                LIVE PROTOTYPE — Deployed publicly • Data resets on browser clear • For demo &amp; feedback only
              </div>
              <Navbar />
              <main>{children}</main>
              <footer className="border-t py-8 text-center text-xs text-slate-500">
                <div className="max-w-5xl mx-auto px-6">
                  PsDiary — Early Production Preview • Page 6 (Diary) • 
                  <Link href="/how-it-works" className="hover:text-slate-700 underline underline-offset-2">How it works</Link>
                </div>
              </footer>
            </body>
          </html>
        </ClerkProvider>
      )}
    </>
  );
}
