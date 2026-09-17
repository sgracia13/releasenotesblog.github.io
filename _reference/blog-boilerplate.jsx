/* ============================================================================
 * RELEASE NOTES — a neobrutalism blog boilerplate
 * ----------------------------------------------------------------------------
 * Single-file React starter styled after neobrutalism.dev (shadcn/ui based).
 *
 * HOW TO USE THIS AS A BOILERPLATE
 * 1. The primitives in section 2 intentionally match the neobrutalism.dev
 *    component names and sub-component structure (Card/CardHeader/CardTitle,
 *    Attachment/AttachmentMedia/AttachmentContent, etc). When you're ready to
 *    use the real library, run:
 *        pnpm dlx shadcn@latest add https://neobrutalism.dev/r/card.json
 *        pnpm dlx shadcn@latest add https://neobrutalism.dev/r/attachment.json
 *        ...etc
 *    then delete section 2 and import from '@/components/ui/*'. The page code
 *    in sections 4-6 should keep working as-is.
 * 2. Section 1 is the design token layer. It uses the same CSS variable names
 *    neobrutalism.dev uses (--main, --bg, --bw, --border, --shadow) so your
 *    theme survives the swap. Change --main to rebrand the whole site.
 * 3. Section 3 is the fake CMS. Replace `POSTS` with your MDX/Contentlayer/
 *    Sanity/whatever loader. Keep the shape and nothing else breaks.
 * ==========================================================================*/

import { useState, useMemo, useEffect, useRef } from "react";

/* ============================================================================
 * 1. TOKENS
 * ----------------------------------------------------------------------------
 * Everything visual routes through these variables. Neobrutalism is mostly
 * three rules: a hard 2px black border, a solid offset shadow with no blur,
 * and flat saturated fills. Press states remove the shadow and translate the
 * element into the gap it leaves behind.
 * ==========================================================================*/

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');

.nb {
  --main: #ffdc58;        /* primary fill — change this to rebrand        */
  --accent: #88aaee;      /* secondary fill for tags + highlights          */
  --danger: #ff6b6b;
  --bg: #fef2e8;          /* page background                               */
  --bw: #ffffff;          /* card / surface background                     */
  --blank: #000000;       /* inverted surface                              */
  --border: #000000;
  --text: #000000;
  --mtext: #000000;       /* text that sits on top of --main               */
  --muted: #6b6b6b;
  --border-w: 2px;
  --radius: 6px;
  --shadow: 4px 4px 0px 0px var(--border);
  --shadow-sm: 2px 2px 0px 0px var(--border);
  --shadow-lg: 6px 6px 0px 0px var(--border);

  background: var(--bg);
  color: var(--text);
  font-family: 'Archivo', system-ui, -apple-system, sans-serif;
  min-height: 100%;
  -webkit-font-smoothing: antialiased;
}

.nb.dark {
  --bg: #272933;
  --bw: #212121;
  --blank: #ffffff;
  --text: #eeefe9;
  --muted: #a8a8a8;
}

.nb *, .nb *::before, .nb *::after { box-sizing: border-box; }
.nb p, .nb h1, .nb h2, .nb h3, .nb h4, .nb ul, .nb ol, .nb figure, .nb pre { margin: 0; }
.nb ul, .nb ol { padding-left: 1.25rem; }
.nb a { color: inherit; }

/* Focus is non-negotiable — keyboard users get the same hard outline. */
.nb :focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .nb * { transition: none !important; animation: none !important; }
}

/* --- Type scale ---------------------------------------------------------- */
.nb-display { font-size: clamp(2.5rem, 7vw, 4.5rem); font-weight: 900; line-height: 0.95; letter-spacing: -0.03em; }
.nb-h1 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; line-height: 1.05; letter-spacing: -0.02em; }
.nb-h2 { font-size: 1.5rem; font-weight: 800; line-height: 1.15; letter-spacing: -0.01em; }
.nb-h3 { font-size: 1.125rem; font-weight: 700; line-height: 1.25; }
.nb-body { font-size: 1.0625rem; line-height: 1.65; }
.nb-small { font-size: 0.8125rem; font-weight: 600; }
.nb-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.nb-muted { color: var(--muted); }

/* --- Button -------------------------------------------------------------- */
.nb-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.625rem 1.125rem;
  font-family: inherit; font-size: 0.9375rem; font-weight: 700;
  border: var(--border-w) solid var(--border);
  border-radius: var(--radius);
  background: var(--main); color: var(--mtext);
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease;
}
.nb-btn:hover { transform: translate(2px, 2px); box-shadow: var(--shadow-sm); }
.nb-btn:active { transform: translate(4px, 4px); box-shadow: none; }
.nb-btn[data-variant="neutral"] { background: var(--bw); color: var(--text); }
.nb-btn[data-variant="ghost"] { background: transparent; box-shadow: none; border-color: transparent; }
.nb-btn[data-variant="ghost"]:hover { background: var(--bw); border-color: var(--border); transform: none; box-shadow: var(--shadow-sm); }
.nb-btn[data-size="sm"] { padding: 0.375rem 0.75rem; font-size: 0.8125rem; }
.nb-btn[data-size="icon"] { padding: 0; width: 2.5rem; height: 2.5rem; }
.nb-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: var(--shadow); }

