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
  role: "Full-stack developer",
  discipline: "AI & automation engineering · backend systems",
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
    "Open to contract and full-time work, remote, across any timezone.",
  ],
};

/** The Contact page. */
export const contact = {
  lede: "Tell me what is breaking, or what you want built.",
  body: "I read everything and reply to anything specific. Email is the surest route — I am not reliably on any other channel.",
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
      "Subscriptions that bill correctly. Email that reaches people. Dashboards that tell you the truth. I take a product from an idea to something live, then keep it alive — the unglamorous half most builds skip. You get one person accountable for the whole stack instead of a handoff between three.",
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
   Named client work comes from the CV, which already publishes these
   names and live URLs. Project years are inferred from the employment
   dates rather than stated per project on the CV — correct any that
   are wrong.
   ------------------------------------------------------------------ */

export const projects: Project[] = [
  {
    id: "tomodomo",
    name: "TomoDomo — Coliving Operations Platform",
    tier: "live",
    year: "2025",
    role: "Tech lead · Hashlogics",
    lede: {
      client:
        "The operating system for a Swiss coliving operator running eight communities — intake, booking, contracts, residency and checkout unified in one platform.",
      recruiter:
        "Led architecture and delivery. React + TypeScript SPA on Supabase Edge Functions over Postgres with row-level security, plus Stripe, Skribble e-signature and Abacus CRM over OData.",
      engineer:
        "The resident lifecycle is a forward-only state machine with server-validated transitions, advanced by a daily multi-pass cron for time-based events, with a dedicated webhook endpoint per integration.",
    },
    stack: [
      "React",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Row-Level Security",
      "Stripe",
      "Skribble",
      "Abacus (OData)",
      "Redux",
      "React Query",
      "SendGrid",
      "Jira",
    ],
    links: [{ label: "Live", href: "https://hub.tomodomo.ch" }],
    outcomes: [
      "Eight communities running on one system instead of scattered tools",
      "Booking fees taken by Stripe, contracts signed through Skribble",
      "Recurring invoicing and CRM kept in step with Abacus over OData",
      "Intake automated across Wix, VideoAsk, Calendly, Jira, SendGrid and Google Sheets",
    ],
    internals: [
      "Resident lifecycle modelled as a forward-only state machine — transitions are validated server-side, so no client can skip a step",
      "A daily multi-pass cron advances time-based events: move-in and move-out, room changes, contract extensions",
      "One webhook endpoint per integration rather than a shared handler, so a failing partner never takes the others down",
      "Passwordless magic-link auth with a role hierarchy enforced by row-level security, not by the UI",
      "Per-community configuration flags decide which integrations are live for whom",
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
    id: "algoricum",
    name: "Algoricum — AI Lead Conversion for Clinics",
    tier: "live",
    year: "2025",
    role: "Full-stack developer · Hashlogics",
    lede: {
      client:
        "Captures, nurtures and converts patient leads with no manual follow-up, and answers patient questions around the clock. HIPAA-compliant, with a BAA and data-use consent.",
      recruiter:
        "Node.js platform pulling 10+ lead sources from CRMs, ad platforms and form tools over OAuth and REST, with a two-way email engine built on Mailgun and OpenAI.",
      engineer:
        "Per-clinic addresses on wildcard subdomains with SPF, DKIM and DMARC; inbound-parse webhooks; OpenAI-drafted replies routed back to the clinic that owns the thread.",
    },
    stack: [
      "Node.js",
      "OpenAI",
      "Mailgun",
      "OAuth",
      "REST",
      "HubSpot",
      "Pipedrive",
      "Meta Lead Ads",
      "Google Lead Ads",
      "Stripe",
    ],
    links: [{ label: "Live", href: "https://algoricum.hashlogics.com" }],
    outcomes: [
      "Leads answered without anyone at the clinic touching an inbox",
      "Nurture sequences up to 35 SMS and email steps",
      "An embedded assistant that answers questions and books consultations 24/7",
      "Self-serve onboarding: booking-link validation, branded booking pages, CSV import",
    ],
    internals: [
      "Wildcard subdomains give every clinic its own address, with SPF/DKIM/DMARC set per domain",
      "Inbound-parse webhooks feed replies to OpenAI and route the answer back to the right clinic",
      "Subdomain warm-up, because a cold domain sending 35-step sequences lands in spam",
      "10+ sources normalised behind one lead shape — HubSpot, Pipedrive, Meta, Google, Jotform, Typeform",
    ],
    flow: {
      nodes: [
        {
          id: "ads",
          label: "Lead sources",
          sub: "Meta · Google · forms",
          col: 1,
          row: 1,
          kind: "edge",
        },
        { id: "crm", label: "CRMs", sub: "HubSpot · Pipedrive", col: 1, row: 3, kind: "edge" },
        { id: "api", label: "Node API", sub: "normalise", col: 2, row: 2, kind: "service" },
        { id: "ai", label: "OpenAI", sub: "drafts replies", col: 3, row: 1, kind: "worker" },
        { id: "mail", label: "Mailgun", sub: "inbound parse", col: 3, row: 3, kind: "service" },
        { id: "db", label: "Leads", sub: "state + consent", col: 4, row: 2, kind: "store" },
        { id: "patient", label: "Patient", sub: "email · SMS", col: 5, row: 3, kind: "edge" },
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
    id: "ai-labs",
    name: "R&D AI Labs — AI-Augmented LMS",
    tier: "live",
    year: "2024 — now",
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
    links: [{ label: "Live", href: "https://labs.firstmovers.ai" }],
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
  {
    id: "meeting-automation",
    name: "Meeting-to-Task Automation",
    tier: "closed",
    year: "2025",
    role: "Automation engineer · Hashlogics",
    lede: {
      client:
        "Recorded meetings become classified, assigned tasks on their own, and the CEO dashboard stays in sync — no note-taking, no task entry.",
      recruiter:
        "Five interconnected n8n workflows chaining transcription to OpenAI classification, then to ClickUp and Notion, with a daily summary cron and Slack error routing.",
      engineer:
        "Structured JSON output classifies every action item by Eisenhower priority, department, assignee, due date and CEO relevance. The Notion and ClickUp sync is bidirectional on a 60-second loop with loop-prevention guards.",
    },
    stack: ["n8n", "OpenAI", "Lindy AI", "ClickUp API", "Notion API", "Slack", "Webhooks", "Cron"],
    outcomes: [
      "No manual note-taking or task entry after a meeting",
      "Every action item lands with a priority, an owner and a due date",
      "A CEO dashboard that is current rather than reconstructed weekly",
    ],
    internals: [
      "Bidirectional Notion and ClickUp sync every 60 seconds, with guards so an echo does not become an infinite loop",
      "Classification returns structured JSON rather than prose, so downstream steps parse instead of guess",
      "Tasks fan out to department lists, a CEO master list and the project list, back-linked to the Notion meeting page",
      "A global error handler routes any workflow failure to Slack — silent automation failure is worse than no automation",
    ],
    flow: {
      nodes: [
        { id: "meeting", label: "Meeting", sub: "recorded", col: 1, row: 2, kind: "edge" },
        { id: "lindy", label: "Lindy AI", sub: "transcription", col: 2, row: 2, kind: "service" },
        { id: "ai", label: "OpenAI", sub: "classify to JSON", col: 3, row: 2, kind: "worker" },
        { id: "clickup", label: "ClickUp", sub: "tasks", col: 4, row: 1, kind: "store" },
        { id: "notion", label: "Notion", sub: "meeting pages", col: 4, row: 3, kind: "store" },
        { id: "slack", label: "Slack", sub: "errors · alerts", col: 5, row: 2, kind: "edge" },
      ],
      edges: [
        { from: "meeting", to: "lindy" },
        { from: "lindy", to: "ai", label: "transcript" },
        { from: "ai", to: "clickup", label: "tasks" },
        { from: "ai", to: "notion", label: "pages" },
        { from: "clickup", to: "notion", label: "60s sync", dashed: true },
        { from: "ai", to: "slack", label: "digest" },
      ],
    },
  },
  {
    id: "lumaya",
    name: "Lumaya — Swiss Business Marketplace",
    tier: "live",
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
        {
          id: "tools",
          label: "Work tools",
          sub: "chat · tickets · CRM",
          col: 1,
          row: 2,
          kind: "edge",
        },
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
    tier: "open",
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
      engineer:
        "An editor is only as good as its data model — flat notes with links beat folders every time.",
    },
    stack: ["TypeScript", "Next.js", "React"],
    links: [{ label: "Source", href: "https://github.com/MAmmaadTehseen/em" }],
  },
  {
    id: "samosa",
    name: "Samosa Rain Alert",
    tier: "closed",
    year: "2026",
    role: "For the office",
    lede: {
      client:
        "A bot that tells the office when it is about to rain, so someone can propose samosas in time.",
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
    items: [
      "Supabase",
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
  title: "Ammaad Tehseen — Full-stack Engineer, Lahore",
  description:
    "Muhammad Ammaad Tehseen — full-stack developer and AI automation engineer in Lahore, Pakistan. Two years shipping production platforms on MERN and Next.js: RAG assistants, multi-tenant SaaS, billing lifecycles and workflow automation.",
};
