-- PsDiary Production Schema for Supabase
-- Run this in the Supabase SQL Editor

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- People / Subjects
create table public.people (
  slug text primary key,
  display_name text not null,
  claimed_by text,                    -- Clerk user_id who owns this name
  bio text,
  created_at timestamptz default now()
);

-- Claims
create table public.claims (
  id uuid primary key default uuid_generate_v4(),
  slug text references public.people(slug) on delete cascade,
  poster_user_id text,                -- Clerk user_id (null = guest)
  text text not null,
  category text check (category in ('positive','negative','factual')) not null,
  evidence_url text,
  created_at timestamptz default now()
);

-- Votes
create table public.votes (
  id uuid primary key default uuid_generate_v4(),
  claim_id uuid references public.claims(id) on delete cascade,
  voter_user_id text,                 -- Clerk user_id (null = guest)
  value text check (value in ('support','dispute','neutral')) not null,
  weight numeric(3,1) not null default 0.1,   -- 1.0 for verified, 0.1 for guests
  created_at timestamptz default now(),
  unique(claim_id, voter_user_id)
);

-- Watchlist (keep an eye out for)
create table public.watches (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,              -- Clerk user_id
  slug text references public.people(slug) on delete cascade,
  notify_email boolean default true,
  notify_sms boolean default false,
  created_at timestamptz default now(),
  unique(user_id, slug)
);

-- Notifications log
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  slug text,
  claim_id uuid references public.claims(id),
  message text not null,
  channel text,                       -- 'email' or 'sms'
  sent_at timestamptz default now(),
  read boolean default false
);

-- Row Level Security (important)
alter table public.people enable row level security;
alter table public.claims enable row level security;
alter table public.votes enable row level security;
alter table public.watches enable row level security;
alter table public.notifications enable row level security;

-- Basic policies (refine later)
create policy "Public read people" on public.people for select using (true);
create policy "Public read claims" on public.claims for select using (true);
create policy "Public read votes" on public.votes for select using (true);

-- Users can manage their own watches and notifications
create policy "Users manage own watches" on public.watches
  for all using (auth.uid()::text = user_id);

create policy "Users read own notifications" on public.notifications
  for select using (auth.uid()::text = user_id);
