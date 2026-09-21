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
  role: "Full-stack & AI engineer",
  discipline: "AI & automation engineering · backend systems",
  location: "Lahore, Pakistan",
  timezone: "Asia/Karachi",
  /** Shown as a live LED in the hero + contact. */
  available: true,
  availableNote: "Taking freelance projects",
  email: "ammadtehseenkhan@gmail.com",
  /** Click-to-chat. International format, digits only. */
  whatsapp: { number: "923046249904", display: "+92 304 6249904" },
  /** 30-minute intro call. */
  booking: "https://calendly.com/ammadtehseenkhan/30min",
  /** 4:5 portrait served from /public. Also the Person image in structured data. */
  photo: {
    src: "/ammaad-tehseen.jpg",
    width: 960,
    height: 1200,
    alt: "Muhammad Ammaad Tehseen",
  },
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
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/muhammadammaadtehseen",
      handle: "in/muhammadammaadtehseen",
    },
  ],
};

/** Employment. Kept factual — this is the section a recruiter scans first. */
export const experience = [
  {
    role: "Full-Stack Developer (MERN / Next.js)",
    org: "Hashlogics",
    location: "Lahore, Pakistan",
    period: "Nov 2024 — present",
    points: [
      "Deliver multiple concurrent client projects end to end, owning architecture, development and client communication from planning through deployment.",
      "Architect and ship scalable multi-tenant applications on MERN and Next.js, integrating 20+ third-party services.",
      "Build AI automation and RAG systems with OpenAI, LangChain and n8n to cut manual work out of client operations.",
      "Integrate complex external platforms — Google (Calendar, Sheets, Docs, Ads), Meta, GoHighLevel, Next Health, Skribble, Abacus, Gravity Forms and Typeform.",
    ],
  },
  {
    role: "React JS Developer",
    org: "TECXRA",
    location: "Lahore, Pakistan",
    period: "Mar 2024 — Sep 2024",
    points: [
      "Developed and maintained full-stack applications on MERN and Next.js.",
      "Built a real-time e-commerce platform with WebSocket-driven live product updates and JWT/OAuth authentication.",
      "Resolved cross-stack defects to improve stability and performance.",
    ],
  },
];

export const education = {
  degree: "BSc Information Technology (BSIT)",
  org: "GCS — affiliated with the University of Punjab",
  period: "2020 — 2024",
};

/** The About page. Longer form than the home page's three-channel bio. */
export const about = {
  lede: "I build the half of a product that has to keep working after launch.",
  body: [
    "Most of what I ship is not the screen you see. It is the subscription that renews correctly at 3am, the webhook that arrives twice and only counts once, the migration that runs against a database nobody can afford to reset, the queue that quietly retries until the email actually lands. That work is invisible when it goes right and extremely visible when it does not.",
    "I work across the whole stack because the interesting bugs live in the seams. A billing edge case is a product decision, a database constraint and a UI state at the same time — splitting that across three people mostly produces three partial answers. Being able to follow a problem from a button through an API and a queue down to a row is the point.",
  ],
  approach: [
    {
      title: "The boring layers, on purpose",
      body: "Repository and service split, validation at every boundary, one transport per concern, observers instead of edits scattered through call sites. None of it is clever. It is what makes the clever parts survivable six months later.",
    },
    {
      title: "Instrument it before you need it",
      body: "Logging every send, mirroring the billing lifecycle into a table you can query, deriving activity from real connections rather than a field someone forgot to update. When something breaks at 3am, the difference between a five-minute fix and a five-hour one is whether you can see what happened.",
    },
    {
      title: "Production is not a staging environment",
      body: "Hand-written idempotent migrations, changes that can be rolled forward, and a healthy suspicion of anything that only works because the data happens to be clean today.",
    },
  ],
  now: [
    "Full-stack developer at Hashlogics, delivering client platforms end to end across coliving, healthcare and education.",
    "Building AI-augmented products: RAG assistants, automated email engines, and n8n pipelines that turn meetings into assigned work.",
    "Taking freelance projects — SaaS builds, AI features, automation and rescues of existing apps — remote, across any timezone.",
  ],
};

/** The Contact page. */
export const contact = {
  lede: "Tell me what is breaking, or what you want built.",
  body: "I read everything and reply to anything specific — by email, on WhatsApp, or on a 30-minute call if talking it through is easier.",
  helpful: [
    "What the thing does, and who it is for",
    "Where it is stuck — a bug, a rebuild, a feature nobody has time for, or a blank page",
    "Roughly when you need it, and whether there is a budget",
    "A link to the code, the product, or a screenshot — anything concrete beats a description",
  ],
  honest: [
    "If it is a two-week project and I cannot do it justice, I will say so rather than take it.",
    "If you need a designer more than an engineer, I will tell you that too.",
  ],
};

/** The bio, told three ways. Same person, three depths. */
export const bio: Record<Channel, { lede: string; body: string }> = {
  client: {
    lede: "I build the software your business actually runs on.",
    body:
      "SaaS platforms, AI features that do real work, and automation that takes the busywork off your team. Subscriptions that bill correctly, email that reaches people, dashboards that tell you the truth. I take a product from an idea to something live, then keep it alive — and you get one person accountable for the whole stack instead of a handoff between three.",
  },
  recruiter: {
    lede: "Full-stack developer, two years shipping production platforms on MERN and Next.js.",
    body:
      "Currently at Hashlogics, delivering client platforms end to end — architecture, build and client communication. Next.js and React on the front; Node, Express and Prisma over PostgreSQL, plus Supabase, on the back. The specialism is AI-powered products and workflow automation: RAG assistants, OpenAI pipelines and multi-tenant SaaS, with integration work across Stripe, Mailgun and twenty-odd third-party services.",
  },
  engineer: {
    lede: "I like the parts that page you at 3am.",
    body:
      "Webhook idempotency. Migration drift on a database you cannot reset. An N+1 hiding behind a nice-looking repository method. A require cycle that only bites standalone scripts. I write the boring layers deliberately — repository and service split, Zod at every boundary, one transport for email, observer taps rather than call-site edits — because that is what makes the interesting layers survivable.",
  },
};

/** Runs in the capability band. Keep them short and physical. */
export const capabilities = [
  "AI agents & assistants",
  "Workflow automation",
  "API design",
  "Database schema & migrations",
  "Payments & billing lifecycles",
  "Real-time systems",
  "Retrieval / RAG pipelines",
  "Background jobs & scheduling",
  "Admin & analytics tooling",
  "Email infrastructure",
  "Next.js product UI",
  "Security & access testing",
];

