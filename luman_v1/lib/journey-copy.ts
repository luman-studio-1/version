/**
 * Single source of truth for the journey's 5 zones of content — relocated
 * from story-scroll-section.tsx (which now also imports this so the fallback
 * path and the 3D journey never drift out of sync), not rewritten.
 */

export interface GridItem {
  label: string;
  detail: string;
}

export interface ZoneCopy {
  eyebrow: string;
  headline: string[];
  body: string;
  grid?: GridItem[];
}

export const questions: GridItem[] = [
  { label: "01", detail: "What are you trying to achieve?" },
  { label: "02", detail: "What problems are preventing that?" },
  { label: "03", detail: "Who are your users or customers?" },
  { label: "04", detail: "What does your current workflow look like?" },
  { label: "05", detail: "What constraints exist?" },
  { label: "06", detail: "What would success look like?" },
];

export const disciplines: GridItem[] = [
  {
    label: "Digital Experiences",
    detail:
      "Websites, e-commerce, booking platforms, mobile apps — UX research, UI design, and the SEO/GEO work that gets them found.",
  },
  {
    label: "Business Systems",
    detail:
      "Custom software, internal portals, CRMs, dashboards, and AI-powered automation built around how your team actually works.",
  },
  {
    label: "Creative Production",
    detail:
      "3D visualization, CGI, motion graphics, and video — from product animation to full campaign production.",
  },
  {
    label: "Strategy & Consultation",
    detail:
      "Creative direction, UX and accessibility audits, production planning, and the technology consulting that ties it together.",
  },
];

export const process: GridItem[] = [
  {
    label: "01 — Understand",
    detail: "We start with your goals, constraints, and budget — not a menu of services.",
  },
  {
    label: "02 — Recommend",
    detail:
      "One intentional plan spanning strategy, design, technology, and production — only what the problem calls for.",
  },
  {
    label: "03 — Build",
    detail: "One collaborative team executes end to end, so nothing gets lost between vendors.",
  },
  {
    label: "04 — Partner",
    detail:
      "We stay on for optimization and growth. We'd rather be a long-term partner than a short-term vendor.",
  },
];

export const journeyZones: ZoneCopy[] = [
  {
    eyebrow: "01 — Who we are",
    headline: ["Understand", "First.", "Build Right."],
    body: "Luman Studio is a multidisciplinary agency working across strategy, design, technology, and creative production. We don't ask which service you need — we ask what you're trying to achieve, then determine the best solution.",
  },
  {
    eyebrow: "02 — The philosophy",
    headline: ["Problems First.", "Deliverables", "Second."],
    body: "Every engagement starts with the same questions. Only once we understand the answers do we recommend a solution — and only then does it become a website, a piece of software, an automation, a film, or some combination of all four.",
    grid: questions,
  },
  {
    eyebrow: "03 — What we do",
    headline: ["Four", "Disciplines.", "One Team."],
    body: "Technology and creativity aren't separate offerings — they're complementary tools we use to reach a business outcome. Most engagements draw from more than one discipline at once.",
    grid: disciplines,
  },
  {
    eyebrow: "04 — How we work",
    headline: ["Consult.", "Recommend.", "Build."],
    body: "Rather than forcing clients into predefined packages, we shape each engagement around their goals, constraints, and budget — then stay involved as those things change.",
    grid: process,
  },
  {
    eyebrow: "05 — Start here",
    headline: ["Tell Us", "The Problem."],
    body: "No service menu to pick from — describe your goals and constraints, and we'll recommend the right combination of strategy, design, technology, and production to get there.",
  },
];
