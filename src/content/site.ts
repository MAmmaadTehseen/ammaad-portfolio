/* ============================================================
   THE ONLY FILE YOU NEED TO EDIT.
   Everything the site renders comes from here.
   ============================================================ */

/** Who is reading. The whole site re-tunes to this. */
export type Channel = "client" | "recruiter" | "engineer";

/** How much of a project is on the record. */
export type Tier = "live" | "open" | "closed";

export const CHANNELS: { id: Channel; label: string; hint: string }[] = [
  { id: "client", label: "Client", hint: "What it does for a business" },
  { id: "recruiter", label: "Recruiter", hint: "Role, stack, scope" },
  { id: "engineer", label: "Engineer", hint: "How it is actually built" },
];

export const TIERS: Record<Tier, { label: string; note: string }> = {
  live: { label: "Live", note: "Shipped and running in production" },
  open: { label: "Open", note: "Source is public on GitHub" },
  closed: { label: "Closed", note: "Private source — described by architecture only" },
};

export const profile = {
  name: "Muhammad Ammaad Tehseen",
  short: "Ammaad",
  /** Rendered letter by letter in the hero. Keep it short. */
  display: "AMMAAD",
  role: "Full-stack engineer",
  discipline: "Backend systems · product engineering",
  location: "Lahore, Pakistan",
  timezone: "Asia/Karachi",
  /** Shown as a live LED in the hero + contact. */
  available: true,
  availableNote: "Open to contract and full-time work",
  email: "ammadtehseenkhan@gmail.com",
  /**
   * Must be the host that actually serves the site, not the one that redirects
   * to it. Vercel is set up apex -> www, and canonical, OG image, sitemap and
   * robots all derive from this line — an og:image on the redirecting host
   * answers 308 rather than a PNG, and several social scrapers will not follow
   * that. Flip Vercel to make the bare domain primary and change this back.
   */
  site: "https://www.ammaad.online",
  socials: [
    { label: "GitHub", href: "https://github.com/MAmmaadTehseen", handle: "MAmmaadTehseen" },
    { label: "X", href: "https://x.com/MAmmaadTehseen", handle: "@MAmmaadTehseen" },
  ],
};

/** The bio, told three ways. Same person, three depths. */
export const bio: Record<Channel, { lede: string; body: string }> = {
  client: {
    lede: "I build the software your business actually runs on.",
    body:
      "Subscriptions that bill correctly. Email that reaches people. Dashboards that tell you the truth. I take a product from an idea to something live, then keep it alive — the unglamorous half most builds skip. You get one person accountable for the whole stack instead of a handoff between three.",
  },
  recruiter: {
    lede: "Full-stack engineer. Heaviest on the backend, comfortable owning the front.",
    body:
      "Day to day I work across a TypeScript monorepo — Next.js and React on the front, Node, Express and Prisma over PostgreSQL on the back, with Redis, ChromaDB, Bull queues and Socket.IO where the work needs them. Most of what I ship is systems work: billing lifecycles, retrieval pipelines, real-time presence, scheduled jobs, and migrations against live data.",
  },
  engineer: {
    lede: "I like the parts that page you at 3am.",
    body:
      "Webhook idempotency. Migration drift on a database you cannot reset. An N+1 hiding behind a nice-looking repository method. A require cycle that only bites standalone scripts. I write the boring layers deliberately — repository and service split, Zod at every boundary, one transport for email, observer taps rather than call-site edits — because that is what makes the interesting layers survivable.",
  },
};

/** Runs in the capability band. Keep them short and physical. */
export const capabilities = [
  "API design",
  "Database schema & migrations",
  "Payments & billing lifecycles",
  "Real-time systems",
  "Retrieval / RAG pipelines",
  "Background jobs & scheduling",
  "Admin & analytics tooling",
  "Email infrastructure",
  "Next.js product UI",
];

