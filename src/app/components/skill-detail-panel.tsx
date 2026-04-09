import { useMemo, useState } from "react";

import {
  DetailDrawerCopyIcon,
  DetailDrawerSectionHeading,
  DetailDrawerTriggerTag,
} from "./detail-drawer-primitives";
import { SkillNode } from "./skill-node";
import type { RelatedConflict, SkillRecord } from "../types/skills";

interface SkillDetailPanelProps {
  skill: SkillRecord;
  relatedConflicts: RelatedConflict[];
  onSelectConflict: (skillId: string) => void;
}

const DARK = "#282521";

function humanizeSegment(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}


function buildBreadcrumbs(skill: SkillRecord) {
  const normalizedPath = skill.path?.trim();
  if (!normalizedPath) return ["path", "unavailable", "...", "skill", "md"];

  const normalized = normalizedPath.replace(/\\+/g, "/");
  const isWindowsDrive = /^[A-Za-z]:\//.test(normalized);
  const withoutDrive = normalized.replace(/^[A-Za-z]:\//, "");
  const parts = withoutDrive.split("/").filter(Boolean);

  if (parts.length <= 4) {
    return isWindowsDrive ? [normalized.slice(0, 2), ...parts] : parts;
  }

  const head = parts.slice(0, 2);
  const tail = parts.slice(-2);
  return isWindowsDrive ? [normalized.slice(0, 2), ...head, "...", ...tail] : [...head, "...", ...tail];
}


function Breadcrumbs({ skill }: { skill: SkillRecord }) {
  const [copied, setCopied] = useState(false);
  const [copyHovered, setCopyHovered] = useState(false);
  const breadcrumbs = buildBreadcrumbs(skill);
  const pathToCopy = useMemo(() => {
    const normalized = skill.path?.trim();
    return normalized && normalized.length > 0 ? normalized : "Path unavailable";
  }, [skill.path]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pathToCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className="min-w-0 truncate"
        style={{ fontFamily: "'Albertus Nova', serif", fontWeight: 300, fontSize: "12px", lineHeight: "16px", color: "#7E766D" }}
        title={pathToCopy}
      >
        {breadcrumbs.join("/")}
      </div>
      <button
        type="button"
        onClick={handleCopy}
        onMouseEnter={() => setCopyHovered(true)}
        onMouseLeave={() => setCopyHovered(false)}
        className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-visible opacity-90 transition-opacity hover:opacity-100"
        style={{ cursor: "pointer" }}
        title={copied ? "Copied" : "Copy path"}
        aria-label={copied ? "Path copied" : "Copy path"}
      >
        <DetailDrawerCopyIcon isHovered={copyHovered} copied={copied} />
      </button>
    </div>
  );
}

function OverlapNodes({
  entries,
  onSelect,
}: {
  entries: RelatedConflict[];
  onSelect: (skillId: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-[14px]">
      {entries.map((entry) => (
        <button
          key={entry.relatedSkill.id}
          type="button"
          onClick={() => onSelect(entry.relatedSkill.id)}
          className="rounded-sm outline-none transition-transform duration-150 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-[#b79962] focus-visible:outline-offset-2"
          title={humanizeSegment(entry.relatedSkill.name)}
        >
          <SkillNode
            id={`drawer-${entry.relatedSkill.id}`}
            label={humanizeSegment(entry.relatedSkill.name)}
            iconKey={entry.relatedSkill.name}
            iconPath={entry.relatedSkill.iconPath}
            iconName={entry.relatedSkill.iconName ?? entry.relatedSkill.icon}
            interactive={false}
          />
        </button>
      ))}
    </div>
  );
}

export function SkillDetailPanel({ skill, relatedConflicts, onSelectConflict }: SkillDetailPanelProps) {
  return (
    <div className="flex flex-col gap-6" style={{ color: DARK }}>
      <div className="flex flex-col gap-4">
        <h2
          className="break-words"
          style={{ fontFamily: "'Albertus Nova', serif", fontWeight: 400, fontSize: "20px", lineHeight: "1.2", color: DARK }}
        >
          {humanizeSegment(skill.name)}
        </h2>
        <Breadcrumbs skill={skill} />
      </div>

      <p style={{ fontFamily: "'Albertus Nova', serif", fontWeight: 100, fontSize: "15px", lineHeight: "1.6", color: DARK }}>
        {skill.description}
      </p>

      <div className="flex flex-col gap-3">
        <DetailDrawerSectionHeading label="Triggers" />
        <div className="flex flex-col gap-3">
          {skill.triggers.map((trigger) => (
            <DetailDrawerTriggerTag key={trigger} label={trigger} />
          ))}
          {skill.triggers.length === 0 && (
            <span style={{ fontFamily: "'Albertus Nova', serif", fontWeight: 300, fontSize: "14px", color: "#7E766D" }}>
              None defined
            </span>
          )}
        </div>
      </div>

      {skill.compatibility && (
        <div className="flex flex-col gap-3">
          <DetailDrawerSectionHeading label="Compatibility" />
          <p style={{ fontFamily: "'Albertus Nova', serif", fontWeight: 300, fontSize: "14px", lineHeight: "1.5", color: DARK }}>
            {skill.compatibility}
          </p>
        </div>
      )}

      {relatedConflicts.length > 0 && (
        <div className="flex flex-col gap-3">
          <DetailDrawerSectionHeading label="Overlaps" />
          <OverlapNodes entries={relatedConflicts} onSelect={onSelectConflict} />
        </div>
      )}
    </div>
  );
}
