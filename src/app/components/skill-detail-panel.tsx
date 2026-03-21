import { SkillNode } from "./skill-node";
import type { RelatedConflict, SkillRecord } from "../types/skills";
import {
  DetailDrawerConflictPill,
  DetailDrawerSectionHeading,
  DetailDrawerSourceIcon,
  DetailDrawerTriggerTag,
} from "./detail-drawer-primitives";

interface SkillDetailPanelProps {
  skill: SkillRecord;
  relatedConflicts: RelatedConflict[];
  onSelectConflict: (skillId: string) => void;
}

function humanizeSegment(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function joinHumanList(values: string[]) {
  if (values.length <= 1) {
    return values[0] ?? "";
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function buildBreadcrumbs(skill: SkillRecord) {
  const sourceSegments = skill.source.split("/").filter(Boolean).map(humanizeSegment);

  if (sourceSegments.length >= 2) {
    return [sourceSegments[0], sourceSegments[1], "..."];
  }

  const pathSegments = skill.path
    .split(/[\\/]+/)
    .filter(Boolean)
    .slice(-4, -1)
    .map(humanizeSegment);

  if (pathSegments.length >= 2) {
    return [pathSegments[0], pathSegments[1], "..."];
  }

  return [humanizeSegment(skill.category), humanizeSegment(skill.name), "..."];
}

function buildConflictCopy(relatedConflicts: RelatedConflict[]) {
  if (relatedConflicts.length === 0) {
    return "";
  }

  if (relatedConflicts.length === 1) {
    return relatedConflicts[0].conflict.summary;
  }

  const names = relatedConflicts
    .slice(0, 3)
    .map((entry) => humanizeSegment(entry.relatedSkill.name));
  const extraCount = relatedConflicts.length - names.length;
  const suffix = extraCount > 0 ? `, and ${extraCount} more` : "";

  return `This skill conflicts with ${joinHumanList(names)}${suffix}. Select a node to inspect the conflicting skill.`;
}

function Breadcrumbs({ skill }: { skill: SkillRecord }) {
  const breadcrumbs = buildBreadcrumbs(skill);

  return (
    <div
      className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[#9aa2b1]"
      style={{
        fontFamily: "'Marcellus', serif",
        fontSize: "12px",
        lineHeight: "1.33",
      }}
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

function ConflictNodes({
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

export function SkillDetailPanel({
  skill,
  relatedConflicts,
  onSelectConflict,
}: SkillDetailPanelProps) {
  return (
    <div className="flex flex-col gap-10 text-white">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2
              className="break-words text-white"
              style={{
                fontFamily: "'Marcellus SC', serif",
                fontSize: "32px",
                lineHeight: "1.1",
              }}
            >
              {humanizeSegment(skill.name)}
            </h2>
            <Breadcrumbs skill={skill} />
          </div>
          <p
            className="text-white"
            style={{
              fontFamily: "'Marcellus', serif",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            {skill.description}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <DetailDrawerSectionHeading label="Triggers list" />
          <div className="flex flex-wrap items-center gap-4 overflow-hidden">
            {skill.triggers.map((trigger) => (
              <DetailDrawerTriggerTag key={trigger} label={trigger} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <DetailDrawerSectionHeading label="Source" />
          {skill.sourceUrl ? (
            <a
              href={skill.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-fit items-center gap-1 text-[#2563eb] transition-opacity hover:opacity-90"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                lineHeight: "1.33",
                fontWeight: 500,
              }}
            >
              <DetailDrawerSourceIcon />
              <span>{skill.source}</span>
            </a>
          ) : (
            <div
              className="flex w-fit items-center gap-1 text-[#2563eb]"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                lineHeight: "1.33",
                fontWeight: 500,
              }}
            >
              <DetailDrawerSourceIcon />
              <span>{skill.source}</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-[#837f76]" />

      {relatedConflicts.length > 0 && (
        <div className="flex flex-col gap-4">
          <DetailDrawerConflictPill />
          <p
            className="text-white"
            style={{
              fontFamily: "'Marcellus', serif",
              fontSize: "14px",
              lineHeight: "1.55",
            }}
          >
            {buildConflictCopy(relatedConflicts)}
          </p>
          <ConflictNodes entries={relatedConflicts} onSelect={onSelectConflict} />
        </div>
      )}
    </div>
  );
}
