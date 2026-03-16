import { type ReactNode } from "react";
import { AlertTriangle, ExternalLink, Folder, Sparkles } from "lucide-react";
import { SkillNode } from "./skill-node";
import type { RelatedConflict, SkillRecord } from "../types/skills";

interface SkillDetailPanelProps {
  skill: SkillRecord;
  relatedConflicts: RelatedConflict[];
  onSelectConflict: (skillId: string) => void;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[11px] uppercase tracking-[0.24em] text-[#8c8478]"
      style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
    >
      {children}
    </p>
  );
}

function ConflictItem({
  relatedConflict,
  onSelect,
}: {
  relatedConflict: RelatedConflict;
  onSelect: (skillId: string) => void;
}) {
  const { relatedSkill, conflict } = relatedConflict;

  return (
    <button
      type="button"
      onClick={() => onSelect(relatedSkill.id)}
      className="flex w-full items-start gap-4 border border-[#31353d] bg-[#14171d] px-4 py-4 text-left transition-colors hover:border-[#6b654f] hover:bg-[#181c24]"
    >
      <div className="shrink-0 pt-1">
        <SkillNode
          id={`drawer-${relatedSkill.id}`}
          label={relatedSkill.name}
          iconKey={relatedSkill.name}
          state={relatedSkill.conflictsWith.length > 0 ? "conflict" : "default"}
          interactive={false}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="border border-[#6b654f] px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[#dcb773]"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
          >
            {relatedSkill.category}
          </span>
          <span className="text-xs text-[#9aa2b1]">Click to inspect</span>
        </div>
        <p
          className="break-words text-[18px] text-white"
          style={{ fontFamily: "'Marcellus SC', serif", lineHeight: "1.2" }}
        >
          {relatedSkill.name}
        </p>
        <p className="text-[13px] leading-6 text-[#b8bec9]">{conflict.summary}</p>
      </div>
    </button>
  );
}

export function SkillDetailPanel({
  skill,
  relatedConflicts,
  onSelectConflict,
}: SkillDetailPanelProps) {
  return (
    <div className="flex flex-col gap-8 text-[#d4d8df]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span
            className="w-fit border border-[#6b654f] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#dcb773]"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}
          >
            {skill.category}
          </span>
          {relatedConflicts.length > 0 && (
            <div className="flex items-center gap-2 bg-[linear-gradient(90deg,rgba(129,24,0,0.21)_26.033%,rgba(129,24,0,0)_99.961%)] pr-6">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ffcdcd] text-[#811800]">
                <AlertTriangle size={13} strokeWidth={2.4} />
              </div>
              <span
                className="text-[10px] text-white"
                style={{ fontFamily: "'Marcellus', serif", lineHeight: "14px" }}
              >
                Conflict
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-start gap-3">
          <div className="self-center">
            <SkillNode
              id={`detail-${skill.id}`}
              label={skill.name}
              iconKey={skill.name}
              state="selected"
              interactive={false}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h2
              className="break-words text-white"
              style={{ fontFamily: "'Marcellus SC', serif", fontSize: "32px", lineHeight: "1.15" }}
            >
              {skill.name}
            </h2>
            <div
              className="flex flex-wrap items-center gap-2 text-[#9aa2b1]"
              style={{ fontFamily: "'Marcellus', serif", fontSize: "12px", lineHeight: "16px" }}
            >
              <span>{skill.source}</span>
            </div>
          </div>
          <p className="text-[14px] leading-7 text-[#b8bec9]">{skill.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionLabel>Path</SectionLabel>
        <div className="flex items-start gap-3 border border-[#2f3238] bg-[#111318] px-4 py-3">
          <Folder size={16} className="mt-1 shrink-0 text-[#8c8478]" strokeWidth={1.8} />
          <p className="break-all text-xs leading-6 text-[#d4d8df]" title={skill.path}>
            {skill.path}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionLabel>Triggers List</SectionLabel>
        <div className="flex flex-wrap gap-3">
          {skill.triggers.map((trigger) => (
            <span
              key={trigger}
              className="max-w-full break-words border border-[#31353d] bg-[#14171d] px-3 py-1.5 text-xs text-[#d8dde5]"
              title={trigger}
            >
              {trigger}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionLabel>Source</SectionLabel>
        {skill.sourceUrl ? (
          <a
            href={skill.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="flex w-fit items-center gap-2 text-sm text-[#2563eb] underline underline-offset-2"
          >
            <Sparkles size={14} strokeWidth={1.8} />
            <span>{skill.source}</span>
            <ExternalLink size={14} strokeWidth={1.8} />
          </a>
        ) : (
          <p className="text-sm text-[#9aa2b1]">{skill.source}</p>
        )}
      </div>

      {relatedConflicts.length > 0 && (
        <div className="flex flex-col gap-4 border border-[#2f3238] bg-[#111318] px-4 py-4">
          <div className="flex flex-col gap-2">
            <SectionLabel>Conflict</SectionLabel>
            <p className="text-[14px] leading-7 text-[#b8bec9]">
              This skill overlaps with the following skills. Select one to jump directly to its detail view.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {relatedConflicts.map((entry) => (
              <ConflictItem
                key={entry.relatedSkill.id}
                relatedConflict={entry}
                onSelect={onSelectConflict}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