/** What a client can hire me for. Each one points at the work that proves it. */
export const services: { title: string; body: string; proof: string[] }[] = [
  {
    title: "SaaS & web apps",
    body: "From first version to production: multi-tenant platforms with auth, billing, dashboards and the admin tools behind them.",
    proof: ["tomodomo", "go-lancer", "insyteiq"],
  },
  {
    title: "AI features & agents",
    body: "Assistants, report generation, retrieval over your own data — AI that does real work inside the product, with the guardrails production needs.",
    proof: ["oncology-trial-matcher", "algoricum", "ai-meeting-platform"],
  },
  {
    title: "Automation & integrations",
    body: "n8n workflows and the glue between CRMs, Stripe, Google, Zoom and WhatsApp, so work moves on its own instead of being copied by hand.",
    proof: ["meeting-automation", "discover-live", "employee-milestones"],
  },
  {
    title: "Rescue & maintenance",
    body: "Take over an existing app, find what is fragile, fix it and keep it running — security and access testing included.",
    proof: ["company-erp", "ai-meeting-platform", "tomodomo"],
  },
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

/**
 * How much of the site a project gets.
 *   showcase — its own page, a place in the /work index, a diagram
 *   short    — its own page, but listed as a card rather than in the index
 * Anything smaller goes in `alsoBuilt` and gets one line, no page.
 */
export type Depth = "showcase" | "short";

export type Project = {
  id: string;
  name: string;
  tier: Tier;
  depth: Depth;
  /** In the home page reel. Keep it to about eight so the reel stays tight. */
  featured?: boolean;
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
   Every client name and link here was cleared project by project.
   Anything not cleared carries no name and no link, and is described
   only by what the product does and how it fits together.

   Where a stack lists capabilities or integrations rather than
   frameworks, that is deliberate: it names only what is true of the
   product, never a framework it was not built with.
   ------------------------------------------------------------------ */

export const projects: Project[] = [
  /* ============================ featured ============================ */
  {
    id: "tomodomo",
    name: "TomoDomo — Coliving Operations Platform",
    tier: "live",
    depth: "showcase",
    featured: true,
    year: "2025",
    role: "Tech lead · Hashlogics",
    lede: {
      client:
        "The operating system for a Swiss coliving operator running eight communities — intake, booking, contracts, residency and checkout unified in one platform.",
      recruiter:
        "Led architecture and delivery. React and TypeScript on Vite over Supabase — Postgres with row-level security, around 45 edge functions and 125 migrations — integrated with Stripe, Skribble, Abacus, Wix, Calendly, VideoAsk, Jira and Google Sheets.",
      engineer:
        "The resident lifecycle is a forward-only state machine with server-validated transitions, advanced by a daily multi-pass cron for time-based events, with a dedicated webhook endpoint per integration.",
    },
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Supabase",
      "PostgreSQL",
      "Row-Level Security",
      "Edge Functions",
      "Stripe",
      "Skribble",
      "Abacus (OData)",
      "Redux Toolkit",
      "React Query",
      "Vitest",
      "i18n",
    ],
    links: [{ label: "Live", href: "https://hub.tomodomo.ch" }],
    outcomes: [
      "Eight communities running on one system instead of scattered tools",
      "Booking fees taken by Stripe, contracts signed through Skribble",
      "Recurring invoicing and finance kept in step with Abacus",
      "Intake automated across Wix, VideoAsk, Calendly, Jira and Google Sheets",
    ],
    internals: [
      "Resident lifecycle modelled as a forward-only state machine — applicant, approved, pre-check-in, post-check-in, resident, former resident — validated server-side, so no client can skip a step",
      "A daily multi-pass cron advances time-based events: move-in and move-out, room changes, contract extensions",
      "One webhook endpoint per integration rather than a shared handler, so a failing partner never takes the others down",
      "Passwordless magic-link auth, with roles kept in their own table and enforced by row-level security rather than the UI",
      "125 migrations and 31 test files keep a live platform changeable",
    ],
    flow: {
      nodes: [
        { id: "intake", label: "Intake", sub: "Wix · VideoAsk", col: 1, row: 1, kind: "edge" },
        { id: "spa", label: "React SPA", sub: "TypeScript", col: 1, row: 2, kind: "edge" },
        { id: "edge", label: "Edge Functions", sub: "Supabase", col: 2, row: 2, kind: "service" },
        { id: "cron", label: "Daily cron", sub: "multi-pass", col: 3, row: 3, kind: "worker" },
        { id: "pg", label: "Postgres", sub: "row-level security", col: 4, row: 2, kind: "store" },
        { id: "store", label: "Storage", sub: "contracts", col: 4, row: 1, kind: "store" },
        {
          id: "partners",
          label: "Stripe · Skribble",
          sub: "Abacus (OData)",
          col: 3,
          row: 1,
          kind: "edge",
        },
      ],
      edges: [
        { from: "intake", to: "edge", label: "webhook" },
        { from: "spa", to: "edge", label: "rpc" },
        { from: "edge", to: "pg" },
        { from: "edge", to: "store", label: "files" },
        { from: "edge", to: "cron", label: "schedule" },
        { from: "cron", to: "pg", dashed: true },
        { from: "partners", to: "edge", label: "events" },
      ],
    },
  },
  {
    id: "oncology-trial-matcher",
    name: "Oncology Trial Matcher",
    tier: "closed",
    depth: "showcase",
    featured: true,
    year: "2026",
    role: "Full-stack developer · Hashlogics",
    lede: {
      client:
        "Matches cancer patients to the clinical trials that actually fit them, then writes the report a clinician, nurse or insurer needs — with the compliance a healthcare product has to carry.",
      recruiter:
        "Full-stack on a HIPAA-grade oncology platform: NestJS, Prisma and Postgres behind a React and TypeScript front end, with BullMQ report queues, Socket.IO, S3 and Stripe. Also ran the platform's compliance programme in Sprinto.",
      engineer:
        "ClinicalTrials.gov returns anything that mentions the words, so a custom ranker re-scores the results on token-level cancer, biomarker and gene-symbol matches and the patient-relevant trials surface first.",
    },
    stack: [
      "NestJS",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "BullMQ + Redis",
      "Socket.IO",
      "React",
      "LLM (Fireworks AI)",
      "ClinicalTrials.gov API",
      "AWS S3",
      "Stripe",
      "Paubox",
      "Sentry",
      "Docker",
      "Sprinto",
    ],
    outcomes: [
      "Patients matched to open trials by cancer type, stage, biomarkers and line of therapy",
      "AI reports with NCCN guideline summaries and drug-efficacy context, delivered as PDFs",
      "Separate portals for patients, nurses, insurers and admins — including bulk report runs for insurers",
      "Compliance handled end to end: audit logs, two-factor auth, encrypted email and a Sprinto-run programme",
    ],
    internals: [
      "Relevance ranking over ClinicalTrials.gov v2 at token level, so “lung” matches “non-small cell lung cancer” but not “plunge”",
      "Report generation runs on a BullMQ queue, with progress pushed to the browser over Socket.IO",
      "Every LLM call goes through a circuit breaker, streams where it can and logs its token cost; system prompts are versioned in the database",
      "De-identified patient profiles kept apart from identified ones, and every sensitive action written to an audit log",
      "TOTP two-factor auth, HIPAA-compliant email through Paubox, presigned S3 uploads, helmet and rate limiting on the API",
    ],
    flow: {
      nodes: [
        { id: "portals", label: "Role portals", sub: "patient · insurer", col: 1, row: 2, kind: "edge" },
        { id: "api", label: "NestJS API", sub: "2FA · rate limits", col: 2, row: 2, kind: "service" },
        { id: "trials", label: "Trial registry", sub: "ClinicalTrials.gov", col: 3, row: 1, kind: "edge" },
        { id: "queue", label: "Report queue", sub: "BullMQ · Redis", col: 3, row: 2, kind: "worker" },
        { id: "pg", label: "Postgres", sub: "Prisma · audit log", col: 3, row: 3, kind: "store" },
        { id: "llm", label: "LLM", sub: "NCCN · drug match", col: 4, row: 2, kind: "worker" },
        { id: "pdf", label: "PDF report", sub: "Socket.IO status", col: 5, row: 2, kind: "edge" },
      ],
      edges: [
        { from: "portals", to: "api", label: "REST" },
        { from: "api", to: "trials", label: "search" },
        { from: "api", to: "queue" },
        { from: "api", to: "pg", label: "audit" },
        { from: "trials", to: "llm", label: "ranked" },
        { from: "queue", to: "llm" },
        { from: "llm", to: "pdf" },
      ],
    },
  },
  {
    id: "discover-live",
    name: "Discover Live — Live Virtual Tour Platform",
    tier: "live",
    depth: "showcase",
    featured: true,
    year: "2026",
    role: "Full-stack developer",
    lede: {
      client:
        "Live virtual tours where a real local guide walks a city on camera and the audience steers — with an AI travel companion and captions translated live into 18 languages.",
      recruiter:
        "Full-stack on a Zoom-style tour platform of around 61,000 lines: Next.js 15, React 19 and Convex over the Zoom Video SDK, with Gemini for the AI companion and live translation, and S3 and Google Cloud Run in the recording pipeline.",
      engineer:
        "Live caption translation takes a reserve, apply, release lock on each segment, so a hundred viewers reading the same language trigger one translation rather than a hundred.",
    },
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Convex",
      "Zoom Video SDK",
      "Gemini 2.5 Flash",
      "Supabase Auth",
      "AWS S3",
      "Google Cloud Run",
      "next-intl (18 locales)",
      "OpenStreetMap + Wikidata",
    ],
    links: [{ label: "Live", href: "https://marketplace.discover.live/" }],
    outcomes: [
      "Guided tours streamed live, with pins, raised hands, reactions and quiz leaderboards",
      "Adora, an AI travel companion that answers questions during the tour",
      "Captions and chat translated live across 18 languages",
      "Every tour recorded and archived automatically once it ends",
    ],
    internals: [
      "One Zoom provider assembled from nine domain hooks — session, media, participants, captions, commands, screen share, recording, quality and extras",
      "Pins, raised hands, reactions and quiz leaderboards ride Zoom's command channel rather than the database",
      "Points of interest come from a durable workflow — fetch, clean, enrich, cache — warmed up to six hours before a tour starts",
      "When a tour ends its recording is polled from Zoom's cloud and handed to a Cloud Run job for upload",
      "Tour data is server-rendered first, then kept live by Convex subscriptions",
    ],
    flow: {
      nodes: [
        { id: "guide", label: "Local guide", sub: "live on camera", col: 1, row: 1, kind: "edge" },
        { id: "viewers", label: "Viewers", sub: "18 languages", col: 1, row: 3, kind: "edge" },
        { id: "zoom", label: "Zoom Video SDK", sub: "9 domain hooks", col: 2, row: 2, kind: "service" },
        { id: "convex", label: "Convex", sub: "live tour state", col: 3, row: 2, kind: "store" },
        { id: "gemini", label: "Gemini", sub: "Adora · captions", col: 4, row: 1, kind: "worker" },
        { id: "poi", label: "POI workflow", sub: "OSM · Wikidata", col: 4, row: 3, kind: "worker" },
        { id: "rec", label: "Recordings", sub: "Cloud Run → S3", col: 5, row: 2, kind: "edge" },
      ],
      edges: [
        { from: "guide", to: "zoom", label: "stream" },
        { from: "viewers", to: "zoom", label: "join" },
        { from: "zoom", to: "convex" },
        { from: "convex", to: "gemini", label: "translate" },
        { from: "convex", to: "poi", label: "warm-up" },
        { from: "convex", to: "rec", label: "tour ends" },
      ],
    },
  },
  {
    id: "algoricum",
    name: "Algoricum — AI Lead Conversion for Clinics",
    tier: "live",
    depth: "showcase",
    featured: true,
    year: "2025",
    role: "Full-stack developer · Hashlogics",
    lede: {
      client:
        "Captures, nurtures and converts patient leads with no manual follow-up, and answers patient questions around the clock. HIPAA-compliant, with a BAA and data-use consent.",
      recruiter:
        "Next.js 15 over Supabase — Postgres and around thirty edge functions — pulling leads from CRMs, ad platforms and form tools, with OpenAI Assistants, Mailgun email, Twilio SMS and Stripe billing.",
      engineer:
        "Per-clinic addresses on wildcard subdomains with SPF, DKIM and DMARC; inbound-parse webhooks; AI-drafted replies routed back to the clinic that owns the thread.",
    },
    stack: [
      "Next.js 15",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Edge Functions",
      "OpenAI Assistants",
      "Mailgun",
      "Twilio",
      "Stripe",
      "HubSpot",
      "Pipedrive",
      "GoHighLevel",
      "Meta Lead Ads",
      "SonarQube",
    ],
    links: [{ label: "Live", href: "https://algoricum.hashlogics.com" }],
    outcomes: [
      "Leads answered without anyone at the clinic touching an inbox",
      "Nurture sequences of up to 35 SMS and email steps",
      "An embedded assistant that answers questions and books consultations around the clock",
      "Self-serve onboarding: booking-link validation, branded booking pages, CSV import",
    ],
    internals: [
      "Wildcard subdomains give every clinic its own address, with SPF, DKIM and DMARC set per domain",
      "Inbound-parse webhooks feed replies to the assistant and route the answer back to the right clinic",
      "Subdomain warm-up, because a cold domain sending 35-step sequences lands in spam",
      "A dozen lead sources normalised behind one lead shape — HubSpot, Pipedrive, GoHighLevel, NextHealth, Meta and Google lead forms, Gravity Forms, Calendly, Jotform, Typeform",
      "One edge function per job — ingestion, nurture follow-ups, SMS processing, payment reminders, Stripe webhooks",
    ],
    flow: {
      nodes: [
        { id: "ads", label: "Lead sources", sub: "ads · forms", col: 1, row: 1, kind: "edge" },
        { id: "crm", label: "CRMs", sub: "HubSpot · GHL", col: 1, row: 3, kind: "edge" },
        { id: "api", label: "Edge Functions", sub: "Supabase", col: 2, row: 2, kind: "service" },
        { id: "ai", label: "OpenAI", sub: "Assistants API", col: 3, row: 1, kind: "worker" },
        { id: "mail", label: "Mailgun · Twilio", sub: "email · SMS", col: 3, row: 3, kind: "service" },
        { id: "db", label: "Leads", sub: "state + consent", col: 4, row: 2, kind: "store" },
        { id: "patient", label: "Patient", sub: "replies in", col: 5, row: 3, kind: "edge" },
      ],
      edges: [
        { from: "ads", to: "api", label: "oauth" },
        { from: "crm", to: "api", label: "rest" },
        { from: "api", to: "db" },
        { from: "api", to: "ai", label: "context" },
        { from: "ai", to: "mail", label: "reply" },
        { from: "mail", to: "patient", label: "send" },
        { from: "patient", to: "mail", label: "inbound" },
      ],
    },
  },
  {
    id: "insyteiq",
    name: "InsyteIQ — AI Pricing Reports for Real Estate",
    tier: "live",
    depth: "showcase",
    featured: true,
    year: "2026",
    role: "Full-stack developer",
    lede: {
      client:
        "A real estate agent enters an address and, in under 45 seconds, gets a report that defends the listing price to the seller. Not a CMA, not an appraisal — a pricing defensibility system.",
      recruiter:
        "Full-stack on an AI SaaS for US real estate agents: a fifteen-module OpenAI pipeline, PDF rendering through PDFMonkey templates, Stripe subscriptions across three tiers, SendGrid email and Chart.js dashboards.",
      engineer:
        "One AI run, two renders: the agent's full analysis and a sanitised client version are built from the same result, so the two can never disagree about the numbers.",
    },
    stack: ["OpenAI", "PDFMonkey", "Handlebars templates", "Stripe subscriptions", "SendGrid", "Chart.js"],
    links: [{ label: "Live", href: "https://insyteiq.ai/" }],
    outcomes: [
      "A pricing report from a single address in under 45 seconds",
      "Fifteen analysis modules: market response, pricing and valuation, price-path scenarios, a seller stress test",
      "A client-ready PDF for the listing appointment, plus the agent's full internal version",
      "A confidence level that tells the agent exactly what would raise it",
      "Three subscription tiers, from five reports a month to unlimited",
    ],
    internals: [
      "Each report snapshots the agent's tier when it is created, so a plan change mid-cycle never rewrites a finished report",
      "The client render is stripped of the internal analysis before it is generated, never hidden with styling",
      "Report limits are metered per billing cycle against the tier, straight from the Stripe subscription",
    ],
    flow: {
      nodes: [
        { id: "market", label: "Market data", sub: "comps · scenarios", col: 1, row: 1, kind: "edge" },
        { id: "agent", label: "Agent", sub: "enters an address", col: 1, row: 2, kind: "edge" },
        { id: "stripe", label: "Stripe", sub: "tier · limits", col: 1, row: 3, kind: "edge" },
        { id: "pipeline", label: "AI pipeline", sub: "15 modules", col: 2, row: 2, kind: "worker" },
        { id: "report", label: "Report", sub: "one run · <45s", col: 3, row: 2, kind: "store" },
        { id: "render", label: "PDFMonkey", sub: "Handlebars", col: 4, row: 2, kind: "service" },
        { id: "agentpdf", label: "Agent PDF", sub: "full analysis", col: 5, row: 1, kind: "edge" },
        { id: "clientpdf", label: "Client PDF", sub: "sanitised", col: 5, row: 3, kind: "edge" },
      ],
      edges: [
        { from: "market", to: "pipeline", label: "comps" },
        { from: "agent", to: "pipeline" },
        { from: "stripe", to: "pipeline", label: "tier" },
        { from: "pipeline", to: "report" },
        { from: "report", to: "render" },
        { from: "render", to: "agentpdf", label: "agent" },
        { from: "render", to: "clientpdf", label: "client" },
      ],
    },
  },
  {
    id: "ai-meeting-platform",
    name: "AI Meeting Management Platform",
    tier: "closed",
    depth: "showcase",
    featured: true,
    year: "2025",
    role: "Tech lead · Hashlogics",
    lede: {
      client:
        "One workspace for a team's meetings — scheduling, agendas, minutes and attendance — with AI that turns every Zoom or Google Meet call into a summary and action items.",
      recruiter:
        "Tech lead on a multi-tenant meeting SaaS integrating Zoom, Google Meet and WhatsApp. Owned the AI features and the Google integrations, and maintained the platform in production.",
      engineer:
        "The assistant's first output is a decision, not an action: does this conversation need a meeting at all, or just an email? Only a meeting goes on to scheduling and the call providers.",
    },
    stack: ["Zoom", "Google Meet", "Google Workspace APIs", "WhatsApp", "LLMs", "Multi-tenant SaaS"],
    outcomes: [
      "Summaries, notes and action items produced from Zoom and Google Meet calls",
      "An AI assistant that decides whether a conversation needs a meeting or just an email",
      "Meetings scheduled and participants notified through WhatsApp groups and messages",
      "Polls before, during and after a meeting, and analytics on how meetings perform",
    ],
    flow: {
      nodes: [
        { id: "team", label: "Team", sub: "web workspace", col: 1, row: 2, kind: "edge" },
        { id: "assistant", label: "AI assistant", sub: "meeting or email?", col: 2, row: 2, kind: "worker" },
        { id: "email", label: "Email", sub: "no meeting needed", col: 3, row: 1, kind: "edge" },
        { id: "scheduler", label: "Scheduler", sub: "agendas · polls", col: 3, row: 2, kind: "service" },
        { id: "whatsapp", label: "WhatsApp", sub: "notifications", col: 4, row: 1, kind: "edge" },
        { id: "calls", label: "Zoom · Meet", sub: "video calls", col: 4, row: 2, kind: "edge" },
        { id: "workspace", label: "Workspace", sub: "per organisation", col: 4, row: 3, kind: "store" },
        { id: "minutes", label: "AI minutes", sub: "summary · actions", col: 5, row: 2, kind: "worker" },
      ],
      edges: [
        { from: "team", to: "assistant" },
        { from: "assistant", to: "scheduler" },
        { from: "assistant", to: "email", label: "or email" },
        { from: "scheduler", to: "whatsapp", label: "notify" },
        { from: "scheduler", to: "calls" },
        { from: "scheduler", to: "workspace", label: "attendance" },
        { from: "calls", to: "minutes" },
      ],
    },
  },
  {
    id: "go-lancer",
    name: "Go Lancer — Freelance Business Workspace",
    tier: "live",
    depth: "showcase",
    featured: true,
    year: "2026",
    role: "Full-stack developer · Hashlogics",
    lede: {
      client:
        "One workspace that runs a freelance business — clients, projects, time tracking, invoices and payment reminders — instead of five tools that never agree.",
      recruiter:
        "Full-stack on a freelancer SaaS with users in 30+ countries: Google sign-in, Google Calendar bookings, Stripe payments, invoicing with reminders, and a dashboard with a live activity feed.",
      engineer:
        "The dashboard is the product: active projects, hours this week, tasks due and outstanding invoices counted live, with every invoice sent and payment received landing in one activity feed.",
    },
    stack: ["Google Sign-In", "Google Calendar", "Stripe", "Time tracking", "Invoicing", "Bookings"],
    links: [{ label: "Live", href: "https://golancer.io" }],
    outcomes: [
      "Clients, projects, time logs and invoices in one place",
      "Invoices and payment reminders that go out without anyone chasing",
      "Meetings booked straight into Google Calendar",
      "One-click Google sign-up and a seven-day free trial",
    ],
    flow: {
      nodes: [
        { id: "freelancer", label: "Freelancer", sub: "Google sign-in", col: 1, row: 2, kind: "edge" },
        { id: "workspace", label: "Workspace", sub: "projects · time", col: 2, row: 2, kind: "service" },
        { id: "calendar", label: "Google Calendar", sub: "bookings", col: 3, row: 1, kind: "edge" },
        { id: "invoices", label: "Invoices", sub: "auto reminders", col: 3, row: 2, kind: "service" },
        { id: "feed", label: "Activity feed", sub: "live dashboard", col: 3, row: 3, kind: "store" },
        { id: "stripe", label: "Stripe", sub: "payments", col: 4, row: 2, kind: "edge" },
        { id: "client", label: "Client", sub: "pays online", col: 5, row: 2, kind: "edge" },
      ],
      edges: [
        { from: "freelancer", to: "workspace" },
        { from: "workspace", to: "calendar", label: "book" },
        { from: "workspace", to: "invoices" },
        { from: "workspace", to: "feed", label: "log" },
        { from: "invoices", to: "stripe" },
        { from: "stripe", to: "client" },
      ],
    },
  },
  {
    id: "meeting-automation",
    name: "Little Tree Confections — Meeting-to-Task Automation",
    tier: "closed",
    depth: "showcase",
    featured: true,
    year: "2025",
    role: "Automation engineer · Hashlogics",
    lede: {
      client:
        "Every recorded meeting turns itself into assigned, prioritised tasks, and the CEO starts each day with a dashboard that is already current — no note-taking, no task entry.",
      recruiter:
        "n8n workflows for a confectionery company: an AI agent on GPT-5.1 and GPT-4.1 turns meeting data into structured tasks across ClickUp and Notion, with a daily CEO dashboard and deadline alerts.",
      engineer:
        "The agent returns structured output, not prose, so every downstream node parses instead of guessing; a daily sync rebuilds the CEO's view from every ClickUp task he owns, is mentioned in or has commented on — subtasks included.",
    },
    stack: [
      "n8n",
      "OpenAI (GPT-5.1, GPT-4.1, GPT-4o-mini)",
      "LangChain agent",
      "ClickUp API",
      "Notion API",
      "Webhooks",
      "Cron",
      "SMTP",
    ],
    outcomes: [
      "No note-taking or task entry after a meeting",
      "Every action item lands in the right department list with an owner, a due date and a link back to the meeting notes",
      "A CEO dashboard rebuilt every morning, sorted into what to do first and what to schedule",
      "Overdue and due-within-72-hours reminders emailed to every task owner",
    ],
    internals: [
      "A structured-output parser on the AI agent, so the task list is data the next node can trust",
      "Tasks fan out to department lists, the CEO master list and the project list, each back-linked to its Notion meeting page",
      "The daily scan finds CEO-related work by assignment, mention or unresolved comment across every ClickUp space, subtasks included",
      "Summaries written by GPT-4o-mini in batches, with retries and pauses to stay inside rate limits",
      "Any workflow failure routes to a global error handler — silent automation failure is worse than no automation",
    ],
    flow: {
      nodes: [
        { id: "meeting", label: "Meeting", sub: "recorded", col: 1, row: 2, kind: "edge" },
        { id: "agent", label: "AI agent", sub: "GPT-5.1 · JSON", col: 2, row: 2, kind: "worker" },
        { id: "notion", label: "Notion", sub: "meeting pages", col: 3, row: 1, kind: "store" },
        { id: "clickup", label: "ClickUp", sub: "dept · CEO lists", col: 3, row: 2, kind: "store" },
        { id: "daily", label: "Daily scan", sub: "CEO-related tasks", col: 4, row: 2, kind: "worker" },
        { id: "dashboard", label: "CEO dashboard", sub: "Eisenhower view", col: 5, row: 1, kind: "edge" },
        { id: "owners", label: "Task owners", sub: "72h email alerts", col: 5, row: 3, kind: "edge" },
      ],
      edges: [
        { from: "meeting", to: "agent" },
        { from: "agent", to: "notion", label: "pages" },
        { from: "agent", to: "clickup", label: "tasks" },
        { from: "clickup", to: "daily" },
        { from: "daily", to: "dashboard", label: "rebuild" },
        { from: "daily", to: "owners", label: "remind" },
      ],
    },
  },

  /* ======================== further showcases ======================= */
  {
    id: "imanly",
    name: "Imanly — Islamic Lifestyle Platform",
    tier: "live",
    depth: "showcase",
    year: "2025",
    role: "Full-stack developer",
    lede: {
      client:
        "A faith app that turns daily practice into progress — points, streaks and tiers — with tutors to learn from and halal matchmaking built in.",
      recruiter:
        "Full-stack on a gamified Islamic lifestyle platform: a points and streak engine with tier progression, a tutor and digital-product marketplace, and matchmaking with verified, private profiles.",
      engineer:
        "Three products under one account — learn, grow, connect — sharing one points economy, with a daily cap so progress rewards consistency rather than a single binge.",
    },
    stack: [
      "Points & streaks",
      "Tier progression",
      "Tutor marketplace",
      "Digital products",
      "Matchmaking",
      "Verified profiles",
    ],
    links: [{ label: "Live", href: "https://imanly.app" }],
    outcomes: [
      "Iman points, daily streaks and tiers that reward showing up every day",
      "A marketplace to find a tutor or start teaching, plus digital products",
      "Halal matchmaking in a private, verified environment",
    ],
    flow: {
      nodes: [
        { id: "member", label: "Member", sub: "one account", col: 1, row: 2, kind: "edge" },
        { id: "learn", label: "Learn", sub: "tutors · products", col: 2, row: 1, kind: "service" },
        { id: "grow", label: "Grow", sub: "deeds · streaks", col: 2, row: 2, kind: "service" },
        { id: "connect", label: "Connect", sub: "halal matching", col: 2, row: 3, kind: "service" },
        { id: "market", label: "Marketplace", sub: "teach · sell", col: 3, row: 1, kind: "store" },
        { id: "points", label: "Points engine", sub: "daily cap · tiers", col: 3, row: 2, kind: "store" },
        { id: "verify", label: "Verification", sub: "private profiles", col: 3, row: 3, kind: "worker" },
      ],
      edges: [
        { from: "member", to: "learn" },
        { from: "member", to: "grow" },
        { from: "member", to: "connect" },
        { from: "learn", to: "market" },
        { from: "grow", to: "points" },
        { from: "connect", to: "verify" },
      ],
    },
  },
  {
    id: "ethergreen",
    name: "EtherGreen — ESG Performance Platform",
    tier: "closed",
    depth: "showcase",
    year: "2025",
    role: "Full-stack developer",
    lede: {
      client:
        "Companies measure, manage and improve their ESG performance in one place — an overall score, their carbon footprint, and how close each certification is to audit.",
      recruiter:
        "Full-stack on a bilingual (English and Spanish) ESG platform: scoring across environmental, social and governance pillars, carbon accounting, certification readiness and trend dashboards.",
      engineer:
        "Pillar scores, carbon footprint and certification readiness sit on one dashboard, tracked month on month, with a performance radar showing which area is holding the score back.",
    },
    stack: ["ESG scoring", "Carbon accounting", "Certification tracking", "Data visualisation", "i18n (EN / ES)"],
    outcomes: [
      "An overall ESG score with its month-on-month change",
      "Carbon footprint tracked in tonnes of CO₂e per year",
      "Certifications tracked through to audit readiness",
      "Environmental, social and governance scores compared month by month",
    ],
    flow: {
      nodes: [
        { id: "data", label: "Company data", sub: "E · S · G inputs", col: 1, row: 2, kind: "edge" },
        { id: "carbon", label: "Carbon", sub: "t CO₂e per year", col: 2, row: 1, kind: "worker" },
        { id: "scoring", label: "ESG scoring", sub: "three pillars", col: 2, row: 2, kind: "worker" },
        { id: "certs", label: "Certifications", sub: "audit readiness", col: 2, row: 3, kind: "service" },
        { id: "dash", label: "Dashboard", sub: "score · trends", col: 3, row: 2, kind: "edge" },
      ],
      edges: [
        { from: "data", to: "carbon" },
        { from: "data", to: "scoring" },
        { from: "data", to: "certs" },
        { from: "carbon", to: "dash" },
        { from: "scoring", to: "dash" },
        { from: "certs", to: "dash" },
      ],
    },
  },
  {
    id: "employee-milestones",
    name: "Employee Milestones & Gifting Platform",
    tier: "closed",
    depth: "showcase",
    year: "2025",
    role: "Tech lead · Hashlogics",
    lede: {
      client:
        "HR teams never miss a birthday or work anniversary again. It tracks every milestone, reminds them in time, and sends a real printed card or a gift to the person's home.",
      recruiter:
        "Tech lead on a multi-tenant SaaS for HR and office teams in Europe — team import, email and calendar reminders, and physical cards and gifts sent on time. Owned the Google integrations and ongoing maintenance.",
      engineer:
        "The hard part is data nobody keeps current: dates imported once, home addresses kept up to date by the employees themselves, and every send held for review until a team turns on auto-send.",
    },
    stack: [
      "Google APIs",
      "Email & calendar reminders",
      "Print & mail fulfilment",
      "Company registry data",
      "Bulk import",
      "Multi-tenant SaaS",
    ],
    outcomes: [
      "Birthdays and work anniversaries tracked automatically, plus moments like a new baby, a permanent contract or a house move",
      "Employees add their own home address, so a card reaches the right door",
      "Every card and gift can be reviewed, edited or stopped before it ships — or sent automatically",
      "Client relationships covered too: partnership and company anniversaries, and a key contact's birthday",
    ],
    flow: {
      nodes: [
        { id: "employees", label: "Employees", sub: "add own address", col: 1, row: 1, kind: "edge" },
        { id: "hr", label: "HR team", sub: "one-time import", col: 1, row: 2, kind: "edge" },
        { id: "registry", label: "Trade register", sub: "company dates", col: 1, row: 3, kind: "edge" },
        { id: "people", label: "People & dates", sub: "home addresses", col: 2, row: 2, kind: "store" },
        { id: "scheduler", label: "Scheduler", sub: "upcoming moments", col: 3, row: 2, kind: "worker" },
        { id: "reminder", label: "Reminder", sub: "email · calendar", col: 4, row: 1, kind: "edge" },
        { id: "review", label: "Review", sub: "or auto-send", col: 4, row: 2, kind: "service" },
        { id: "card", label: "Printed card", sub: "stamped · posted", col: 5, row: 2, kind: "edge" },
        { id: "gift", label: "Gift", sub: "delivered home", col: 5, row: 3, kind: "edge" },
      ],
      edges: [
        { from: "hr", to: "people" },
        { from: "employees", to: "people", label: "address" },
        { from: "registry", to: "people", label: "clients" },
        { from: "people", to: "scheduler" },
        { from: "scheduler", to: "reminder", label: "notify" },
        { from: "scheduler", to: "review" },
        { from: "review", to: "card" },
        { from: "review", to: "gift", label: "or gift" },
      ],
    },
  },
  {
    id: "lumaya",
    name: "Lumaya — Swiss Business Marketplace",
    tier: "live",
    depth: "showcase",
    year: "2025",
    role: "Full-stack developer · Hashlogics",
    lede: {
      client:
        "A two-sided marketplace for buying and selling Swiss SMEs — vetted listings, anonymised public previews, and confidential detail released only to verified buyers under NDA.",
      recruiter:
        "Next.js and TypeScript on Vercel. Searchable listings, separate buyer and seller journeys, multi-stage buyer vetting, multi-language support and scheduling.",
      engineer:
        "The interesting constraint is disclosure: a listing has a public face and a confidential one, and the gate between them is NDA status rather than a UI toggle.",
    },
    stack: ["Next.js", "TypeScript", "Vercel", "i18n", "Google Tag Manager", "Lemcal"],
    links: [{ label: "Live", href: "https://lumaya.ch" }],
    outcomes: [
      "Sellers list without exposing their business publicly",
      "Buyers are vetted in stages before confidential detail unlocks",
      "Multi-language, with scheduling and analytics wired in",
    ],
    flow: {
      nodes: [
        { id: "seller", label: "Seller", sub: "lists privately", col: 1, row: 2, kind: "edge" },
        { id: "listing", label: "Listing", sub: "anonymised preview", col: 2, row: 2, kind: "store" },
        { id: "buyer", label: "Buyer", sub: "vetted in stages", col: 2, row: 3, kind: "edge" },
        { id: "gate", label: "NDA gate", sub: "signed NDA", col: 3, row: 2, kind: "service" },
        { id: "full", label: "Full listing", sub: "verified buyers", col: 4, row: 2, kind: "edge" },
      ],
      edges: [
        { from: "seller", to: "listing" },
        { from: "listing", to: "gate" },
        { from: "buyer", to: "gate", label: "vetting" },
        { from: "gate", to: "full", label: "unlock" },
      ],
    },
  },
  {
    id: "company-erp",
    name: "Company ERP — Security Audit & AI Notetaker",
    tier: "closed",
    depth: "showcase",
    year: "2025 — now",
    role: "Security auditor & developer",
    lede: {
      client:
        "An internal operations platform tested the way an attacker would test it — and a meeting notetaker rolled out to every team in the company.",
      recruiter:
        "Security auditor and black-box tester across the ERP's whole role-based access model; also integrated Fireflies as the company-wide AI notetaker, organised by team.",
      engineer:
        "Black-box and role by role, with no source access: I found three separate paths from a standard account to admin.",
    },
    stack: ["Black-box testing", "Role-based access control", "Privilege escalation", "Fireflies"],
    outcomes: [
      "Every role tested for what it could reach that it should not",
      "Three privilege-escalation paths to admin found before anyone else found them",
      "Meeting notes captured automatically across the company through Fireflies",
    ],
    internals: [
      "Tested from the outside only — what a real user or attacker would see, nothing more",
      "Role boundaries probed across every screen and action, not just the ones the UI offers",
    ],
    flow: {
      nodes: [
        { id: "user", label: "Standard account", sub: "black-box", col: 1, row: 2, kind: "edge" },
        { id: "roles", label: "Role checks", sub: "every screen", col: 2, row: 2, kind: "service" },
        { id: "admin", label: "Admin", sub: "reached 3 times", col: 3, row: 1, kind: "edge" },
        { id: "meetings", label: "Meetings", sub: "every team", col: 1, row: 3, kind: "edge" },
        { id: "fireflies", label: "Fireflies", sub: "AI notetaker", col: 2, row: 3, kind: "worker" },
        { id: "notes", label: "Meeting notes", sub: "by team", col: 3, row: 3, kind: "store" },
      ],
      edges: [
        { from: "user", to: "roles" },
        { from: "roles", to: "admin", label: "escalated", dashed: true },
        { from: "meetings", to: "fireflies" },
        { from: "fireflies", to: "notes" },
      ],
    },
  },
  {
    id: "kennel-ops",
    name: "Kennel Operations Platform",
    tier: "live",
    depth: "showcase",
    year: "2025",
    role: "Full-stack developer · Hashlogics",
    lede: {
      client:
        "Runs a protection-dog kennel day to day: every dog, kennel and staff member, with activity check-ins, missed activities flagged, health reports and analytics.",
      recruiter:
        "Full-stack on an internal operations app for a protection-dog breeder: dog and kennel records, staff check-in and check-out per activity, health reporting, analytics and an activity log.",
      engineer:
        "Every activity is logged against a dog, a staff member and a time, so “missed” is computed from what did not happen rather than reported by anyone.",
    },
    stack: ["Role-based access", "Check-in / check-out", "Health records", "Analytics", "Activity log"],
    links: [
      {
        label: "Internal app — no custom domain",
        href: "https://dog-kennels.bubbleapps.io/version-test/",
      },
    ],
    outcomes: [
      "All dogs, kennels and staff in one system",
      "Daily activities checked in and out per dog, with missed ones flagged",
      "Health reports on every dog",
      "Analytics and a full activity log for the owner",
    ],
    flow: {
      nodes: [
        { id: "staff", label: "Staff", sub: "check in · out", col: 1, row: 1, kind: "edge" },
        { id: "dogs", label: "Dogs", sub: "kennel assigned", col: 1, row: 3, kind: "edge" },
        { id: "activity", label: "Activity log", sub: "who · what · when", col: 2, row: 2, kind: "service" },
        { id: "health", label: "Health reports", sub: "per dog", col: 3, row: 1, kind: "store" },
        { id: "missed", label: "Missed check", sub: "flags gaps", col: 3, row: 3, kind: "worker" },
        { id: "analytics", label: "Analytics", sub: "owner dashboard", col: 4, row: 2, kind: "edge" },
      ],
      edges: [
        { from: "staff", to: "activity" },
        { from: "dogs", to: "activity" },
        { from: "activity", to: "health" },
        { from: "activity", to: "missed" },
        { from: "activity", to: "analytics", label: "counts" },
        { from: "missed", to: "analytics" },
      ],
    },
  },
  {
    id: "case-study-generator",
    name: "AI Case Study Generator",
    tier: "closed",
    depth: "showcase",
    year: "2024",
    role: "Full-stack developer · Hashlogics",
    lede: {
      client:
        "Generated complete EPSO-style case-study exercises for EU civil-service exam practice — the scenario and its documents — delivered as a finished document.",
      recruiter:
        "Full-stack on an AI case-study generator built on OpenAI's Assistants API, with an assistant seeded from a library of past case studies. The product has since been retired.",
      engineer:
        "Generation was a conversation, not a single prompt: each case study opened a thread, was refined over several turns against the seeded library, then finalised into a document.",
    },
    stack: ["OpenAI Assistants API", "Assistant threads", "Seeded example library", "Document export"],
    outcomes: [
      "Complete EPSO-style case studies generated on demand",
      "Grounded in a library of real past exercises rather than written from nothing",
      "Delivered as a finished document",
    ],
    flow: {
      nodes: [
        { id: "library", label: "Case library", sub: "past exercises", col: 1, row: 1, kind: "store" },
        { id: "request", label: "Request", sub: "new case study", col: 1, row: 2, kind: "edge" },
        { id: "assistant", label: "Assistant", sub: "OpenAI Assistants", col: 2, row: 2, kind: "worker" },
        { id: "thread", label: "Thread", sub: "multi-turn refine", col: 3, row: 2, kind: "service" },
        { id: "doc", label: "Document", sub: "final export", col: 4, row: 2, kind: "edge" },
      ],
      edges: [
        { from: "library", to: "assistant", label: "seeded" },
        { from: "request", to: "assistant" },
        { from: "assistant", to: "thread" },
        { from: "thread", to: "doc" },
      ],
    },
  },
  {
    id: "ai-labs",
    name: "AI-Augmented Learning Platform",
    tier: "closed",
    depth: "showcase",
    year: "2026 — now",
    role: "Full-stack developer",
    lede: {
      client:
        "A learning platform where members take AI courses, ask an assistant trained on the whole course library, earn certificates, and talk to each other in one community.",
      recruiter:
        "Next.js 14 front end and a Node/Express API over Prisma and Postgres. RAG assistant, Stripe subscriptions, real-time community, certificates, and the admin analytics behind them.",
      engineer:
        "Express API with a repository/service split over Prisma and Postgres. Redis carries presence and caching, ChromaDB carries retrieval, Bull carries anything scheduled, Socket.IO carries the live surface.",
    },
    stack: [
      "Next.js 14",
      "TypeScript",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
      "OpenAI",
      "LangChain",
      "ChromaDB",
      "Redis + Bull",
      "Socket.IO",
      "Stripe",
      "AWS S3/CloudFront",
      "Docker",
      "Sentry",
      "Cypress",
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
        { id: "web", label: "Next.js 14", sub: "app router", col: 1, row: 2, kind: "edge" },
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

  /* ========================== short entries ========================= */
  {
    id: "destiny-ai",
    name: "Destiny AI — Inventory Forecasting",
    tier: "closed",
    depth: "short",
    year: "2025",
    role: "Full-stack developer",
    lede: {
      client:
        "Stock that manages itself: it forecasts demand, says what to reorder and when, and answers questions about the inventory in plain English.",
      recruiter:
        "Full-stack on an AI inventory manager: demand forecasting from sales history, reorder suggestions and low-stock alerts, a chat over inventory data, and AI-written reports.",
      engineer:
        "Reorder suggestions carry a quantity and a date, not just a low-stock warning — the forecast is what decides both.",
    },
    stack: ["Demand forecasting", "Reorder engine", "LLM chat", "AI reports"],
    outcomes: [
      "Demand forecast from sales history",
      "What to restock, when, and how much — with low-stock alerts",
      "Ask the inventory questions in plain English",
      "AI-written reports on trends, dead stock and best sellers",
    ],
  },
  {
    id: "jarvis",
    name: "Jarvis — Accountability Bot",
    tier: "open",
    depth: "short",
    year: "2026",
    role: "Solo build",
    lede: {
      client: "A bot that keeps me honest about what I am learning — and does it in public.",
      recruiter: "Self-hosted Telegram accountability bot in TypeScript, storing progress in DynamoDB and deployed on AWS.",
      engineer: "Telegram updates in, progress stored in DynamoDB, running on AWS — built to run unattended.",
    },
    stack: ["TypeScript", "Telegram Bot API", "DynamoDB", "AWS"],
    links: [{ label: "Source", href: "https://github.com/MAmmaadTehseen/jarvis" }],
  },
  {
    id: "ai-manager",
    name: "Cross-Department Early Warning System",
    tier: "closed",
    depth: "short",
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
        { id: "tools", label: "Work tools", sub: "chat · tickets", col: 1, row: 2, kind: "edge" },
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
    depth: "short",
    year: "2026",
    role: "Solo build",
    lede: {
      client: "Follow the Pakistan Stock Exchange without opening five tabs.",
      recruiter: "TypeScript app tracking PSX market data. Public source.",
      engineer:
        "A scheduled fetch normalised into a queryable series, with the display layer kept deliberately dumb.",
    },
    stack: ["TypeScript", "Next.js", "Scheduled jobs"],
    links: [
      { label: "Live", href: "https://psx-tracker-eight.vercel.app" },
      { label: "Source", href: "https://github.com/MAmmaadTehseen/psx-tracker" },
    ],
  },
  {
    id: "namaz-reminder",
    name: "Namaz Reminder",
    tier: "open",
    depth: "short",
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
    depth: "short",
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
    tier: "open",
    depth: "short",
    year: "2026",
    role: "Full-stack developer",
    lede: {
      client:
        "A clothing label's storefront — catalogue, collections and checkout, built to be run by the people who own it.",
      recruiter: "Client e-commerce build in TypeScript and Next.js, storefront through to admin.",
      engineer:
        "Catalogue and cart resolved on the server, so a price is never something the browser gets to decide.",
    },
    stack: ["TypeScript", "Next.js", "React", "Tailwind"],
    links: [
      { label: "Live", href: "https://closet-by-junassan.vercel.app" },
      { label: "Source", href: "https://github.com/MAmmaadTehseen/closet-by-junassan" },
    ],
  },
];

/** One line each, no page: real work, too small or too private for more. */
export const alsoBuilt: { name: string; note: string }[] = [
  { name: "Event Snapshot", note: "QR-code event photo sales — guests scan, pay and download their photos" },
  { name: "Porta-cabin booking site", note: "Landing page, booking form and admin table for a luxury cabin rental" },
  { name: "Samosa Rain Alert", note: "Office bot that cross-checks three weather sources and posts to Slack before it rains" },
  { name: "em", note: "Minimal note-taking app for personal sensemaking — open source" },
];

// pure-annotated so a client bundle that never uses these can still drop the
// project data — a bare top-level call would pin all of it into every chunk
export const showcase = /* @__PURE__ */ projects.filter((project) => project.depth === "showcase");
export const featured = /* @__PURE__ */ projects.filter((project) => project.featured);
export const shortEntries = /* @__PURE__ */ projects.filter((project) => project.depth === "short");

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
    items: [
      "Supabase",
      "NestJS",
      "Convex",
      "OpenAI",
      "LangChain",
      "ChromaDB",
      "Redis + Bull",
      "Socket.IO",
      "Stripe",
      "Docker",
      "AWS S3 / CloudFront",
      "Redux Toolkit",
      "React Query",
      "Zod",
    ],
  },
  {
    label: "Working knowledge",
    note: "Shipped with them, would not call myself a specialist",
    items: [
      "n8n",
      "Zoom Video SDK",
      "Gemini",
      "Twilio",
      "MongoDB",
      "Mailgun",
      "Zustand",
      "shadcn/ui",
      "Cypress",
      "Sentry",
      "Vercel",
      "GitHub Actions",
    ],
  },
];

export const meta = {
  /** Under ~60 characters so Google shows it whole; name first, because the
   *  highest-intent search for a portfolio is the person's own name. */
  title: "Ammaad Tehseen — Full-stack & AI Engineer, Lahore",
  description:
    "Muhammad Ammaad Tehseen — full-stack and AI engineer in Lahore, Pakistan, taking freelance work. SaaS platforms, AI features and agents, workflow automation and app rescues, shipped to production for clients in healthcare, real estate, travel and more.",
};
