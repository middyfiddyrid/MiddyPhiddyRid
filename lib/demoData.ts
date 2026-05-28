export type Category = "positive" | "negative" | "factual";

export interface DemoClaim {
  id: number;
  text: string;
  category: Category;
  poster: string;
  posterVerified: boolean;
  support: number;
  dispute: number;
  evidence?: string;
  timeAgo: string;
}

export interface DemoPerson {
  slug: string;
  displayName: string;
  score: number;
  claimedHandle?: string;
  bio: string;
  claims: DemoClaim[];
}

export const DEMO_PEOPLE: DemoPerson[] = [
  {
    slug: "dr-elena-vazquez",
    displayName: "Dr. Elena Vazquez",
    score: 96,
    claimedHandle: "elenav",
    bio: "Epidemiologist and public health researcher. Former CDC advisor. Frequently targeted in online health misinformation campaigns.",
    claims: [
      {
        id: 101,
        text: "She is part of the globalist health control network. Look at her WEF ties.",
        category: "negative",
        poster: "Guest",
        posterVerified: false,
        support: 0.0,
        dispute: 1.0,
        timeAgo: "19h ago",
      },
      {
        id: 102,
        text: "I have worked with Dr. Vazquez on two open data projects. Her integrity and rigor are exceptional. The recent attacks lack any primary sourcing.",
        category: "positive",
        poster: "jordanl",
        posterVerified: true,
        support: 1.0,
        dispute: 0.0,
        timeAgo: "2d ago",
      },
      {
        id: 103,
        text: "Elena Vazquez lied about her CDC role and fabricated data for a political agenda.",
        category: "negative",
        poster: "Guest",
        posterVerified: false,
        support: 0.1,
        dispute: 2.0,
        timeAgo: "4d ago",
      },
      {
        id: 104,
        text: "Co-authored peer-reviewed work in JAMA on outbreak response logistics. Public record verifiable via institutional archives.",
        category: "factual",
        poster: "drpriya",
        posterVerified: true,
        support: 2.0,
        dispute: 0.0,
        timeAgo: "5d ago",
      },
    ],
  },
  {
    slug: "marcus-thompson",
    displayName: "Marcus Thompson",
    score: 47,
    bio: "Midwest small business owner. Currently the target of a coordinated online reputation attack from multiple unverified accounts.",
    claims: [
      {
        id: 201,
        text: "Marcus stole money from the youth sports league he ran in 2022.",
        category: "negative",
        poster: "Guest",
        posterVerified: false,
        support: 0.3,
        dispute: 0.2,
        timeAgo: "3h ago",
      },
      {
        id: 202,
        text: "This same accusation has been posted by four newly-created accounts in the past 48 hours. None cite primary sources.",
        category: "factual",
        poster: "Guest",
        posterVerified: false,
        support: 0.4,
        dispute: 0.0,
        timeAgo: "1d ago",
      },
      {
        id: 203,
        text: "I coached alongside Marcus for three years. He kept transparent books and the league audit was clean.",
        category: "positive",
        poster: "Guest",
        posterVerified: false,
        support: 0.2,
        dispute: 0.0,
        timeAgo: "2d ago",
      },
    ],
  },
  {
    slug: "jordan-lee",
    displayName: "Jordan Lee",
    score: 84,
    claimedHandle: "jordanl",
    bio: "Software engineer focused on civic technology and election transparency. Strong positive record.",
    claims: [
      {
        id: 301,
        text: "Jordan led the open-source rewrite of our county's election results portal — code is on GitHub.",
        category: "positive",
        poster: "elenav",
        posterVerified: true,
        support: 2.0,
        dispute: 0.0,
        timeAgo: "1d ago",
      },
      {
        id: 302,
        text: "Speaks at civic tech conferences regularly. Public talks archived on YouTube.",
        category: "factual",
        poster: "Guest",
        posterVerified: false,
        support: 0.3,
        dispute: 0.0,
        timeAgo: "5d ago",
      },
    ],
  },
  {
    slug: "dr-priya-patel",
    displayName: "Dr. Priya Patel",
    score: 88,
    claimedHandle: "drpriya",
    bio: "Oncologist and patient advocate. Very high community trust score.",
    claims: [
      {
        id: 401,
        text: "Dr. Patel walked our family through every option without pressure. Exceptional bedside manner.",
        category: "positive",
        poster: "Guest",
        posterVerified: false,
        support: 0.4,
        dispute: 0.0,
        timeAgo: "2d ago",
      },
      {
        id: 402,
        text: "Board-certified medical oncologist — verifiable via ABMS.",
        category: "factual",
        poster: "elenav",
        posterVerified: true,
        support: 1.0,
        dispute: 0.0,
        timeAgo: "4d ago",
      },
    ],
  },
  {
    slug: "alex-rivera",
    displayName: "Alex Rivera",
    score: 73,
    claimedHandle: "arivera",
    bio: "Local journalist and community organizer. Mixed coverage, mostly positive on civic reporting.",
    claims: [
      {
        id: 501,
        text: "Broke the story on the county jail contract overruns. Sourcing held up under FOIA review.",
        category: "positive",
        poster: "jordanl",
        posterVerified: true,
        support: 1.0,
        dispute: 0.0,
        timeAgo: "3d ago",
      },
    ],
  },
  {
    slug: "samantha-roe",
    displayName: "Samantha Roe",
    score: 58,
    bio: "Nonprofit founder. Mixed public record with limited verified participation so far.",
    claims: [
      {
        id: 601,
        text: "Samantha's nonprofit publishes annual financials on its website.",
        category: "factual",
        poster: "Guest",
        posterVerified: false,
        support: 0.2,
        dispute: 0.0,
        timeAgo: "6d ago",
      },
    ],
  },
];

export function findPerson(slug: string): DemoPerson | undefined {
  return DEMO_PEOPLE.find((p) => p.slug === slug);
}

export function scoreColorClass(score: number): string {
  if (score >= 75) return "text-emerald-600";
  if (score >= 55) return "text-amber-600";
  return "text-rose-600";
}

export function scoreLabel(score: number): "HIGH" | "MIXED" | "LOW" {
  if (score >= 75) return "HIGH";
  if (score >= 55) return "MIXED";
  return "LOW";
}

export function scoreRingColor(score: number): string {
  if (score >= 75) return "#10b981";
  if (score >= 55) return "#d97706";
  return "#e11d48";
}
