import { Play, ChevronDown, CircleCheck, AlertTriangle } from "lucide-react";
import { IllustrationFrame } from "./shared";

/**
 * Section 5 (5.0 Monitor) — bar chart + cycle-time-by-agent + Weekly Pulse
 * card with project status updates.
 */
export function MonitorIllustration() {
  return (
    <IllustrationFrame aspect="1425 / 598">
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 md:p-4 overflow-hidden">
        <div className="flex flex-col gap-3">
          <BarChartCard />
          <CycleTimeCard />
        </div>
        <WeeklyPulseCard />
      </div>
    </IllustrationFrame>
  );
}

const BAR_DATA = [3, 5, 4, 6, 7, 8, 6, 9, 11, 10, 12, 14, 13, 15, 16, 14, 17, 18];
const MAX = 18;

function BarChartCard() {
  return (
    <div className="rounded-xl border border-[color:var(--color-border-primary)] bg-[color:var(--color-bg-level-2)] p-4 flex-1 flex flex-col">
      <div className="text-[13px] text-[color:var(--color-text-primary)] mb-3 font-medium">
        Issue count by created date
      </div>
      <div className="flex-1 grid grid-cols-[28px_1fr] gap-2">
        {/* Y axis */}
        <div className="flex flex-col justify-between text-[10px] text-[color:var(--color-text-tertiary)] text-right font-mono py-0.5">
          {[18, 16, 14, 12, 10, 8, 6, 4, 2, 0].map((v) => (
            <span key={v}>{v}</span>
          ))}
        </div>
        {/* Bars — staggered grow-from-bottom on first paint */}
        <div className="flex items-end gap-0.5">
          {BAR_DATA.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm origin-bottom motion-safe:animate-[growbar_0.7s_var(--ease-out-quart)_both]"
              style={{
                height: `${(v / MAX) * 100}%`,
                background: `linear-gradient(to top, #5e6ad2, #828fff)`,
                animationDelay: `${i * 35}ms`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 mt-2 text-[10px] text-[color:var(--color-text-tertiary)] font-mono">
        <span>Feb 2025</span>
        <span>May 2025</span>
        <span>Aug 2025</span>
        <span>Nov 2025</span>
      </div>
    </div>
  );
}

function CycleTimeCard() {
  return (
    <div className="rounded-xl border border-[color:var(--color-border-primary)] bg-[color:var(--color-bg-level-2)] p-4">
      <div className="text-[13px] text-[color:var(--color-text-primary)] mb-3 font-medium">
        Cycle time by agent
      </div>
      <div className="flex flex-col gap-2">
        <AgentRow label="Cursor" value={72} color="#828fff" />
        <AgentRow label="Codex" value={58} color="#7170ff" />
        <AgentRow label="No Agent" value={40} color="#62666d" />
      </div>
    </div>
  );
}

function AgentRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="grid grid-cols-[80px_1fr_32px] items-center gap-2 text-[12px]">
      <span className="text-[color:var(--color-text-secondary)] truncate">{label}</span>
      <div className="h-2 rounded-full bg-[color:var(--color-bg-tertiary)] overflow-hidden">
        <div
          className="h-full rounded-full origin-left motion-safe:animate-[growbarx_0.9s_var(--ease-out-quart)_both]"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-[11px] text-[color:var(--color-text-tertiary)] font-mono text-right">{value}h</span>
    </div>
  );
}

function WeeklyPulseCard() {
  return (
    <div className="rounded-xl border border-[color:var(--color-border-primary)] bg-[color:var(--color-bg-level-2)] p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
            Weekly Pulse for
          </div>
          <div className="text-[14px] text-[color:var(--color-text-primary)] mt-0.5 font-medium">
            May 31
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[color:var(--color-bg-tertiary)] text-[12px] text-[color:var(--color-text-primary)]">
            <Play className="w-3 h-3 fill-current" />
            <span>Listen</span>
          </button>
          <button className="flex items-center gap-1 px-2 py-1.5 rounded-md border border-[color:var(--color-border-primary)] text-[12px] text-[color:var(--color-text-secondary)]">
            <span>1.0×</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="text-[11px] uppercase tracking-wider text-[color:var(--color-text-quaternary)]">
        Projects
      </div>

      <ProjectUpdate
        title="UI refresh"
        status="At risk"
        statusColor="#fc7840"
        statusIcon={<AlertTriangle className="w-3 h-3" />}
        meta="By romain · 1 day ago"
        bullets={[
          "iOS implementation is mostly complete, but Android updates are still work in progress",
          "Risk of timeline slip if remaining design decisions aren't finalized soon",
        ]}
      />

      <ProjectUpdate
        title="Tokyo launch"
        status="On track"
        statusColor="#27a644"
        statusIcon={<CircleCheck className="w-3 h-3" />}
        meta="By julian · 3 hours ago"
        bullets={[
          "Localization efforts have been completed",
          "Everything else on track for launch in early September",
        ]}
      />
    </div>
  );
}

function ProjectUpdate({
  title, status, statusColor, statusIcon, meta, bullets,
}: {
  title: string; status: string; statusColor: string; statusIcon: React.ReactNode; meta: string; bullets: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-[12.5px]">
        <span className="font-medium text-[color:var(--color-text-primary)]">{title}</span>
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px]" style={{ background: `color-mix(in oklch, ${statusColor} 14%, transparent)`, color: statusColor }}>
          {statusIcon}
          {status}
        </span>
      </div>
      <div className="text-[11px] text-[color:var(--color-text-tertiary)]">{meta}</div>
      <ul className="flex flex-col gap-0.5 text-[11.5px] text-[color:var(--color-text-secondary)] leading-[1.45]">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-1.5">
            <span className="text-[color:var(--color-text-quaternary)] shrink-0">·</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
