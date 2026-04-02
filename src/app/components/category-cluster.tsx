import { useMemo } from "react";
import { CategoryHeader } from "./category-header";
import type { CategoryHeaderVariant } from "./category-header";
import { SkillNode, type SkillNodeState } from "./skill-node";
import { getCategoryTemplate } from "../lib/category-cluster-templates";
import type { SkillRecord } from "../types/skills";

// Node container dimensions from skill-node.tsx
const NODE_W = 89;
const NODE_H = 87;

interface CategoryClusterProps {
  categoryName: string;
  skills: SkillRecord[];
  selectedId?: string | null;
  onSelectSkill?: (skillId: string) => void;
}

function DecorativeConnector({ from, to }: { from: [number, number]; to: [number, number] }) {
  return (
    <>
      <line
        x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]}
        stroke="rgba(194,174,135,0.15)"
        strokeLinecap="round"
        strokeWidth={5}
      />
      <line
        x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]}
        stroke="rgba(194,174,135,0.5)"
        strokeLinecap="round"
        strokeWidth={1}
      />
    </>
  );
}

function getSkillState(skill: SkillRecord, isSelected: boolean): SkillNodeState {
  if (isSelected) return "selected";
  return skill.conflictsWith.length > 0 ? "conflict" : "default";
}

export function CategoryCluster({
  categoryName,
  skills,
  selectedId = null,
  onSelectSkill,
}: CategoryClusterProps) {
  const template = useMemo(() => getCategoryTemplate(skills.length), [skills.length]);
  const headerVariant: CategoryHeaderVariant = template.id === "2" ? "full" : "indented";

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

  const assignedSlotIds = new Set(slotAssignments.map((a) => a.slot.id));
  const slotLookup = new Map(template.slots.map((s) => [s.id, s]));

  const visibleConnectors = template.connectors.filter(
    (c) => assignedSlotIds.has(c.fromSlot) && assignedSlotIds.has(c.toSlot)
  );

  return (
    <section
      className="flex shrink-0 flex-col items-center overflow-visible"
      data-category={categoryName}
      style={{ width: template.width, gap: 34 }}
    >
      <CategoryHeader name={categoryName} variant={headerVariant} />
      <div className="relative overflow-visible" style={{ width: template.width, height: template.height }}>
        {/* Connector lines behind nodes */}
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={template.width}
          height={template.height}
          fill="none"
        >
          {visibleConnectors.map((connector) => {
            const from = slotLookup.get(connector.fromSlot)!;
            const to = slotLookup.get(connector.toSlot)!;
            return (
              <DecorativeConnector
                key={connector.id}
                from={[from.x + NODE_W / 2, from.y + NODE_H / 2]}
                to={[to.x + NODE_W / 2, to.y + NODE_H / 2]}
              />
            );
          })}
        </svg>

        {slotAssignments.map(({ slot, skill }) => (
          <div key={skill.id} className="absolute" style={{ left: slot.x, top: slot.y }}>
            <SkillNode
              id={skill.id}
              label={skill.name}
              iconKey={skill.name}
              state={getSkillState(skill, selectedId === skill.id)}
              onClick={() => onSelectSkill?.(skill.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
