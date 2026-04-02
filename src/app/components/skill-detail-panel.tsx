import { SkillNode } from "./skill-node";
import type { RelatedConflict, SkillRecord } from "../types/skills";
import {
  DetailDrawerSectionHeading,
  DetailDrawerTriggerTag,
} from "./detail-drawer-primitives";
import { Globe } from "lucide-react";

interface SkillDetailPanelProps {
  skill: SkillRecord;
  relatedConflicts: RelatedConflict[];
  onSelectConflict: (skillId: string) => void;
}

const DARK = "rgb(25,26,28)";

function humanizeSegment(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildBreadcrumbs(skill: SkillRecord) {
  const sourceSegments = skill.source.split("/").filter(Boolean).map(humanizeSegment);
  if (sourceSegments.length >= 2) return [sourceSegments[0], sourceSegments[1], "..."];

  const pathSegments = skill.path
    .split(/[\\/]+/)
    .filter(Boolean)
    .slice(-4, -1)
    .map(humanizeSegment);

  if (pathSegments.length >= 2) return [pathSegments[0], pathSegments[1], "..."];
  return [humanizeSegment(skill.category), humanizeSegment(skill.name), "..."];
}

function Breadcrumbs({ skill }: { skill: SkillRecord }) {
  const breadcrumbs = buildBreadcrumbs(skill);
  return (
    <div
      className="flex flex-wrap items-center gap-x-1 gap-y-1"
      style={{ fontFamily: "'Marcellus', serif", fontSize: "12px", lineHeight: "1.33", color: "rgb(109,115,126)" }}
    >
      {breadcrumbs.map((crumb, index) => (
        <span key={`${crumb}-${index}`} className="contents">
          {index > 0 && <span>/</span>}
          <span>{crumb}</span>
        </span>
      ))}
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
            interactive={false}
          />
        </button>
      ))}
    </div>
  );
}

export function SkillDetailPanel({ skill, relatedConflicts, onSelectConflict }: SkillDetailPanelProps) {
  const dependents = skill.dependents ?? [];

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
        {skill.sourceUrl ? (
          <a
            href={skill.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="flex w-fit items-center gap-2 transition-opacity hover:opacity-80"
            style={{ fontFamily: "'Marcellus', serif", fontSize: "14px", lineHeight: "1.4", color: DARK }}
          >
            <Globe size={16} className="shrink-0" style={{ color: "rgb(109,115,126)" }} />
            <span className="underline underline-offset-2">{skill.source}</span>
          </a>
        ) : (
          <div
            className="flex w-fit items-center gap-2"
            style={{ fontFamily: "'Marcellus', serif", fontSize: "14px", lineHeight: "1.4", color: DARK }}
          >
            <Globe size={16} className="shrink-0" style={{ color: "rgb(109,115,126)" }} />
            <span>{skill.source}</span>
          </div>
        )}
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
