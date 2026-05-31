import { cn } from "@/lib/utils";

/** Shared atoms used by all illustrations. */

export function IllustrationFrame({
  children,
  aspect = "1425 / 626",
}: {
  children: React.ReactNode;
  aspect?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        "text-[color:var(--color-text-primary)]",
        "font-sans text-[13px] leading-[1.5]",
      )}
      style={{ aspectRatio: aspect }}
    >
      {children}
    </div>
  );
}

export function Avatar({
  initial,
  color,
  size = 16,
}: {
  initial: string;
  color: string;
  size?: number;
}) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-white font-medium uppercase shrink-0"
      style={{ width: size, height: size, background: color, fontSize: Math.round(size * 0.5) }}
    >
      {initial}
    </span>
  );
}

export function LabelPill({
  children,
  color,
  small = false,
}: {
  children: React.ReactNode;
  color: string;
  small?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded font-medium",
        small ? "px-1 py-px text-[10px]" : "px-1.5 py-0.5 text-[11px]",
      )}
      style={{
        backgroundColor: `color-mix(in oklch, ${color} 14%, transparent)`,
        color,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </span>
  );
}

export function CodeChip({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[11.5px] px-1 py-0.5 rounded bg-[color:var(--color-bg-tertiary)] text-[color:var(--color-text-primary)]">
      {children}
    </code>
  );
}

/** Authentic Linear logo glyph (extracted from favicon.svg). */
export function LinearLogo({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      aria-hidden
    >
      <rect width="16" height="16" rx="2" fill="currentColor" />
      <path
        d="M2.147 9.383c-.027-.114.109-.186.192-.103L6.72 13.66c.083.083.011.219-.103.192a6.015 6.015 0 0 1-4.47-4.47ZM2 7.627a.119.119 0 0 0 .035.091l6.247 6.247a.119.119 0 0 0 .091.035c.285-.018.564-.055.836-.111a.117.117 0 0 0 .057-.198L2.31 6.734a.117.117 0 0 0-.198.057 6.007 6.007 0 0 0-.11.836ZM2.505 5.565a.119.119 0 0 0 .025.132l7.773 7.773a.118.118 0 0 0 .132.025c.215-.096.422-.203.623-.322a.118.118 0 0 0 .022-.185L3.012 4.92a.118.118 0 0 0-.185.022c-.119.2-.226.408-.322.623ZM3.519 4.169a.118.118 0 0 1-.005-.163 6.006 6.006 0 1 1 8.48 8.48.118.118 0 0 1-.163-.005L3.52 4.169Z"
        fill="#08090a"
      />
    </svg>
  );
}
