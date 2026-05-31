# Lessons from Real Clones

Field-verified improvements over the upstream template, distilled from cloning Linear's homepage (linear.app) to pixel-near fidelity in a single Claude Code session.

These lessons are appended to the upstream skill — read them before starting any clone, then refer back when the skill says "extract X" or "dispatch Y".

---

## 1. A11y snapshot first, evaluate_script second

`mcp__chrome-devtools__take_snapshot` returns the **entire semantic tree** in one call — every heading, button label, link text, image alt, list item. Run it once before anything else. It eliminates 90% of the per-element `evaluate_script` calls the upstream skill prescribes.

```
1. navigate_page → target URL
2. take_snapshot → entire page text content, structure, ARIA roles
3. THEN evaluate_script only for: getComputedStyle on critical elements,
   detecting hidden state, finding non-semantic DOM hooks.
```

**Token saving**: ~70% fewer browser MCP calls per section.

---

## 2. Measure typography from the live DOM, never guess

Defaults that feel right are usually wrong. Linear's hero h1 is `64px / weight 510`, not the `72px / 590` an unprimed eye assumes. Always:

```javascript
// Run this once per critical text element BEFORE writing the component
const cs = getComputedStyle(h1);
({ fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, maxWidth: cs.maxWidth })
```

Common myth-busters observed on real sites:

| Element | Common assumption | Actual on Linear |
|---|---|---|
| Hero h1 | 72px / 590 / `font-bold` | **64px / 510** / weight-medium |
| Hero subhead | 18-20px | **15px** (`--font-size-regular`) |
| Eyebrow announcement | rounded pill with border | **plain inline link** |
| Sub-feature tabs | colored badges / pills | **plain text with `+` glyph** |
| Section header layout | stacked title + body | **2-column grid, equal widths** |

---

## 3. Build live DOM, not screenshot illustrations

Quality cap of a screenshot-as-illustration is "looks right at distance, sharp on Retina, dead inert." Quality cap of recreated DOM is "scales, animates, theme-aware, interactive."

Pay the upfront token cost: each illustration is ~200-300 lines of TSX, but you get:
- Crisp at any zoom
- Reactive to tab clicks / hover / scroll
- Works in print, dark/light, RTL
- Can animate entry / state changes
- No CORS / asset pipeline headaches

Use the `sharp` cropping fallback in `scripts/crop-illustrations.mjs` ONLY when:
- Source illustration depends on a video, canvas, or Lottie
- Section has 50+ unique sub-elements (extreme density)
- You're out of token budget and must ship a placeholder

---

## 4. Inline build > parallel-worktree builders (for single-LLM sessions)

The upstream skill prescribes dispatching one subagent per section in a git worktree. That pattern optimizes **wall-clock time** for human-driven workflows.

For a **single LLM orchestrator** doing sequential token-budgeted work, this pattern actively **costs more tokens**: each subagent dispatch loads a fresh context, the spec file is duplicated inline, the worktree merge step adds overhead.

**Override:** if you are the orchestrator and the token budget — not human time — is your constraint, build sections inline. Data-drive 5 section instances through 1 `PageSection` primitive. Same output, ~5x cheaper.

Use the worktree pattern when:
- A human can babysit multiple parallel agents
- You're cloning multiple sites in parallel
- Per-section risk isolation matters more than token cost

---

## 5. The CSS token system is non-negotiable

Before writing ANY component, extract every CSS variable from `:root`:

```javascript
const rootStyles = getComputedStyle(document.documentElement);
const cssVars = {};
for (let i = 0; i < rootStyles.length; i++) {
  const name = rootStyles[i];
  if (name.startsWith('--')) cssVars[name] = rootStyles.getPropertyValue(name).trim();
}
```

Bake the result into `src/app/globals.css` under `:root`. Every component then references real values via `var(--color-bg-primary)` etc. This single step eliminates ~80% of "looks slightly off" complaints.

Linear has 300+ variables. Capture all of them. The dump is cheap (one eval call) and provides the entire design system foundation.

---

## 6. Self-host fonts the target self-hosts

If the target site uses `<link rel="preload" as="font">` with their own CDN, the font is custom. Download the `.woff2` to `public/fonts/` and wire via `next/font/local`, NOT `next/font/google`.

Inter Variable from Linear's CDN ≠ Inter from Google Fonts (Linear's has `font-variation-settings: "opsz" auto` and OpenType features `"cv01", "ss03"` baked in).

---

## 7. RevealOnScroll needs a failsafe timeout

`IntersectionObserver` does not fire in headless screenshot rendering or print mode. Without a failsafe, below-fold content stays at `opacity:0` permanently in QA artifacts.

```tsx
// In your reveal hook:
const failsafe = setTimeout(() => setVisible(true), 1500);
// ...
const io = new IntersectionObserver(...);
// ...
return () => { io.disconnect(); clearTimeout(failsafe); };
```

