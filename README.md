# PsDiary — Production

Real production version of the Page 6 (Diary) public reputation ledger.

## Stack

- Next.js 15 (App Router)
- Clerk — Authentication
- Supabase — Postgres database + RLS
- xAI Grok API — AI Pro/Con + Probability analysis
- Resend — Transactional email
- Vercel — Hosting

## Current Status (February 2026)

This is the **early scaffolding** of the real production PsDiary application.

**What exists today:**
- Full Next.js 15 + TypeScript project
- Clerk authentication wired
- Supabase schema defined
- Grok (xAI) analysis helper
- Resend email notification service
- Basic routing and UI shell matching the prototype branding

**What is still being built (active work):**
- Full claim posting + voting with real DB writes
- Watchlist + notification preferences UI
- Real-time Grok analysis on profiles
- Actual email delivery on new claims
- Scoring engine moved to server

## Getting Started

1. `cd psdiary-app`
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill values
4. Create a Supabase project and run `supabase/schema.sql`
5. Create a Clerk application and add keys
6. Get an xAI API key and Resend key
7. `npm run dev`

## Environment Variables Required

See `.env.example`

## Key Features (MVP)

- Sign in with email (Clerk)
- Claim names
- Post claims (positive / negative / factual)
- Watchlist ("keep an eye out for")
- Real email notifications when claims are posted on watched/owned names
- Grok-powered AI analysis on every profile
- Weighted voting (verified vs guest)

## Deployment

Deploy to Vercel. All environment variables must be set in the Vercel dashboard.

## Next Milestones

- Real SMS via Twilio
- Immutable audit log / Merkle tree
- Public API + embeddable widgets
- Admin moderation dashboard

This is the production implementation of the original PsDiary specification.
