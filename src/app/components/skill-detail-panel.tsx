import { SkillNode } from "./skill-node";
import type { RelatedConflict, SkillRecord } from "../types/skills";
import {
  DetailDrawerCopyIcon,
  DetailDrawerSectionHeading,
  DetailDrawerTriggerTag,
} from "./detail-drawer-primitives";
import { Globe } from "lucide-react";
import { useMemo, useState } from "react";

interface SkillDetailPanelProps {
  skill: SkillRecord;
  relatedConflicts: RelatedConflict[];
  onSelectConflict: (skillId: string) => void;
}

const DARK = "rgb(25,26,28)";

interface SourceAffiliation {
  label: string;
  url: string;
}

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

function resolveSourceAffiliation(skill: SkillRecord): SourceAffiliation {
  const haystack = `${skill.source} ${skill.sourceUrl ?? ""} ${skill.path}`.toLowerCase();

  if (haystack.includes("openai")) {
    return { label: "OpenAI", url: "https://openai.com" };
  }

  if (haystack.includes("anthropic") || haystack.includes("local/manual-install") || haystack.includes("/.claude/")) {
    return { label: "Anthropic", url: "https://www.anthropic.com" };
  }

  if (haystack.includes("github") || skill.source.includes("/") || skill.sourceUrl) {
    return { label: "GitHub", url: "https://github.com" };
  }

  return { label: "GitHub", url: "https://github.com" };
}

function Breadcrumbs({ skill }: { skill: SkillRecord }) {
  const [copied, setCopied] = useState(false);
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
    <div className="flex items-center gap-2">
      <div
        className="min-w-0 truncate"
        style={{ fontFamily: "'Marcellus', serif", fontSize: "12px", lineHeight: "1.33", color: "rgb(109,115,126)" }}
        title={pathToCopy}
      >
        {breadcrumbs.join("/")}
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center opacity-90 transition-opacity hover:opacity-100"
        title={copied ? "Copied" : "Copy path"}
        aria-label={copied ? "Path copied" : "Copy path"}
      >
        <DetailDrawerCopyIcon />
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
  const dependents = skill.dependents ?? [];
  const sourceAffiliation = resolveSourceAffiliation(skill);

  return (
    <div className="flex flex-col gap-6" style={{ color: DARK }}>
      {/* Skill name + breadcrumbs */}
      <div className="flex flex-col gap-1">
        <h2
          className="break-words"
          style={{ fontFamily: "'Marcellus SC', serif", fontSize: "28px", lineHeight: "1.1", color: DARK }}
        >
          {humanizeSegment(skill.name)}
        </h2>
        <Breadcrumbs skill={skill} />
      </div>

      {/* Description */}
      <p style={{ fontFamily: "'Marcellus', serif", fontSize: "16px", lineHeight: "1.6", color: DARK }}>
        {skill.description}
      </p>

      {/* Triggers */}
      <div className="flex flex-col gap-3">
        <DetailDrawerSectionHeading label="Triggers" />
        <div className="flex flex-col gap-3">
          {skill.triggers.map((trigger) => (
            <DetailDrawerTriggerTag key={trigger} label={trigger} />
          ))}
          {skill.triggers.length === 0 && (
            <span style={{ fontFamily: "'Marcellus', serif", fontSize: "14px", color: "rgb(109,115,126)" }}>
              None defined
            </span>
          )}
        </div>
      </div>

      {/* Dependents */}
      {dependents.length > 0 && (
        <div className="flex flex-col gap-3">
          <DetailDrawerSectionHeading label="Dependents" />
          <div className="flex flex-col gap-1">
            {dependents.map((dep) => (
              <div
                key={dep}
                style={{ fontFamily: "'Marcellus', serif", fontSize: "14px", lineHeight: "1.5", color: DARK }}
              >
                <span style={{ color: "rgb(109,115,126)", marginRight: 6 }}>↳</span>
                {humanizeSegment(dep)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source */}
      <div className="flex flex-col gap-3">
        <DetailDrawerSectionHeading label="Source" />
        <a
          href={sourceAffiliation.url}
          target="_blank"
          rel="noreferrer"
          className="flex w-fit items-center gap-2 transition-opacity hover:opacity-80"
          style={{ fontFamily: "'Marcellus', serif", fontSize: "14px", lineHeight: "1.4", color: DARK }}
        >
          <Globe size={16} className="shrink-0" style={{ color: "rgb(109,115,126)" }} />
          <span className="underline underline-offset-2">{sourceAffiliation.label}</span>
        </a>
      </div>

      {/* Overlaps */}
      {relatedConflicts.length > 0 && (
        <div className="flex flex-col gap-3">
          <DetailDrawerSectionHeading label="Overlaps" />
          <OverlapNodes entries={relatedConflicts} onSelect={onSelectConflict} />
        </div>
      )}
    </div>
  );
}
