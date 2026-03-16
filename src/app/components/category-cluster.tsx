import { useMemo } from "react";
import { CategoryHeader } from "./category-header";
import { SkillNode, type SkillNodeState } from "./skill-node";
import { getCategoryTemplate, type ClusterOrientation } from "../lib/category-cluster-templates";
import type { SkillRecord } from "../types/skills";

interface CategoryClusterProps {
  categoryName: string;
  orientation?: ClusterOrientation;
  skills: SkillRecord[];
  selectedId?: string | null;
  onSelectSkill?: (skillId: string) => void;
}

const HEX_SIZE = 94;
const HEX_RADIUS = 38;

function DecorativeConnector({
  from,
  to,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length <= HEX_RADIUS * 2) {
    return null;
  }

  const unitX = dx / length;
  const unitY = dy / length;

  const x1 = from.x + unitX * HEX_RADIUS;
  const y1 = from.y + unitY * HEX_RADIUS;
  const x2 = to.x - unitX * HEX_RADIUS;
  const y2 = to.y - unitY * HEX_RADIUS;

  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(220, 183, 115, 0.08)" strokeLinecap="round" strokeWidth="7" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(240, 241, 243, 0.14)" strokeLinecap="round" strokeWidth="2.75" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(224, 228, 235, 0.44)" strokeLinecap="round" strokeWidth="0.85" />
    </>
  );
}

function getSkillState(skill: SkillRecord, isSelected: boolean): SkillNodeState {
  if (isSelected) {
    return "selected";
  }

  return skill.conflictsWith.length > 0 ? "conflict" : "default";
}

export function CategoryCluster({
  categoryName,
  orientation = 1,
  skills,
  selectedId = null,
  onSelectSkill,
}: CategoryClusterProps) {
  const template = getCategoryTemplate(orientation);

  const visibleSlotIds = useMemo(
    () => template.fillOrder.slice(0, skills.length),
    [skills.length, template.fillOrder]
  );

  const slotAssignments = useMemo(
    () =>
      visibleSlotIds
        .map((slotId, index) => ({
          slot: template.slots.find((entry) => entry.id === slotId),
          skill: skills[index],
        }))
        .filter(
          (entry): entry is { slot: (typeof template.slots)[number]; skill: SkillRecord } =>
            Boolean(entry.slot && entry.skill)
        ),
    [skills, template.slots, visibleSlotIds]
  );

  const visibleSlots = new Set(visibleSlotIds);
  const visibleConnectors = template.connectors.filter((connector) =>
    connector.visibleWhenSlots.every((slotId) => visibleSlots.has(slotId))
  );

  const slotLookup = new Map(template.slots.map((slot) => [slot.id, slot]));

  return (
    <section
      className="flex shrink-0 flex-col items-center gap-8 overflow-visible"
      data-category={categoryName}
      data-orientation={orientation}
      style={{ width: template.width }}
    >
      <CategoryHeader name={categoryName} />
      <div className="relative overflow-visible" style={{ width: template.width, height: template.height + 12 }}>
        <div className="pointer-events-none absolute inset-0 overflow-visible">
          <svg className="absolute inset-0 h-full w-full overflow-visible" fill="none" viewBox={`0 0 ${template.width} ${template.height + 12}`}>
            {visibleConnectors.map((connector) => {
              const fromSlot = slotLookup.get(connector.fromSlot);
              const toSlot = slotLookup.get(connector.toSlot);

              if (!fromSlot || !toSlot) {
                return null;
              }

              return (
                <DecorativeConnector
                  key={connector.id}
                  from={{ x: fromSlot.x + HEX_SIZE / 2, y: fromSlot.y + HEX_SIZE / 2 }}
                  to={{ x: toSlot.x + HEX_SIZE / 2, y: toSlot.y + HEX_SIZE / 2 }}
                />
              );
            })}
          </svg>
        </div>

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
