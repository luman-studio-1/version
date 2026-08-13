import FlowArt, { FlowSection, MaskedHeading } from "@/components/ui/story-scroll";

const disciplines = [
  {
    name: "Digital Experiences",
    detail:
      "Websites, e-commerce, booking platforms, mobile apps — UX research, UI design, and the SEO/GEO work that gets them found.",
  },
  {
    name: "Business Systems",
    detail:
      "Custom software, internal portals, CRMs, dashboards, and AI-powered automation built around how your team actually works.",
  },
  {
    name: "Creative Production",
    detail:
      "3D visualization, CGI, motion graphics, and video — from product animation to full campaign production.",
  },
  {
    name: "Strategy & Consultation",
    detail:
      "Creative direction, UX and accessibility audits, production planning, and the technology consulting that ties it together.",
  },
];

const questions = [
  "What are you trying to achieve?",
  "What problems are preventing that?",
  "Who are your users or customers?",
  "What does your current workflow look like?",
  "What constraints exist?",
  "What would success look like?",
];

const process = [
  {
    step: "01 — Understand",
    detail:
      "We start with your goals, constraints, and budget — not a menu of services.",
  },
  {
    step: "02 — Recommend",
    detail:
      "One intentional plan spanning strategy, design, technology, and production — only what the problem calls for.",
  },
  {
    step: "03 — Build",
    detail:
      "One collaborative team executes end to end, so nothing gets lost between vendors.",
  },
  {
    step: "04 — Partner",
    detail:
      "We stay on for optimization and growth. We'd rather be a long-term partner than a short-term vendor.",
  },
];

const headlineClass =
  "text-[clamp(3rem,10vw,10rem)] font-bold leading-[0.88] uppercase tracking-tight";
const eyebrowClass = "font-mono text-xs font-bold uppercase tracking-[0.2em]";
const bodyClass =
  "font-serif text-[clamp(1.05rem,2.4vw,1.9rem)] font-normal italic leading-relaxed";

function Divider() {
  return <div data-flow-divider aria-hidden className="h-px w-full origin-left bg-current/30" />;
}

export default function StoryScrollSection() {
  return (
    <FlowArt aria-label="How Luman Studio works">
      <FlowSection
        aria-label="Who we are"
        index="01"
        style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
      >
        <p data-flow-eyebrow className={eyebrowClass}>
          01 — Who we are
        </p>
        <Divider />
        <MaskedHeading as="h1" className={headlineClass} lines={["Understand", "First.", "Build Right."]} />
        <Divider />
        <p data-flow-copy className={`mt-auto max-w-[50ch] ${bodyClass}`}>
          Luman Studio is a multidisciplinary agency working across strategy, design,
          technology, and creative production. We don&apos;t ask which service you need —
          we ask what you&apos;re trying to achieve, then determine the best solution.
        </p>
      </FlowSection>

      <FlowSection
        aria-label="Our philosophy"
        index="02"
        style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
      >
        <p data-flow-eyebrow className={eyebrowClass}>
          02 — The philosophy
        </p>
        <Divider />
        <MaskedHeading
          className={headlineClass}
          lines={["Problems First.", "Deliverables", "Second."]}
        />
        <Divider />
        <p data-flow-copy className={`max-w-[50ch] ${bodyClass}`}>
          Every engagement starts with the same questions. Only once we understand the
          answers do we recommend a solution — and only then does it become a website, a
          piece of software, an automation, a film, or some combination of all four.
        </p>
        <Divider />
        <div className="grid grid-cols-2 gap-x-[3vw] gap-y-[2.5vw] sm:grid-cols-3">
          {questions.map((q, i) => (
            <div
              key={q}
              data-flow-item
              className="group border-t border-current/20 pt-3 transition-colors duration-500 hover:border-current/60"
            >
              <p className="mb-1.5 font-mono text-[0.65rem] font-bold tracking-[0.15em] opacity-50 transition-opacity duration-500 group-hover:opacity-90">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="text-[clamp(0.9rem,1.4vw,1.15rem)] leading-relaxed opacity-80 transition-opacity duration-500 group-hover:opacity-100">
                {q}
              </p>
            </div>
          ))}
        </div>
      </FlowSection>

      <FlowSection
        aria-label="What we do"
        index="03"
        style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}
      >
        <p data-flow-eyebrow className={eyebrowClass}>
          03 — What we do
        </p>
        <Divider />
        <MaskedHeading className={headlineClass} lines={["Four", "Disciplines.", "One Team."]} />
        <Divider />
        <p data-flow-copy className={`max-w-[50ch] ${bodyClass}`}>
          Technology and creativity aren&apos;t separate offerings — they&apos;re
          complementary tools we use to reach a business outcome. Most engagements draw
          from more than one discipline at once.
        </p>
        <Divider />
        <div className="flex flex-wrap gap-x-[3vw] gap-y-[2.5vw]">
          {disciplines.map((d, i) => (
            <div
              key={d.name}
              data-flow-item
              className="group min-w-[220px] flex-1 border-t border-current/20 pt-4 transition-colors duration-500 hover:border-[var(--accent)]"
            >
              <p className="mb-2 font-mono text-xs font-bold tracking-wider opacity-50 transition-opacity duration-500 group-hover:opacity-100">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mb-2 text-sm font-bold uppercase tracking-wider">{d.name}</p>
              <p className="font-serif text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                {d.detail}
              </p>
            </div>
          ))}
        </div>
      </FlowSection>

      <FlowSection
        aria-label="How we work"
        index="04"
        style={{ backgroundColor: "var(--secondary)", color: "var(--secondary-foreground)" }}
      >
        <p data-flow-eyebrow className={eyebrowClass}>
          04 — How we work
        </p>
        <Divider />
        <MaskedHeading className={headlineClass} lines={["Consult.", "Recommend.", "Build."]} />
        <Divider />
        <p data-flow-copy className={`max-w-[50ch] ${bodyClass}`}>
          Rather than forcing clients into predefined packages, we shape each engagement
          around their goals, constraints, and budget — then stay involved as those
          things change.
        </p>
        <Divider />
        <div className="flex flex-wrap gap-x-[3vw] gap-y-[2.5vw]">
          {process.map((p) => {
            const [num, label] = p.step.split(" — ");
            return (
              <div
                key={p.step}
                data-flow-item
                className="group min-w-[200px] flex-1 border-t border-current/20 pt-4 transition-colors duration-500 hover:border-[var(--accent)]"
              >
                <p className="mb-2 font-mono text-xs font-bold tracking-wider opacity-50 transition-opacity duration-500 group-hover:opacity-100">
                  {num}
                </p>
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">{label}</p>
                <p className="font-serif text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-80">
                  {p.detail}
                </p>
              </div>
            );
          })}
        </div>
      </FlowSection>

      <FlowSection
        aria-label="Start a conversation"
        index="05"
        style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
      >
        <p data-flow-eyebrow className={eyebrowClass}>
          05 — Start here
        </p>
        <Divider />
        <MaskedHeading className={headlineClass} lines={["Tell Us", "The Problem."]} />
        <Divider />
        <p data-flow-copy className={`mt-auto max-w-[50ch] ${bodyClass}`}>
          No service menu to pick from — describe your goals and constraints, and
          we&apos;ll recommend the right combination of strategy, design, technology,
          and production to get there.
        </p>
      </FlowSection>
    </FlowArt>
  );
}
