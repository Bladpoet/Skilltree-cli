import type { RelatedConflict, SkillConflict, SkillDataSet, SkillRecord } from "../types/skills";

export interface CategoryGroup {
  category: string;
  skills: SkillRecord[];
}

export function groupSkillsByCategory(data: SkillDataSet): CategoryGroup[] {
  const groups = new Map<string, SkillRecord[]>();

  for (const skill of data.skills) {
    const current = groups.get(skill.category) ?? [];
    current.push(skill);
    groups.set(skill.category, current);
  }

  return Array.from(groups.entries()).map(([category, skills]) => ({
    category,
    skills,
  }));
}

export function getSelectedSkill(data: SkillDataSet, skillId: string | null): SkillRecord | null {
  if (!skillId) {
    return null;
  }

  return data.skills.find((skill) => skill.id === skillId) ?? null;
}

export function getConflictSummaries(data: SkillDataSet, skillId: string | null): SkillConflict[] {
  if (!skillId) {
    return [];
  }

  return data.conflicts.filter((conflict) => conflict.a === skillId || conflict.b === skillId);
}

export function getRelatedConflicts(data: SkillDataSet, skillId: string | null): RelatedConflict[] {
  if (!skillId) {
    return [];
  }

  return getConflictSummaries(data, skillId)
    .map((conflict) => {
      const relatedId = conflict.a === skillId ? conflict.b : conflict.a;
      const relatedSkill = getSelectedSkill(data, relatedId);

      if (!relatedSkill) {
        return null;
      }

      return {
        conflict,
        relatedSkill,
      };
    })
    .filter((entry): entry is RelatedConflict => Boolean(entry));
}