export type FlowNode = {
  id: string;
  label: string;
  sub?: string;
  /** grid column (1-5) and row (1-3) */
  col: number;
  row: number;
  kind: "edge" | "service" | "store" | "worker";
};

export type FlowEdge = { from: string; to: string; label?: string; dashed?: boolean };

export type Project = {
  id: string;
  name: string;
  tier: Tier;
  year: string;
  role: string;
  /** One line, per channel. This is the disclosure system. */
  lede: Record<Channel, string>;
  stack: string[];
  links?: { label: string; href: string }[];
  /** Shown on the Client channel. Business-side outcomes. */
  outcomes?: string[];
  /** Shown on the Engineer channel. The real internals. */
  internals?: string[];
  /** Animated architecture. Stands in for a screenshot on closed work. */
  flow?: { nodes: FlowNode[]; edges: FlowEdge[] };
};

/* ------------------------------------------------------------------
   NOTE FOR AMMAAD — client naming
   Project 01 is your biggest piece of work but it is client software,
   so I described it by capability and left the client unnamed. That is
   the safe default. If you have the go-ahead to name them, set
   name: "First Movers AI Labs" and add the live URL to links.
   Same call for the storefront (al-junassan / closet-by-junassan).
   ------------------------------------------------------------------ */

export const projects: Project[] = [
  {
    id: "ai-labs",
    name: "AI Learning & Community Platform",
    tier: "closed",
    year: "2024 — now",
    role: "Full-stack engineer · primary product",
    lede: {
      client:
        "A subscription platform where members take AI courses, ask an assistant trained on the whole course library, and talk to each other in one place.",
      recruiter:
        "The product I work on daily. I own features end to end across billing, real-time, analytics, email and admin tooling in a TypeScript monorepo.",
      engineer:
        "Express API with a repository/service split over Prisma and Postgres. Redis carries presence and caching, ChromaDB carries retrieval, Bull carries anything scheduled, Socket.IO carries the live surface.",
    },
    stack: [
      "TypeScript",
      "Next.js",
      "React",
      "Redux",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Redis",
      "ChromaDB",
      "Socket.IO",
      "Bull",
      "Stripe",
      "AWS S3",
      "Docker",
    ],
    outcomes: [
      "Courses, cohorts and certificates delivered to paying members",
      "Subscription billing, invoices and failed-payment recovery",
      "A community members actually post in, with live presence",
      "Admin analytics that answer who is at risk of leaving, and why",
    ],
    internals: [
      "RAG assistant over the course library with a bounded function-calling loop, so it reports real member data instead of inventing metrics",
      "Stripe webhook lifecycle mirrored into an invoices table — idempotent, and the first payment is counted correctly",
      "Socket-driven presence roster in Redis; last-login timestamps proved unreliable, so activity is derived from connections",
      "One email transport with an observer tap, so every send is logged and body-redacted without touching a single call site",
      "Hand-written idempotent migrations — the production database cannot be reset",
    ],
    flow: {
      nodes: [
        { id: "web", label: "Next.js", sub: "app router", col: 1, row: 2, kind: "edge" },
        { id: "api", label: "Express API", sub: "service / repo", col: 2, row: 2, kind: "service" },
        { id: "sock", label: "Socket.IO", sub: "live rooms", col: 2, row: 1, kind: "service" },
        { id: "queue", label: "Bull", sub: "scheduled jobs", col: 3, row: 3, kind: "worker" },
        { id: "pg", label: "PostgreSQL", sub: "Prisma", col: 4, row: 2, kind: "store" },
        { id: "redis", label: "Redis", sub: "presence · cache", col: 4, row: 1, kind: "store" },
        { id: "chroma", label: "ChromaDB", sub: "embeddings", col: 4, row: 3, kind: "store" },
        { id: "stripe", label: "Stripe", sub: "webhooks", col: 1, row: 3, kind: "edge" },
      ],
      edges: [
        { from: "web", to: "api", label: "REST" },
        { from: "web", to: "sock", label: "ws" },
        { from: "sock", to: "redis", label: "roster" },
        { from: "api", to: "pg" },
        { from: "api", to: "redis", label: "cache" },
        { from: "api", to: "chroma", label: "retrieve" },
        { from: "api", to: "queue", label: "enqueue" },
        { from: "queue", to: "pg", dashed: true },
        { from: "stripe", to: "api", label: "events" },
      ],
    },
  },
  {
    id: "ai-manager",
    name: "Cross-Department Early Warning System",
    tier: "closed",
    year: "2026",
    role: "Architect & engineer",
    lede: {
      client:
        "A fire alarm for your business. It watches the everyday work tools across every department and alerts the right manager the moment something looks like real trouble.",
      recruiter:
        "Self-directed product. Ingests activity from workplace tools, classifies it for risk, and routes alerts to the manager who owns that area.",
      engineer:
        "A connector per tool feeding one normalised event stream, an LLM classification pass with a confidence floor, then routing rules that decide escalate, digest, or drop.",
    },
    stack: ["TypeScript", "Node.js", "LLM classification", "Webhooks", "Slack API", "PostgreSQL"],
    outcomes: [
      "Problems surface while they are still cheap to fix",
      "Managers get the one alert that matters, not another feed to read",
    ],
    internals: [
      "Normalising wildly different tool payloads into one event shape is the entire problem",
      "A confidence floor plus a digest tier keeps false positives from training people to ignore it",
    ],
    flow: {
      nodes: [
        { id: "tools", label: "Work tools", sub: "chat · tickets · CRM", col: 1, row: 2, kind: "edge" },
        { id: "ingest", label: "Connectors", sub: "normalise", col: 2, row: 2, kind: "service" },
        { id: "class", label: "Classifier", sub: "risk + confidence", col: 3, row: 2, kind: "worker" },
        { id: "rules", label: "Routing", sub: "escalate · digest", col: 4, row: 2, kind: "service" },
        { id: "store", label: "Event log", sub: "PostgreSQL", col: 3, row: 3, kind: "store" },
        { id: "alert", label: "Manager", sub: "Slack · email", col: 5, row: 2, kind: "edge" },
      ],
      edges: [
        { from: "tools", to: "ingest" },
        { from: "ingest", to: "class", label: "events" },
        { from: "ingest", to: "store", dashed: true },
        { from: "class", to: "rules", label: "scored" },
        { from: "rules", to: "alert", label: "alert" },
      ],
    },
  },
  {
    id: "psx-tracker",
    name: "PSX Tracker",
    tier: "open",
    year: "2026",
    role: "Solo build",
    lede: {
      client: "Follow the Pakistan Stock Exchange without opening five tabs.",
      recruiter: "TypeScript app tracking PSX market data. Public source.",
      engineer:
        "A scheduled fetch normalised into a queryable series, with the display layer kept deliberately dumb.",
    },
    stack: ["TypeScript", "Next.js", "Scheduled jobs"],
    links: [{ label: "Source", href: "https://github.com/MAmmaadTehseen/psx-tracker" }],
  },
  {
    id: "namaz-reminder",
    name: "Namaz Reminder",
    tier: "open",
    year: "2026",
    role: "Solo build",
    lede: {
      client: "Prayer times that reach you at the right moment, wherever you are.",
      recruiter: "TypeScript app for location-aware prayer times and reminders.",
      engineer:
        "Prayer times are a solved calculation but a fiddly one — location, method and timezone all have to agree before a notification is worth sending.",
    },
    stack: ["TypeScript", "Next.js", "Notifications"],
    links: [{ label: "Source", href: "https://github.com/MAmmaadTehseen/namaz-reminder" }],
  },
  {
    id: "finance-manager",
    name: "Finance Manager",
    tier: "open",
    year: "2026",
    role: "Solo build",
    lede: {
      client: "See where the money went without a spreadsheet.",
      recruiter: "TypeScript personal-finance tracker. Public source.",
      engineer:
        "Category rules over an append-only transaction ledger, so re-categorising something never rewrites history.",
    },
    stack: ["TypeScript", "Next.js", "PostgreSQL"],
    links: [{ label: "Source", href: "https://github.com/MAmmaadTehseen/Fiance-manager" }],
  },
  {
    id: "junassan",
    name: "Fashion Storefront",
    tier: "live",
    year: "2026",
    role: "Full-stack engineer",
    lede: {
      client:
        "A clothing label's storefront — catalogue, collections and checkout, built to be run by the people who own it.",
      recruiter: "Client e-commerce build in TypeScript and Next.js, storefront through to admin.",
      engineer: "Catalogue and cart resolved on the server, so a price is never something the browser gets to decide.",
    },
    stack: ["TypeScript", "Next.js", "React", "Tailwind"],
    links: [{ label: "Source", href: "https://github.com/MAmmaadTehseen/closet-by-junassan" }],
  },
  {
    id: "em",
    name: "em",
    tier: "open",
    year: "2024",
    role: "Solo build",
    lede: {
      client: "A quiet place to write things down and find them again.",
      recruiter: "Minimal note-taking app for personal sensemaking. TypeScript.",
      engineer: "An editor is only as good as its data model — flat notes with links beat folders every time.",
    },
    stack: ["TypeScript", "Next.js", "React"],
    links: [{ label: "Source", href: "https://github.com/MAmmaadTehseen/em" }],
  },
  {
    id: "staff-booking",
    name: "Staff Booking Platform",
    tier: "closed",
    year: "2026",
    role: "Full-stack engineer",
    lede: {
      client: "Book staff onto shifts without the WhatsApp thread.",
      recruiter: "Next.js 15 + TypeScript + Tailwind + Supabase booking system, built as a reusable base.",
      engineer:
        "Availability windows and bookings kept as separate tables — an overlap is then a query, not a flag you have to keep in sync.",
    },
    stack: ["TypeScript", "Next.js 15", "Tailwind", "Supabase", "PostgreSQL"],
  },
  {
    id: "samosa",
    name: "Samosa Rain Alert",
    tier: "closed",
    year: "2026",
    role: "For the office",
    lede: {
      client: "A bot that tells the office when it is about to rain, so someone can propose samosas in time.",
      recruiter: "Small scheduled service. Cross-checks several weather sources and posts to Slack.",
      engineer:
        "Hourly multi-source rain check for a one-to-six pm window over Johar Town, Lahore. One source is a guess; three sources agreeing is a forecast.",
    },
    stack: ["JavaScript", "Node.js", "Slack API", "Cron"],
  },
];

/** Grouped honestly by how often it is actually in my hands. */
export const stackGroups: { label: string; note: string; items: string[] }[] = [
  {
    label: "Daily",
    note: "In my hands most days",
    items: ["TypeScript", "Node.js", "Express", "Prisma", "PostgreSQL", "Next.js", "React", "Tailwind"],
  },
  {
    label: "Regular",
    note: "Reached for when the work calls for them",
    items: ["Redis", "Socket.IO", "Bull", "Stripe", "Redux", "ChromaDB", "Docker", "AWS S3", "Zod"],
  },
  {
    label: "Working knowledge",
    note: "Shipped with them, would not call myself a specialist",
    items: ["Supabase", "GitHub Actions", "Vercel", "Python", "Figma"],
  },
];

export const meta = {
  /** Under ~60 characters so Google shows it whole; name first, because the
   *  highest-intent search for a portfolio is the person's own name. */
  title: "Ammaad Tehseen — Full-stack Engineer, Lahore",
  description:
    "Muhammad Ammaad Tehseen is a full-stack engineer in Lahore, Pakistan working in TypeScript, Node.js, Next.js, Prisma and PostgreSQL. Billing lifecycles, RAG pipelines, real-time systems, and the admin tooling that keeps them honest.",
};
