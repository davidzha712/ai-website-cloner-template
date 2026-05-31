import { CircleDot, Plus, MoreHorizontal, AlertCircle, Bug, Palette, Cpu, Activity, Code2, Paperclip, Smile, AtSign, Video, Mic, Send } from "lucide-react";
import { Avatar, IllustrationFrame, LabelPill } from "./shared";

/**
 * Section 1 (1.0 Intake) — 4-column Kanban with real issue cards + Slack
 * thread overlay. Text verbatim from linear.app a11y tree (uid_195 onwards).
 */
export function IntakeIllustration() {
  return (
    <IllustrationFrame>
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-2 p-3 overflow-hidden">
        <KanbanColumn title="Backlog" count={8}>
          <IssueCard prio={<Bug className="w-3 h-3 text-[#fc7840]" />} id="ENG-2085" title="Reduce UI flicker during autonomy..." />
          <IssueCard prio={<Activity className="w-3 h-3 text-[#fc7840]" />} id="ENG-2094" title="Add buffering for autonomy event streams" />
          <IssueCard prio={<Cpu className="w-3 h-3 text-[#4ea7fc]" />} id="ENG-2092" title="Reduce startup delay caused by vehicle sync" />
          <IssueCard prio={<AlertCircle className="w-3 h-3 text-[#eb5757]" />} id="ENG-2200" title="Fix delayed route updates during rerouting" />
        </KanbanColumn>

        <KanbanColumn title="Todo" count={71}>
          <IssueCard prio={<Palette className="w-3 h-3 text-[#7170ff]" />} id="ENG-926" title="Remove UI inconsistencies" labels={[<LabelPill key="b" color="#fc7840" small>Bug</LabelPill>, <LabelPill key="d" color="#7170ff" small>Design</LabelPill>]} />
          <IssueCard prio={<Bug className="w-3 h-3 text-[#eb5757]" />} id="ENG-2088" title="TypeError: Cannot read properties" labels={[<LabelPill key="b" color="#eb5757" small>Bug</LabelPill>]} />
          <IssueCard prio={<Cpu className="w-3 h-3 text-[#7170ff]" />} id="ENG-924" title="Upgrade to Claude Opus 4.5" labels={[<LabelPill key="ai" color="#7170ff" small>AI</LabelPill>]} />
          <IssueCard prio={<Activity className="w-3 h-3 text-[#fc7840]" />} id="ENG-1882" title="Optimize load times" labels={[<LabelPill key="p" color="#fc7840" small>Performance</LabelPill>]} />
        </KanbanColumn>

        <KanbanColumn title="In Progress" count={3}>
          <IssueCard prio={<Code2 className="w-3 h-3 text-[#f0bf00]" />} id="ENG-1487" title="Remove contentData from GraphQL API" meta="61039" />
          <IssueCard prio={<Palette className="w-3 h-3 text-[#f0bf00]" />} id="MKT-1028" title="Launch page assets" labels={[<LabelPill key="d" color="#7170ff" small>Design</LabelPill>]} />
          <IssueCard prio={<Bug className="w-3 h-3 text-[#f0bf00]" />} id="ENG-2187" title="Prevent duplicate ride requests on poor..." labels={[<LabelPill key="b" color="#eb5757" small>Bug</LabelPill>]} meta="62048" />
        </KanbanColumn>

        <KanbanColumn title="Done" count={53}>
          <IssueCard prio={<Code2 className="w-3 h-3 text-[#27a644]" />} id="ENG-2074" title="Clean up deprecated APIs..." labels={[<LabelPill key="api" color="#4ea7fc" small>API</LabelPill>]} meta="61002" done />
          <IssueCard prio={<Activity className="w-3 h-3 text-[#27a644]" />} id="ENG-1912" title="Reduce latency in autonomy st..." meta="61005" done />
          <IssueCard prio={<Cpu className="w-3 h-3 text-[#27a644]" />} id="ENG-1951" title="Reduce ETA fluctuations durin..." meta="61202" done />
          <IssueCard prio={<Palette className="w-3 h-3 text-[#27a644]" />} id="ENG-1960" title="Improve fallback messaging" labels={[<LabelPill key="ui" color="#7170ff" small>UI</LabelPill>]} meta="61149" done />
          <IssueCard prio={<Activity className="w-3 h-3 text-[#27a644]" />} id="ENG-1991" title="Improve rider visibility into veh..." done />
        </KanbanColumn>
      </div>

      {/* Floating Slack thread overlay — anchored bottom-left */}
      <SlackThreadOverlay />
    </IllustrationFrame>
  );
}

