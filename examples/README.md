# Reference patterns from a real clone

These files are working code lifted directly from cloning Linear's homepage. They are NOT scaffolding the template uses by default — they are **reference material** showing how to apply the lessons in `LESSONS.md` when building your own clone.

## Files

### `components/PageSection.tsx`
The reusable section primitive (LESSONS.md §12). Implements:
- 2-column header grid (title left, body+chapter-link right)
- Recreated-DOM illustration slot
- Interactive sub-tab row with active state, brand-color `+` rotation, and underline
- Client component (`"use client"`) so tab state is reactive

Drop into `src/components/PageSection.tsx` of a new clone. Make sure your data layer matches its `ProductSection` interface.

### `components/RevealOnScroll.tsx`
Scroll-triggered fade-up wrapper with **failsafe timeout** (LESSONS.md §7). Critical for headless screenshot QA — without the failsafe, below-fold reveals stay invisible because IntersectionObserver never fires.

### `illustrations/shared.tsx`
Shared atoms used by all illustrations:
- `IllustrationFrame` — aspect-ratio wrapper with consistent text defaults
- `Avatar` — colored initial circle (placeholder for real CDN avatars)
- `LabelPill` — colored tinted-bg label (small + regular sizes)
- `CodeChip` — inline `code` styling
- `LinearLogo` — example of embedding extracted favicon SVG as a React component

### `illustrations/IntakeIllustration.tsx`
**Pattern: Kanban board with floating overlay.** Shows how to recreate:
- Multi-column flexbox grid with realistic issue cards
- Per-card priority icons, monospace IDs, label pills
- Floating Slack-thread overlay anchored bottom-left with `hidden md:block`
- Real `@`-mention syntax + composer toolbar

Generalize the pattern by swapping content data; the structural primitives stay.

### `illustrations/MonitorIllustration.tsx`
**Pattern: Charts + project status cards.** Shows how to recreate:
- Bar chart with staggered grow-on-paint animation (`growbar` keyframe)
- Horizontal progress bars with `growbarx` animation
- Project status update card with colored status pill
- Audio player chrome (Listen button + speed selector)

The chart data is hard-coded; for a real clone, extract live values via `getComputedStyle` on the target's actual chart rendering or by reading their data attributes.

## Required globals.css additions

To use these patterns, your `src/app/globals.css` needs:

```css
/* Linear design token system at :root (extract via evaluate_script) */
:root {
  --color-bg-marketing: #010102;
  --color-bg-primary: #08090a;
  /* ...300+ more vars... */
  --homepage-max-width: calc(1344px + 46px * 2);
  --speed-quick: 0.1s;
  --speed-regular: 0.25s;
  --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
}

@keyframes thinking-pulse {
  0%, 100% { opacity: 0.3; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-1px); }
}

@keyframes illfade {
  from { opacity: 0.4; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes growbar {
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
}

@keyframes growbarx {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
```

## Workflow when adapting

1. Run the clone-website skill on your target
2. After extraction, before writing illustrations: read `LESSONS.md` and these examples
3. Copy `PageSection.tsx` + `RevealOnScroll.tsx` + `illustrations/shared.tsx` into your `src/components/`
4. For each section, write a new `<SectionName>Illustration.tsx` modeled after `IntakeIllustration.tsx` or `MonitorIllustration.tsx`
5. Wire it all in `src/app/page.tsx` (data-driven loop over sections)

The IntakeIllustration is the most reusable pattern (Kanban with overlay) — many SaaS marketing pages have a "before / after" or "messy → organized" mockup that fits this shape.