Also: honor `prefers-reduced-motion: reduce` — show immediately, skip animation.

---

## 8. Eager-load all marketing illustrations

`next/image` with default `loading="lazy"` breaks full-page screenshots (images below fold don't fetch until scrolled into view). For marketing pages, every illustration is "above the fold" to a user clicking through — set `priority={true}` and `loading="eager"`.

---

## 9. Mobile responsive: hide overlays, collapse columns

Linear (and similar sites) uses very different layouts at breakpoints (`hide-mobile`, `hide-laptop` class modifiers). Default mobile strategies:

- **N-col Kanbans / grids** → drop to 2-col or 1-col below `md`
- **Floating overlays** (Slack thread, comments overlay) → `hidden md:block`
- **Right metadata sidebars** in app mockups → `hidden md:flex`
- **Wide Gantts / timelines** → `overflow-x-auto` wrapper
- **Code diffs** → consider stacking left/right vertically below `lg`
- **Large hero titles** → step down (`text-[44px] sm:text-[56px] lg:text-[64px]`)

---

## 10. Verify lucide-react icons exist before importing

Older lucide-react versions are missing many icons (`Slack` doesn't exist in 1.6.0). Always:

```bash
node -e "const l=require('lucide-react'); ['Slack','Bot','Tag'].forEach(n => console.log(n, typeof l[n]))"
```

before relying on icons. Substitute or inline SVG when missing.

---

## 11. Realistic single-session scope

Empirical limits for one Claude Code session (~1M token context):

| Scope | Achievable |
|---|---|
| Foundation only (tokens, fonts, globals) | Yes, ~5 min |
| Foundation + 1 section with full DOM | Yes, ~15 min |
| Foundation + 5 sections with recreated DOM | Yes, ~45-60 min |
| Foundation + 10+ sections + full anim states | **No** — context exhausts at ~6-8 sections |
| Per-tab state cycling (4 states × 5 sections) | **No** in single session |

For sites with 10+ sections (Linear, Stripe, Notion homepages): plan a multi-session strategy:
- Session 1: foundation + topology + hero
- Session 2: PageSection primitive + sections 1-3
- Session 3: sections 4-6
- Session 4: assembly + QA + per-tab states

---

## 12. PageSection primitive — write once, reuse N times

When 3+ sections share the same wrapper class (`PageSection_root` on Linear, `Section_root` on Stripe, etc.), build ONE primitive component that takes content as props:

```tsx
interface ProductSection {
  chapterNumber: string;
  chapterLabel: string;
  chapterHref: string;
  title: string;
  body: string;
  tabs: string[];
  illustration: ReactNode;
}

<PageSection section={...} />
```

Then in `src/data/sections.ts`, define all N sections as data. Massive code reduction with zero quality loss.

---

## 13. The chapter / sub-tab pattern is universal

Most modern marketing pages follow:

```
[Title left] | [Body + chapter link right]
[Full-width illustration]
[Sub-tab row: 1.1 Foo + / 1.2 Bar + / 1.3 Baz +]
```

If you see this pattern on the target site, model your `PageSection` after it. Active tab state toggle is `useState` + visual underline + brand-color `+` icon rotation.

---

## 14. Workflow: extract → measure → recreate → verify, per section

For each PageSection:

1. **Extract** — a11y snapshot for content, `getComputedStyle` on title/body/CTA for typography, `querySelectorAll('.X')` for sub-elements
2. **Measure** — write extracted values to `docs/research/<section>.json`
3. **Recreate** — build `<SectionName>Illustration.tsx` as pure DOM, no images, ~200-300 lines
4. **Verify** — `npm run build` passes; chrome-devtools navigate + screenshot at the section's y-offset; compare side-by-side with `docs/design-references/`

---

## 15. Crop screenshots: last-resort fallback only

`scripts/crop-illustrations.mjs` (added in this fork) uses `sharp` to slice a full-page screenshot into per-section illustrations. Use when:
- Cannot recreate as DOM in available token budget
- Source illustration is fundamentally pixel art (e.g., 3D render, photo)
- Need a placeholder while iterating on real DOM version

Always replace cropped placeholders with recreated DOM before shipping.

---

## Default model selection for clone-website

- **Recommended**: Claude Opus 4.7 or 4.6 (handles 200+ TSX lines per section cleanly)
- **Acceptable**: Sonnet 4.6 (slower iteration, more verification cycles needed)
- **Avoid**: Haiku (struggles with deep nesting + CSS arithmetic)

---

## See Also

- `.claude/skills/clone-website/SKILL.md` — upstream skill, read before this file
- `examples/illustrations/` — annotated reference patterns from real clones
- `scripts/crop-illustrations.mjs` — fallback cropping utility