function KanbanColumn({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-0 overflow-hidden">
      <div className="flex items-center justify-between px-2 py-1.5 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="text-[color:var(--color-text-primary)] font-medium">{title}</span>
          <span className="text-[color:var(--color-text-tertiary)]">{count}</span>
        </div>
        <div className="flex items-center gap-0.5 text-[color:var(--color-text-tertiary)]">
          <button className="p-0.5 rounded hover:bg-[color:var(--color-bg-translucent)]"><Plus className="w-3 h-3" /></button>
          <button className="p-0.5 rounded hover:bg-[color:var(--color-bg-translucent)]"><MoreHorizontal className="w-3 h-3" /></button>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function IssueCard({
  prio,
  id,
  title,
  labels,
  meta,
  done = false,
}: {
  prio: React.ReactNode;
  id: string;
  title: string;
  labels?: React.ReactNode[];
  meta?: string;
  done?: boolean;
}) {
  return (
    <div className="rounded-md border border-[color:var(--color-border-translucent)] bg-[color:var(--color-bg-level-2)] p-2 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-[11px] text-[color:var(--color-text-tertiary)]">
        <span className="shrink-0">{prio}</span>
        <span className="font-mono">{id}</span>
        {meta && <span className="ml-auto font-mono opacity-70">{meta}</span>}
      </div>
      <p className={done ? "text-[11.5px] leading-[1.4] line-through text-[color:var(--color-text-tertiary)]" : "text-[11.5px] leading-[1.4] text-[color:var(--color-text-primary)]"}>
        {title}
      </p>
      {labels && labels.length > 0 && (
        <div className="flex flex-wrap gap-1">{labels}</div>
      )}
    </div>
  );
}

function SlackThreadOverlay() {
  return (
    <div className="hidden md:block absolute left-6 bottom-4 w-[400px] lg:w-[520px] rounded-xl border border-[color:var(--color-border-primary)] bg-[color:var(--color-bg-level-2)] shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden">
      {/* Thread header */}
      <div className="px-3 py-2 border-b border-[color:var(--color-border-translucent)] text-[11px] text-[color:var(--color-text-tertiary)]">
        Thread in <span className="text-[color:var(--color-text-primary)]">#feedback</span>
      </div>
      {/* Messages */}
      <div className="px-3 py-2.5 flex flex-col gap-2.5">
        <SlackMsg name="didier" color="#fc7840" time="12:14 AM" body="Has anyone been looking into the iOS startup performance issues?" />
        <SlackMsg name="lena" color="#7170ff" time="12:14 AM" body="Anyone else noticing the iOS app feels slow to open if you haven't used it in a bit?" />
        <SlackMsg name="didier" color="#fc7840" time="12:14 AM" body="Yea, we're still blocking initial render on a full vehicle_state sync every time..." />
        <SlackMsg name="andreas" color="#27a644" time="12:14 AM" body="Feels like we could render sooner and load the rest in the background. Probably also worth tracking startup timing so we know how often this happens!" />
      </div>
      {/* Composer */}
      <div className="border-t border-[color:var(--color-border-translucent)] p-2">
        <div className="rounded-md border border-[color:var(--color-border-primary)] bg-[color:var(--color-bg-level-3)] px-2 py-1.5 text-[12px]">
          <span className="text-[#828fff]">@Linear</span>{" "}
          <span className="text-[color:var(--color-text-secondary)]">create </span>
          <span className="bg-[color:var(--color-bg-quaternary)] px-1 py-px rounded text-[color:var(--color-text-primary)]">urgent issues</span>
          <span className="text-[color:var(--color-text-secondary)]"> and assign to me</span>
        </div>
        <div className="flex items-center gap-1 mt-1.5 text-[color:var(--color-text-tertiary)]">
          <button className="p-1 hover:text-[color:var(--color-text-secondary)]"><Plus className="w-3.5 h-3.5" /></button>
          <button className="p-1 hover:text-[color:var(--color-text-secondary)] font-mono text-[11px]">Aa</button>
          <button className="p-1 hover:text-[color:var(--color-text-secondary)]"><Smile className="w-3.5 h-3.5" /></button>
          <button className="p-1 hover:text-[color:var(--color-text-secondary)]"><AtSign className="w-3.5 h-3.5" /></button>
          <button className="p-1 hover:text-[color:var(--color-text-secondary)]"><Video className="w-3.5 h-3.5" /></button>
          <button className="p-1 hover:text-[color:var(--color-text-secondary)]"><Mic className="w-3.5 h-3.5" /></button>
          <button className="p-1 hover:text-[color:var(--color-text-secondary)]"><Code2 className="w-3.5 h-3.5" /></button>
          <button className="ml-auto p-1 rounded bg-[color:var(--color-brand-bg)] text-white"><Send className="w-3 h-3" /></button>
        </div>
      </div>
    </div>
  );
}

function SlackMsg({ name, color, time, body }: { name: string; color: string; time: string; body: string }) {
  return (
    <div className="flex items-start gap-2 text-[12px]">
      <Avatar initial={name[0]} color={color} size={20} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="font-medium text-[color:var(--color-text-primary)]">{name}</span>
          <span className="text-[10px] text-[color:var(--color-text-tertiary)]">{time}</span>
        </div>
        <p className="text-[color:var(--color-text-secondary)] leading-[1.4]">{body}</p>
      </div>
    </div>
  );
}
