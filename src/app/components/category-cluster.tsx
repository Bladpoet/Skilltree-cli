import { useMemo } from "react";
import { CategoryHeader } from "./category-header";
import { SkillNode, type SkillNodeState } from "./skill-node";
import { getCategoryTemplate, type TemplateLine } from "../lib/category-cluster-templates";
import type { SkillRecord } from "../types/skills";
import verticalConnectorSrc from "../../assets/connector-vertical.svg";
import horizontalConnectorSrc from "../../assets/connector-horizontal.svg";


interface CategoryClusterProps {
  categoryName: string;
  skills: SkillRecord[];
  selectedId?: string | null;
  onSelectSkill?: (skillId: string) => void;
}

function DecorativeConnector({ x, y, length, orientation }: TemplateLine) {
  const isVertical = orientation === "vertical";
  const src = isVertical ? verticalConnectorSrc : horizontalConnectorSrc;

  return (
    <img
      src={src}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: isVertical ? 1 : length,
        height: isVertical ? length : 1,
        pointerEvents: "none",
      }}
      alt=""
    />
  );
}

function getSkillState(skill: SkillRecord, isSelected: boolean): SkillNodeState {
  if (isSelected) return "selected";
  return skill.conflictsWith.length > 0 ? "conflict" : "default";
}

function hasOverlap(skill: SkillRecord): boolean {
  return skill.conflictsWith.length > 0;
}

export function CategoryCluster({
  categoryName,
  skills,
  selectedId = null,
  onSelectSkill,
}: CategoryClusterProps) {
  const template = useMemo(() => getCategoryTemplate(skills.length), [skills.length]);

  const slotAssignments = useMemo(
    () =>
      template.fillOrder
        .slice(0, skills.length)
        .map((slotId, index) => ({
          slot: template.slots.find((s) => s.id === slotId)!,
          skill: skills[index],
        }))
        .filter((entry) => Boolean(entry.slot && entry.skill)),
    [skills, template]
  );

  // Note: visibleConnectors filtering kept for backwards compatibility but not used
  // const assignedSlotIds = new Set(slotAssignments.map((a) => a.slot.id));
  // const slotLookup = new Map(template.slots.map((s) => [s.id, s]));
  // const visibleConnectors = template.connectors.filter(
  //   (c) => assignedSlotIds.has(c.fromSlot) && assignedSlotIds.has(c.toSlot)
  // );

  return (
    <section
      className="flex shrink-0 flex-col items-center overflow-visible"
      data-category={categoryName}
      style={{ width: template.width, gap: 34 }}
    >
      <CategoryHeader name={categoryName} />
      <div className="relative overflow-visible" style={{ width: template.width, height: template.height }}>
        {/* Connector lines behind nodes */}
        <div className="pointer-events-none absolute inset-0 overflow-visible">
          {template.lines.map((line) => (
            <DecorativeConnector key={line.id} {...line} />
          ))}
        </div>

        {slotAssignments.map(({ slot, skill }) => (
          <div key={skill.id} className="absolute" style={{ left: slot.x, top: slot.y }}>
            <SkillNode
              id={skill.id}
              label={skill.name}
              iconKey={skill.name}
              iconPath={skill.iconPath}
              iconName={skill.iconName ?? skill.icon}
              showOverlapBadge={hasOverlap(skill)}
              state={getSkillState(skill, selectedId === skill.id)}
              onClick={() => onSelectSkill?.(skill.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