/* --- Card ---------------------------------------------------------------- */
.nb-card {
  background: var(--bw);
  border: var(--border-w) solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.nb-card[data-interactive="true"] { transition: transform 120ms ease, box-shadow 120ms ease; }
.nb-card[data-interactive="true"]:hover { transform: translate(-2px, -2px); box-shadow: var(--shadow-lg); }

/* --- Badge --------------------------------------------------------------- */
.nb-badge {
  display: inline-flex; align-items: center; gap: 0.25rem;
  padding: 0.1875rem 0.5rem;
  font-size: 0.75rem; font-weight: 700;
  border: var(--border-w) solid var(--border);
  border-radius: var(--radius);
  background: var(--accent); color: #000;
  cursor: pointer;
  font-family: inherit;
}
.nb-badge[data-active="true"] { background: var(--main); box-shadow: var(--shadow-sm); }

/* --- Input --------------------------------------------------------------- */
.nb-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-family: inherit; font-size: 0.9375rem; font-weight: 500;
  border: var(--border-w) solid var(--border);
  border-radius: var(--radius);
  background: var(--bw); color: var(--text);
  box-shadow: var(--shadow-sm);
}
.nb-input::placeholder { color: var(--muted); font-weight: 500; }

/* --- Attachment ---------------------------------------------------------- */
.nb-attachment {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.625rem;
  background: var(--bw);
  border: var(--border-w) solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  position: relative; overflow: hidden;
}
.nb-attachment[data-state="idle"] { border-style: dashed; box-shadow: none; background: transparent; }
.nb-attachment[data-state="error"] { background: var(--danger); color: #000; }
.nb-attachment[data-orientation="vertical"] { flex-direction: column; align-items: stretch; gap: 0.5rem; }
.nb-attachment-media {
  flex-shrink: 0; width: 2.75rem; height: 2.75rem;
  display: flex; align-items: center; justify-content: center;
  background: var(--main); color: #000;
  border: var(--border-w) solid var(--border);
  border-radius: 4px; overflow: hidden;
}
.nb-attachment[data-orientation="vertical"] .nb-attachment-media { width: 100%; height: 7rem; }
.nb-attachment-media img { width: 100%; height: 100%; object-fit: cover; }
.nb-attachment-content { min-width: 0; flex: 1; }
.nb-attachment-title { font-size: 0.875rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nb-attachment-desc { font-size: 0.75rem; font-weight: 500; color: var(--muted); }
.nb-attachment[data-state="error"] .nb-attachment-desc { color: #000; }
.nb-attachment-bar { position: absolute; left: 0; bottom: 0; height: 4px; background: var(--accent); border-top: 2px solid var(--border); }

/* --- Prose (post body) --------------------------------------------------- */
.nb-prose { max-width: 68ch; }
.nb-prose > * + * { margin-top: 1.25rem; }
.nb-prose h2 { font-size: 1.5rem; font-weight: 800; margin-top: 2.5rem; letter-spacing: -0.01em; }
.nb-prose p { font-size: 1.0625rem; line-height: 1.7; }
.nb-prose li { font-size: 1.0625rem; line-height: 1.7; margin-top: 0.5rem; }
.nb-prose blockquote {
  margin: 0; padding: 1rem 1.25rem;
  background: var(--main); color: var(--mtext);
  border: var(--border-w) solid var(--border); border-radius: var(--radius);
  box-shadow: var(--shadow); font-weight: 600; font-size: 1.0625rem;
}
.nb-prose pre {
  padding: 1rem; overflow-x: auto;
  background: #000; color: #f5f5f5;
  border: var(--border-w) solid var(--border); border-radius: var(--radius);
  box-shadow: var(--shadow);
  font-family: 'JetBrains Mono', monospace; font-size: 0.8125rem; line-height: 1.6;
}
.nb-prose code { font-family: 'JetBrains Mono', monospace; font-size: 0.9em; }
.nb-prose p code { background: var(--accent); color: #000; padding: 0.1em 0.35em; border-radius: 3px; border: 1px solid var(--border); }

/* --- Layout -------------------------------------------------------------- */
.nb-shell { max-width: 1120px; margin: 0 auto; padding: 0 1.25rem; }
.nb-grid { display: grid; grid-template-columns: minmax(0, 1fr) 20rem; gap: 2rem; align-items: start; }
.nb-sticky { position: sticky; top: 6rem; }
@media (max-width: 900px) {
  .nb-grid { grid-template-columns: minmax(0, 1fr); }
  .nb-sticky { position: static; }
}

/* Cover blocks: flat CSS patterns instead of stock photography. */
.nb-cover { height: 9rem; border-bottom: var(--border-w) solid var(--border); position: relative; }
.nb-cover[data-pattern="stripes"] { background-image: repeating-linear-gradient(45deg, var(--border) 0 8px, transparent 8px 20px); }
.nb-cover[data-pattern="dots"]    { background-image: radial-gradient(var(--border) 2.5px, transparent 2.6px); background-size: 18px 18px; }
.nb-cover[data-pattern="grid"]    { background-image: linear-gradient(var(--border) 2px, transparent 2px), linear-gradient(90deg, var(--border) 2px, transparent 2px); background-size: 24px 24px; }
.nb-cover[data-pattern="waves"]   { background-image: repeating-linear-gradient(-45deg, var(--border) 0 3px, transparent 3px 14px); }
`;

/* ============================================================================
 * 2. PRIMITIVES
 * ----------------------------------------------------------------------------
 * Drop-in stand-ins for the neobrutalism.dev registry components. Same names,
 * same composition model, so the page code below is portable.
 * ==========================================================================*/

function Button({ variant = "default", size, children, ...props }) {
  return (
    <button className="nb-btn" data-variant={variant} data-size={size} {...props}>
      {children}
    </button>
  );
}

function Card({ interactive, children, style, ...props }) {
  return (
    <div className="nb-card" data-interactive={interactive ? "true" : undefined} style={style} {...props}>
      {children}
    </div>
  );
}
const CardHeader = ({ children, style }) => <div style={{ padding: "1.25rem 1.25rem 0", ...style }}>{children}</div>;
const CardContent = ({ children, style }) => <div style={{ padding: "1.25rem", ...style }}>{children}</div>;
const CardFooter = ({ children, style }) => <div style={{ padding: "0 1.25rem 1.25rem", ...style }}>{children}</div>;
const CardTitle = ({ children }) => <h3 className="nb-h2">{children}</h3>;
const CardDescription = ({ children }) => <p className="nb-small nb-muted" style={{ marginTop: "0.375rem" }}>{children}</p>;

function Badge({ active, as = "span", children, ...props }) {
  const Tag = as;
  return <Tag className="nb-badge" data-active={active ? "true" : undefined} {...props}>{children}</Tag>;
}

const Input = (props) => <input className="nb-input" {...props} />;

function Avatar({ name, size = 40 }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  return (
    <div
      aria-hidden="true"
      style={{
        width: size, height: size, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--accent)", color: "#000",
        border: "var(--border-w) solid var(--border)", borderRadius: "999px",
        fontWeight: 900, fontSize: size * 0.36,
      }}
    >
      {initials}
    </div>
  );
}

/* --- Attachment ------------------------------------------------------------
 * Mirrors https://www.neobrutalism.dev/docs/attachment — including the `state`
 * prop (idle | uploading | processing | error | done) and the vertical variant.
 * -------------------------------------------------------------------------*/
function Attachment({ state = "done", orientation = "horizontal", progress = 0, children }) {
  return (
    <div className="nb-attachment" data-state={state} data-orientation={orientation}>
      {children}
      {state === "uploading" && <div className="nb-attachment-bar" style={{ width: `${progress}%` }} />}
    </div>
  );
}
const AttachmentMedia = ({ children }) => <div className="nb-attachment-media">{children}</div>;
const AttachmentContent = ({ children }) => <div className="nb-attachment-content">{children}</div>;
const AttachmentTitle = ({ children }) => <div className="nb-attachment-title">{children}</div>;
const AttachmentDescription = ({ children }) => <div className="nb-attachment-desc">{children}</div>;
const AttachmentActions = ({ children }) => <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>{children}</div>;
const AttachmentAction = ({ children, ...props }) => (
  <button
    className="nb-btn"
    data-variant="neutral"
    data-size="icon"
    style={{ width: "2rem", height: "2rem", boxShadow: "var(--shadow-sm)" }}
    {...props}
  >
    {children}
  </button>
);

/* --- Icons: inline so there's no lucide-react dependency to install ------- */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);
const IconFile = () => <Icon d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></>} />;
const IconDownload = () => <Icon size={15} d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></>} />;
const IconX = () => <Icon size={15} d={<><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>} />;
const IconArrowLeft = () => <Icon size={16} d={<><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></>} />;
const IconMoon = () => <Icon d={<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />} />;
const IconSun = () => <Icon d={<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" /></>} />;

/* ============================================================================
 * 3. CONTENT
 * ----------------------------------------------------------------------------
 * Swap this array for your real content source. Shape:
 *   slug, title, excerpt, date, readingTime, tags[], pattern, accent, body[]
 * `body` blocks are { type: 'p' | 'h2' | 'ul' | 'quote' | 'code', ... }
 * ==========================================================================*/

const SITE = {
  title: "Release Notes",
  tagline: "Field notes on shipping software from the product side.",
  author: "Sam Okafor",
  role: "Technical PM. Writes specs, reads diffs, argues about scope.",
};

const POSTS = [
  {
    slug: "the-spec-is-not-the-product",
    title: "The spec is not the product",
    excerpt:
      "I spent two years writing documents nobody finished reading. Here's what changed when I started treating the spec as a conversation starter instead of a contract.",
    date: "2026-09-02",
    readingTime: 7,
    tags: ["specs", "process"],
    pattern: "stripes",
    accent: "var(--main)",
    body: [
      { type: "p", text: "The first spec I ever wrote was forty pages long. It had a glossary. It had an appendix explaining the glossary. Three engineers opened it, two of them scrolled to the wireframes, and the one who actually read it found a contradiction on page 31 that I'd introduced on page 12." },
      { type: "p", text: "I took that as a sign I needed a better template. It was actually a sign I needed a shorter document." },
      { type: "h2", text: "What a spec is for" },
      { type: "p", text: "A spec exists to surface disagreement early, while disagreement is still cheap. That's the whole job. Every section that doesn't help someone say \"wait, no\" is padding." },
      { type: "quote", text: "If nobody argued with your spec, it wasn't specific enough to be wrong." },
      { type: "p", text: "The rewrite that finally worked was four sections: what breaks today, what we're changing, what we're deliberately not changing, and how we'll know it worked. Everything else moved into comments on the ticket where it belonged." },
      { type: "h2", text: "The not-changing section earns its keep" },
      { type: "p", text: "Half of scope creep is people assuming an adjacent thing is included. Writing down what you're not touching costs four bullets and saves a sprint. Mine usually looks like this:" },
      { type: "ul", items: [
        "Not touching the legacy import path — it stays on v1 until Q1.",
        "Not adding bulk actions. Single-item flow only for this release.",
        "Not changing permissions. Same roles, same rules.",
        "Not localising the new strings yet. English ships first.",
      ] },
      { type: "h2", text: "Write the success check before the build" },
      { type: "p", text: "If you can't name the query you'd run to tell whether this worked, you don't have a spec, you have a wish. I now paste the actual query in:" },
      { type: "code", lang: "sql", text: "-- Did the new flow reduce abandoned uploads?\nselect\n  date_trunc('week', started_at) as week,\n  count(*) filter (where status = 'complete') * 1.0 / count(*) as completion_rate\nfrom upload_sessions\nwhere started_at > '2026-09-01'\ngroup by 1\norder by 1;" },
      { type: "p", text: "Two things happen when you do this. Engineers tell you the event you need doesn't exist yet, which is a much better thing to learn now. And you find out whether you actually care about the answer." },
    ],
    files: [
      { name: "spec-template-v4.docx", meta: "DOCX · 84 KB", state: "done" },
      { name: "scope-boundaries-checklist.md", meta: "Markdown · 6 KB", state: "done" },
    ],
  },
  {
    slug: "reading-the-diff",
    title: "Reading the diff: a PM's guide to code review",
    excerpt:
      "You don't need to approve pull requests. You do need to notice when the implementation quietly answered a product question nobody asked you.",
    date: "2026-08-21",
    readingTime: 9,
    tags: ["engineering", "code"],
    pattern: "grid",
    accent: "var(--accent)",
    body: [
      { type: "p", text: "There's a version of the PM-reads-code idea that goes badly: the PM leaves style nitpicks on a pull request and everyone quietly starts merging faster to avoid them. That's not what I mean." },
      { type: "p", text: "What I mean is that implementation decisions are product decisions wearing different clothes, and if you never look at the diff, you find out about them in a bug report six weeks later." },
      { type: "h2", text: "What's actually worth reading" },
      { type: "ul", items: [
        "Default values. Someone picked 30 days. Why 30?",
        "Error paths. What does the user see when this fails?",
        "Empty states. Almost always invented on the spot.",
        "Anything named `TODO` or `temporary`.",
        "Copy strings. These ship straight to users and rarely get reviewed by anyone who writes.",
      ] },
      { type: "p", text: "Here's a real one I caught last month. The retry logic looked fine, but the user-facing message did not:" },
      { type: "code", lang: "ts", text: "// PM comment: a user who hits this sees \"Error 0x4\" and nothing else.\n// Can we say what failed and what they should do next?\nif (!res.ok) {\n  toast.error(`Error ${res.status}`);\n  return;\n}" },
      { type: "p", text: "That's a product bug in an engineering diff. It took one comment and a two-line change. It would have taken a support ticket and a week if I'd waited for QA." },
      { type: "h2", text: "How to comment without being annoying" },
      { type: "p", text: "Ask, don't assert. Tag it. I prefix every comment with <code>PM:</code> so nobody mistakes it for a blocking review. And I never leave one on something I couldn't explain to the author out loud." },
      { type: "quote", text: "Your job in the diff is to be the person who remembers what we promised the user. Nothing else." },
    ],
    files: [
      { name: "diff-review-checklist.pdf", meta: "PDF · 210 KB", state: "done" },
    ],
  },
  {
    slug: "killing-a-feature",
    title: "Killing a feature nobody used",
    excerpt:
      "Eleven customers had it turned on. Two of them were us. The removal took longer than the build, and the postmortem was more useful than either.",
    date: "2026-08-04",
    readingTime: 6,
    tags: ["analytics", "sunset"],
    pattern: "dots",
    accent: "var(--main)",
    body: [
      { type: "p", text: "We shipped custom dashboard layouts in March. By July, eleven accounts had ever saved a layout, and two of those were internal test accounts. The feature cost us about four engineering weeks and roughly one support ticket a month in confusion." },
      { type: "h2", text: "The part I got wrong" },
      { type: "p", text: "I read the low usage as a discovery problem for three months. We moved the entry point twice, added an empty-state nudge, ran a changelog post. Usage went from eleven accounts to twelve." },
      { type: "p", text: "The honest read was available in week two: people don't want to arrange a dashboard, they want the right dashboard to already exist. Custom layouts solved a problem our users had no interest in solving themselves." },
      { type: "quote", text: "Low adoption is sometimes a marketing problem. It's more often an answer." },
      { type: "h2", text: "How the removal actually went" },
      { type: "ul", items: [
        "Emailed the nine real accounts. Four replied. None objected.",
        "Shipped three preset layouts built from what those four had configured.",
        "Left the saved layouts readable but not editable for one release.",
        "Deleted the feature flag, the table, and 2,400 lines.",
      ] },
      { type: "p", text: "The presets are now used by roughly a third of active accounts. The thing people wanted was in the data the whole time — it was just wearing the shape of a failed feature." },
    ],
    files: [
      { name: "sunset-comms-template.docx", meta: "DOCX · 42 KB", state: "done" },
      { name: "layout-usage-q2.pdf", meta: "PDF · 2.4 MB", state: "done" },
      { name: "raw-events-export.csv", meta: "File is too large", state: "error" },
    ],
  },
  {
    slug: "estimates-are-a-conversation",
    title: "Estimates are a conversation, not a number",
    excerpt:
      "Every time I asked \"how long will this take\" I got a worse answer than when I asked \"what would make this take twice as long.\"",
    date: "2026-07-19",
    readingTime: 5,
    tags: ["planning", "estimation"],
    pattern: "waves",
    accent: "var(--accent)",
    body: [
      { type: "p", text: "Ask an engineer for an estimate and you get a number shaped by how much they trust you not to hold it against them. Ask them what could go wrong and you get the actual model of the work." },
      { type: "h2", text: "Three questions that work better" },
      { type: "ul", items: [
        "What would make this take twice as long?",
        "What's the part you haven't looked at yet?",
        "If you had to ship something useful in three days, what would you cut?",
      ] },
      { type: "p", text: "The third one is the most valuable and the least used. It converts a scoping argument into a design exercise, and the answer is frequently something you'd ship happily." },
      { type: "quote", text: "A range with a reason beats a point estimate with a promise." },
      { type: "p", text: "When I do need a date for someone outside the team, I give the range and the thing it depends on. \"Mid-October, assuming the auth migration lands first\" is a sentence a stakeholder can plan around. \"October 14\" is a sentence they can be disappointed by." },
    ],
    files: [
      { name: "estimation-questions.md", meta: "Markdown · 12 KB", state: "done" },
    ],
  },
  {
    slug: "ab-tests-wrong-question",
    title: "The A/B test that answered the wrong question",
    excerpt:
      "We proved the new onboarding converted better. We did not notice it converted better into a plan those users churned out of eight weeks later.",
    date: "2026-06-30",
    readingTime: 8,
    tags: ["experiments", "data"],
    pattern: "grid",
    accent: "var(--main)",
    body: [
      { type: "p", text: "Signup completion went from 48% to 61%. The test was clean, the sample was large, the result was unambiguous. We shipped it, wrote it up, and moved on." },
      { type: "p", text: "Eight weeks later, retention on the cohort was down four points." },
      { type: "h2", text: "What happened" },
      { type: "p", text: "The new flow removed a step where people picked their use case. That step was friction, and removing it did exactly what we predicted — more people finished. It was also the step that made people describe what they wanted, and the ones who described it stuck around." },
      { type: "quote", text: "We optimised the metric we could move in two weeks, and the one we cared about took two months to answer back." },
      { type: "h2", text: "What I do now" },
      { type: "ul", items: [
        "Name the guardrail metric before the test starts, in the same doc.",
        "Write down the lag — how long until the guardrail can even respond.",
        "Put a calendar hold on the date the real answer arrives. Nobody remembers otherwise.",
      ] },
      { type: "p", text: "The use-case step is back, as one optional question with three options. Completion sits at 57%. Retention recovered. That's the trade I'd make again." },
    ],
    files: [
      { name: "onboarding-test-readout.pdf", meta: "PDF · 1.1 MB", state: "done" },
    ],
  },
];

const ALL_TAGS = [...new Set(POSTS.flatMap((p) => p.tags))];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

/* ============================================================================
 * 4. LAYOUT
 * ==========================================================================*/

function Header({ dark, onToggleDark, onHome }) {
  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "var(--bg)",
        borderBottom: "var(--border-w) solid var(--border)",
      }}
    >
      <div className="nb-shell" style={{ display: "flex", alignItems: "center", gap: "1rem", height: "4.5rem" }}>
        <button
          onClick={onHome}
          style={{
            display: "flex", alignItems: "center", gap: "0.625rem",
            background: "none", border: "none", padding: 0, cursor: "pointer",
            font: "inherit", color: "inherit",
          }}
        >
          <span
            style={{
              display: "grid", placeItems: "center", width: "2.25rem", height: "2.25rem",
              background: "var(--main)", color: "#000",
              border: "var(--border-w) solid var(--border)", borderRadius: "var(--radius)",
              boxShadow: "var(--shadow-sm)", fontWeight: 900, fontSize: "1.125rem",
            }}
          >
            R
          </span>
          <span style={{ fontWeight: 900, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>{SITE.title}</span>
        </button>

        <nav style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Button variant="ghost" size="sm" onClick={onHome}>Writing</Button>
          <Button variant="ghost" size="sm">About</Button>
          <Button
            variant="neutral"
            size="icon"
            onClick={onToggleDark}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {dark ? <IconSun /> : <IconMoon />}
          </Button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer
      style={{
        marginTop: "4rem",
        borderTop: "var(--border-w) solid var(--border)",
        background: "var(--main)", color: "var(--mtext)",
      }}
    >
      <div
        className="nb-shell"
        style={{ padding: "2rem 1.25rem", display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "space-between" }}
      >
        <div>
          <div style={{ fontWeight: 900, fontSize: "1.125rem" }}>{SITE.title}</div>
          <div className="nb-small" style={{ marginTop: "0.25rem" }}>{SITE.tagline}</div>
        </div>
        <div className="nb-small" style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
          <a href="#rss">RSS</a>
          <a href="#archive">Archive</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}

function Sidebar({ activeTag, onTag }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <aside className="nb-sticky" style={{ display: "grid", gap: "1.25rem" }}>
      <Card>
        <CardContent>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <Avatar name={SITE.author} size={48} />
            <div>
              <div style={{ fontWeight: 800 }}>{SITE.author}</div>
              <div className="nb-small nb-muted">Technical PM</div>
            </div>
          </div>
          <p className="nb-small" style={{ marginTop: "0.875rem", lineHeight: 1.55, fontWeight: 500 }}>
            {SITE.role}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h4 className="nb-h3" style={{ marginBottom: "0.75rem" }}>Topics</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
            <Badge as="button" active={activeTag === null} onClick={() => onTag(null)}>All</Badge>
            {ALL_TAGS.map((tag) => (
              <Badge as="button" key={tag} active={activeTag === tag} onClick={() => onTag(tag)}>
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card style={{ background: "var(--accent)" }}>
        <CardContent>
          <h4 className="nb-h3">Get new posts by email</h4>
          <p className="nb-small" style={{ marginTop: "0.375rem", fontWeight: 500 }}>
            One post a fortnight. No roundups, no webinars.
          </p>
          {sent ? (
            <p style={{ marginTop: "0.875rem", fontWeight: 700 }}>Subscribed. Check your inbox to confirm.</p>
          ) : (
            <div style={{ marginTop: "0.875rem", display: "grid", gap: "0.5rem" }}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                aria-label="Email address"
              />
              <Button onClick={() => email.includes("@") && setSent(true)}>Subscribe</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}

/* ============================================================================
 * 5. PAGES
 * ==========================================================================*/

function Hero() {
  return (
    <section style={{ padding: "3.5rem 0 2.5rem" }}>
      <h1 className="nb-display" style={{ maxWidth: "16ch" }}>
        Field notes on shipping software.
      </h1>
      <p className="nb-body" style={{ marginTop: "1.25rem", maxWidth: "52ch", fontWeight: 500 }}>
        Specs, scope arguments, dashboards that lie to you, and the occasional pull request comment.
        Written by a PM who ships, for people who do the same.
      </p>
      <div style={{ display: "flex", gap: "0.625rem", marginTop: "1.75rem", flexWrap: "wrap" }}>
        <Button>Read the latest</Button>
        <Button variant="neutral">Browse the archive</Button>
      </div>
    </section>
  );
}

function PostCard({ post, onOpen }) {
  return (
    <Card interactive style={{ overflow: "hidden" }}>
      <button
        onClick={() => onOpen(post.slug)}
        style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit", color: "inherit" }}
      >
        <div className="nb-cover" data-pattern={post.pattern} style={{ background: post.accent }} />
        <div style={{ padding: "1.25rem" }}>
          <div className="nb-small nb-muted" style={{ display: "flex", gap: "0.75rem" }}>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.readingTime} min read</span>
          </div>
          <h2 className="nb-h2" style={{ marginTop: "0.5rem" }}>{post.title}</h2>
          <p style={{ marginTop: "0.625rem", lineHeight: 1.6, fontWeight: 500 }}>{post.excerpt}</p>
          <div style={{ display: "flex", gap: "0.375rem", marginTop: "1rem", flexWrap: "wrap" }}>
            {post.tags.map((t) => <Badge key={t}>{t}</Badge>)}
          </div>
        </div>
      </button>
    </Card>
  );
}

function PostList({ onOpen, activeTag, onTag }) {
  const posts = useMemo(
    () => (activeTag ? POSTS.filter((p) => p.tags.includes(activeTag)) : POSTS),
    [activeTag]
  );

  return (
    <>
      <Hero />
      <div className="nb-grid" style={{ paddingBottom: "2rem" }}>
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {activeTag && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span className="nb-small">Showing posts tagged “{activeTag}”</span>
              <Button variant="ghost" size="sm" onClick={() => onTag(null)}>Clear filter</Button>
            </div>
          )}
          {posts.length === 0 ? (
            <Card>
              <CardContent>
                <h3 className="nb-h3">Nothing here yet</h3>
                <p className="nb-small nb-muted" style={{ marginTop: "0.375rem" }}>
                  Pick another topic from the sidebar to see what's been written.
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((p) => <PostCard key={p.slug} post={p} onOpen={onOpen} />)
          )}
        </div>
        <Sidebar activeTag={activeTag} onTag={onTag} />
      </div>
    </>
  );
}

/* Block renderer — replace with your MDX renderer when you wire up real content. */
function Block({ block }) {
  switch (block.type) {
    case "h2": return <h2>{block.text}</h2>;
    case "ul": return <ul>{block.items.map((i, n) => <li key={n}>{i}</li>)}</ul>;
    case "quote": return <blockquote>{block.text}</blockquote>;
    case "code": return <pre><code>{block.text}</code></pre>;
    default: return <p dangerouslySetInnerHTML={{ __html: block.text }} />;
  }
}

/* Demonstrates the Attachment `state` prop across a live upload. */
function UploadDemo() {
  const [state, setState] = useState("idle");
  const [progress, setProgress] = useState(0);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  const start = () => {
    setState("uploading");
    setProgress(0);
    timer.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer.current);
          setState("processing");
          setTimeout(() => setState("done"), 900);
          return 100;
        }
        return p + 5;
      });
    }, 90);
  };

  const label = {
    idle: "Waiting for a file",
    uploading: `Uploading · ${progress}%`,
    processing: "Processing",
    done: "PDF · 2.4 MB",
  }[state];

  return (
    <div style={{ display: "grid", gap: "0.625rem" }}>
      <Attachment state={state} progress={progress}>
        <AttachmentMedia><IconFile /></AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>{state === "idle" ? "Drop a file" : "quarterly-report.pdf"}</AttachmentTitle>
          <AttachmentDescription>{label}</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          {state === "done" ? (
            <AttachmentAction aria-label="Download"><IconDownload /></AttachmentAction>
          ) : (
            <AttachmentAction aria-label="Remove" onClick={() => { clearInterval(timer.current); setState("idle"); setProgress(0); }}>
              <IconX />
            </AttachmentAction>
          )}
        </AttachmentActions>
      </Attachment>
      {state === "idle" && <Button size="sm" variant="neutral" onClick={start}>Simulate an upload</Button>}
    </div>
  );
}

function PostPage({ post, onBack, onOpen, onTag }) {
  const index = POSTS.findIndex((p) => p.slug === post.slug);
  const next = POSTS[index + 1];

  useEffect(() => { window.scrollTo({ top: 0 }); }, [post.slug]);

  return (
    <article style={{ paddingTop: "2rem" }}>
      <Button variant="ghost" size="sm" onClick={onBack}>
        <IconArrowLeft /> All posts
      </Button>

      <header style={{ marginTop: "1.5rem", maxWidth: "68ch" }}>
        <div className="nb-small nb-muted" style={{ display: "flex", gap: "0.75rem" }}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readingTime} min read</span>
        </div>
        <h1 className="nb-h1" style={{ marginTop: "0.5rem" }}>{post.title}</h1>
        <div style={{ display: "flex", gap: "0.375rem", marginTop: "1rem", flexWrap: "wrap" }}>
          {post.tags.map((t) => (
            <Badge as="button" key={t} onClick={() => onTag(t)}>{t}</Badge>
          ))}
        </div>
      </header>

      <div
        className="nb-cover"
        data-pattern={post.pattern}
        style={{
          background: post.accent, marginTop: "2rem", height: "12rem",
          border: "var(--border-w) solid var(--border)", borderRadius: "var(--radius)",
          boxShadow: "var(--shadow)",
        }}
      />

      <div className="nb-grid" style={{ marginTop: "2.5rem" }}>
        <div>
          <div className="nb-prose">
            {post.body.map((b, i) => <Block key={i} block={b} />)}
          </div>

          {/* Attachment component in its natural habitat: downloadables on a post. */}
          {post.files?.length > 0 && (
            <section style={{ marginTop: "3rem", maxWidth: "68ch" }}>
              <h2 className="nb-h2" style={{ marginBottom: "0.875rem" }}>Files in this post</h2>
              <div style={{ display: "grid", gap: "0.625rem" }}>
                {post.files.map((f) => (
                  <Attachment key={f.name} state={f.state}>
                    <AttachmentMedia><IconFile /></AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle>{f.name}</AttachmentTitle>
                      <AttachmentDescription>{f.meta}</AttachmentDescription>
                    </AttachmentContent>
                    <AttachmentActions>
                      <AttachmentAction aria-label={`Download ${f.name}`}><IconDownload /></AttachmentAction>
                    </AttachmentActions>
                  </Attachment>
                ))}
              </div>
            </section>
          )}

          <section style={{ marginTop: "2.5rem", maxWidth: "68ch" }}>
            <h2 className="nb-h2" style={{ marginBottom: "0.875rem" }}>Send me your version</h2>
            <p className="nb-small nb-muted" style={{ marginBottom: "0.875rem", fontWeight: 500 }}>
              Attach a spec or a readout and I'll write back with notes.
            </p>
            <UploadDemo />
          </section>

          <Card style={{ marginTop: "3rem", background: "var(--main)" }}>
            <CardContent>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <Avatar name={SITE.author} size={52} />
                <div>
                  <div style={{ fontWeight: 900, fontSize: "1.0625rem" }}>{SITE.author}</div>
                  <p style={{ marginTop: "0.375rem", fontWeight: 500, lineHeight: 1.55 }}>{SITE.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {next && (
            <Card interactive style={{ marginTop: "1.25rem" }}>
              <button
                onClick={() => onOpen(next.slug)}
                style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: "1.25rem", cursor: "pointer", font: "inherit", color: "inherit" }}
              >
                <div className="nb-small nb-muted">Next post</div>
                <div className="nb-h3" style={{ marginTop: "0.25rem" }}>{next.title}</div>
              </button>
            </Card>
          )}
        </div>

        <Sidebar activeTag={null} onTag={onTag} />
      </div>
    </article>
  );
}

/* ============================================================================
 * 6. APP
 * ----------------------------------------------------------------------------
 * Routing is a single piece of state. Swap for next/router or react-router —
 * the two page components take plain props, so nothing else needs to change.
 * ==========================================================================*/

export default function App() {
  const [dark, setDark] = useState(false);
  const [slug, setSlug] = useState(null);
  const [activeTag, setActiveTag] = useState(null);

  const post = POSTS.find((p) => p.slug === slug);

  const goHome = () => { setSlug(null); window.scrollTo({ top: 0 }); };
  const pickTag = (tag) => { setActiveTag(tag); setSlug(null); window.scrollTo({ top: 0 }); };

  return (
    <div className={`nb${dark ? " dark" : ""}`} style={{ minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Header dark={dark} onToggleDark={() => setDark((d) => !d)} onHome={goHome} />
      <main className="nb-shell">
        {post ? (
          <PostPage post={post} onBack={goHome} onOpen={setSlug} onTag={pickTag} />
        ) : (
          <PostList onOpen={setSlug} activeTag={activeTag} onTag={setActiveTag} />
        )}
      </main>
      <Footer />
    </div>
  );
}
