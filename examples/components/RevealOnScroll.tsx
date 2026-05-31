"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps children with a scroll-triggered fade-up animation.
 * Mimics Linear's stagger-on-scroll behavior using IntersectionObserver.
 *
 * Notes:
 * - One-shot: once visible, stays visible (no re-trigger on scroll back up).
 * - Honors prefers-reduced-motion via base CSS opacity:1 fallback.
 */
export function RevealOnScroll({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    // Failsafe: if IntersectionObserver never fires (headless screenshots,
    // print mode, no-scroll viewports), reveal after a short delay so content
    // is never permanently hidden.
    const failsafe = window.setTimeout(() => setVisible(true), 1500);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            window.clearTimeout(failsafe);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] motion-reduce:transition-none",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6",
        className,
      )}
      style={{
        transitionDuration: "0.7s",
        transitionTimingFunction: "var(--ease-out-quart)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
