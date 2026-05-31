"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductSection } from "@/types/content";

/**
 * Linear's PageSection primitive.
 *
 * - 2-col grid header (title | body+chapter link)
 * - Recreated-DOM illustration slot
 * - Interactive sub-tab row (click → active state with underline indicator,
 *   cross-fade illustration as visual feedback)
 */
export function PageSection({ section }: { section: ProductSection }) {
  const [active, setActive] = useState(0);

  return (
    <section
      className="relative mx-auto w-full px-6 lg:px-12 pt-16 lg:pt-24 pb-24 lg:pb-32"
      style={{ maxWidth: "var(--homepage-max-width)" }}
    >
      {/* Header: 2-col grid */}
      <div className="pb-16 lg:pb-24 grid gap-6 lg:gap-8 lg:grid-cols-2">
        <h2
          className={cn(
            "whitespace-pre-line",
            "text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.05] lg:leading-[1] tracking-[-0.022em]",
            "text-[color:var(--color-text-primary)]",
          )}
          style={{ fontWeight: 510 }}
        >
          {section.title}
        </h2>
        <div>
          <p className="text-[17px] sm:text-[20px] lg:text-[24px] leading-[1.4] lg:leading-[1.33] text-[color:var(--color-text-secondary)]">
            {section.body}
          </p>
          <div className="mt-8 lg:mt-12">
            <ChapterLink section={section} />
          </div>
        </div>
      </div>

      {/* Illustration — re-mounts on tab change for subtle cross-fade */}
      <div
        key={active}
        className={cn(
          "relative w-full overflow-hidden rounded-xl lg:rounded-2xl",
          "border border-[color:var(--color-border-translucent-strong)]",
          "bg-[color:var(--color-bg-level-1)]",
          "motion-safe:animate-[illfade_0.35s_var(--ease-out-quart)]",
        )}
      >
        {section.illustration}
      </div>

      {/* Sub-feature tab row */}
      {section.tabs.length > 0 && (
        <div className="mt-6 lg:mt-8 hidden flex-wrap items-center gap-x-6 gap-y-3 md:flex">
          {section.tabs.map((tab, i) => {
            const isActive = i === active;
            const num = tab.split(" ")[0];
            const label = tab.split(" ").slice(1).join(" ");
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "group relative inline-flex items-center gap-1.5 pb-1.5",
                  "text-[13px]",
                  isActive
                    ? "text-[color:var(--color-text-primary)]"
                    : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]",
                )}
                style={{ transitionDuration: "var(--speed-quick)" }}
              >
                <span className="text-[color:var(--color-text-tertiary)] font-mono text-[12px]">
                  {num}
                </span>
                <span>{label}</span>
                <span
                  aria-hidden
                  className={cn(
                    "text-[color:var(--color-text-tertiary)] transition-transform",
                    isActive && "rotate-45 text-[color:var(--color-brand-bg)]",
                  )}
                  style={{ transitionDuration: "var(--speed-regular)" }}
                >
                  +
                </span>
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 right-0 h-px bg-[color:var(--color-brand-bg)]"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ChapterLink({ section }: { section: ProductSection }) {
  return (
    <Link
      href={section.chapterHref}
      className="group inline-flex items-baseline gap-2 text-[16px] text-[color:var(--color-text-primary)] hover:opacity-80 transition-opacity"
      style={{ transitionDuration: "var(--speed-quick)" }}
    >
      <span className="text-[color:var(--color-text-tertiary)] font-mono">
        {section.chapterNumber}
      </span>
      <span>{section.chapterLabel}</span>
      <span className="transition-transform group-hover:translate-x-0.5">→</span>
    </Link>
  );
}
