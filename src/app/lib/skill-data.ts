import { useEffect, useMemo, useState } from "react";
import mockData from "../../../mock-skills.json";
import type { SkillConflict, SkillDataSet, SkillMetaCounts, SkillRecord } from "../types/skills";

type DataMode = "auto" | "mock" | "real";

interface RawSkillLike {
  id?: unknown;
  name?: unknown;
  title?: unknown;
  category?: unknown;
  group?: unknown;
  description?: unknown;
  summary?: unknown;
  triggers?: unknown;
  trigger?: unknown;
  dependents?: unknown;
  dependent?: unknown;
  path?: unknown;
  filePath?: unknown;
  source?: unknown;
  installedFrom?: unknown;
  sourceUrl?: unknown;
  url?: unknown;
  conflictsWith?: unknown;
  icon?: unknown;
  iconName?: unknown;
  iconFile?: unknown;
  iconPath?: unknown;
  iconSource?: unknown;
  iconScore?: unknown;
  tags?: unknown;
  shortDescription?: unknown;
  license?: unknown;
  compatibility?: unknown;
  allowedTools?: unknown;
  "allowed-tools"?: unknown;
}

interface RawConflictLike {
  a?: unknown;
  b?: unknown;
  aName?: unknown;
  bName?: unknown;
  summary?: unknown;
}

interface RawSkillDataSetLike {
  skills?: unknown;
  conflicts?: unknown;
  meta?: {
    source?: unknown;
    isMockData?: unknown;
    scannedAt?: unknown;
    counts?: Partial<SkillMetaCounts> | null;
    iconAssignments?: {
      assigned?: unknown;
      unique?: unknown;
      librarySize?: unknown;
      missingFiles?: unknown;
    } | null;
  } | null;
}

interface NormalizedDataResult {
  data: SkillDataSet;
  schemaDifferences: string[];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return [value];
  }

  return [];
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function noteDifference(schemaDifferences: Set<string>, message: string) {
  schemaDifferences.add(message);
}

function getDataMode(): DataMode {
  if (typeof window === "undefined") {
    return "auto";
  }

  const params = new URLSearchParams(window.location.search);
  const requested = params.get("data");

  if (requested === "mock" || requested === "real" || requested === "auto") {
    return requested;
  }

  return "auto";
}

function normalizeSkill(rawSkill: RawSkillLike, index: number, schemaDifferences: Set<string>): SkillRecord {
  const id = asString(rawSkill.id, `skill-${index + 1}`);
  const name = asString(rawSkill.name) || asString(rawSkill.title) || id;
  const category = asString(rawSkill.category) || asString(rawSkill.group) || "Uncategorized";
  const description = asString(rawSkill.description) || asString(rawSkill.summary) || "No description available.";
  const triggers = asStringArray(rawSkill.triggers).length > 0
    ? asStringArray(rawSkill.triggers)
    : asStringArray(rawSkill.trigger);
  const dependents = asStringArray(rawSkill.dependents).length > 0
    ? asStringArray(rawSkill.dependents)
    : asStringArray(rawSkill.dependent);
  const path = asString(rawSkill.path) || asString(rawSkill.filePath) || "Path unavailable";
  const source = asString(rawSkill.source, "Unknown source");
  const installedFrom = asString(rawSkill.installedFrom) || undefined;
  const sourceUrl = asString(rawSkill.sourceUrl) || asString(rawSkill.url) || null;
  const conflictsWith = asStringArray(rawSkill.conflictsWith);
  const icon = asString(rawSkill.icon) || undefined;
  const iconName = asString(rawSkill.iconName) || undefined;
  const iconFile = asString(rawSkill.iconFile) || undefined;
  const iconPath = asString(rawSkill.iconPath) || undefined;
  const iconSource = asString(rawSkill.iconSource) || undefined;
  const iconScore = asNumber(rawSkill.iconScore);
  const tags = asStringArray(rawSkill.tags);
  const shortDescription = asString(rawSkill.shortDescription) || undefined;
  const license = asString(rawSkill.license) || undefined;
  const compatibility = asString(rawSkill.compatibility) || undefined;
  const allowedTools = asStringArray(rawSkill.allowedTools ?? rawSkill["allowed-tools"]);

  if (!asString(rawSkill.name) && asString(rawSkill.title)) {
    noteDifference(schemaDifferences, "Used `title` as the skill name when `name` was missing.");
  }

  if (!asString(rawSkill.category) && asString(rawSkill.group)) {
    noteDifference(schemaDifferences, "Used `group` as the category when `category` was missing.");
  }

  if (!asString(rawSkill.path) && asString(rawSkill.filePath)) {
    noteDifference(schemaDifferences, "Used `filePath` as the path when `path` was missing.");
  }

  if (!Array.isArray(rawSkill.triggers) && rawSkill.trigger !== undefined) {
    noteDifference(schemaDifferences, "Used `trigger` when `triggers` was missing or not an array.");
  }

  if (!Array.isArray(rawSkill.dependents) && rawSkill.dependent !== undefined) {
    noteDifference(schemaDifferences, "Used `dependent` when `dependents` was missing or not an array.");
  }

  return {
    id,
    name,
    category,
    description,
    triggers,
    dependents: dependents.length > 0 ? dependents : undefined,
    path,
    source,
    installedFrom,
    sourceUrl,
    conflictsWith,
    icon,
    iconName,
    iconFile,
    iconPath,
    iconSource,
    iconScore,
    tags: tags.length > 0 ? tags : undefined,
    shortDescription,
    license,
    compatibility,
    allowedTools: allowedTools.length > 0 ? allowedTools : undefined,
  };
}

function createDerivedConflicts(skills: SkillRecord[]): SkillConflict[] {
  const seen = new Set<string>();
  const conflicts: SkillConflict[] = [];
  const byId = new Map(skills.map((skill) => [skill.id, skill]));

  for (const skill of skills) {
    for (const relatedId of skill.conflictsWith) {
      const relatedSkill = byId.get(relatedId);
      if (!relatedSkill) {
        continue;
      }

      const key = [skill.id, relatedId].sort().join("::");
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);

      conflicts.push({
        a: skill.id,
        b: relatedId,
        aName: skill.name,
        bName: relatedSkill.name,
        summary: `${skill.name} overlaps with ${relatedSkill.name}.`,
      });
    }
  }

  return conflicts;
}

function normalizeConflicts(rawConflicts: unknown, skills: SkillRecord[], schemaDifferences: Set<string>): SkillConflict[] {
  if (!Array.isArray(rawConflicts)) {
    if (skills.some((skill) => skill.conflictsWith.length > 0)) {
      noteDifference(
        schemaDifferences,
        "Derived top-level conflicts from `skills[].conflictsWith` because `conflicts` was missing.",
      );
    }
    return createDerivedConflicts(skills);
  }

  return rawConflicts
    .map((rawConflict) => {
      if (!isObject(rawConflict)) {
        return null;
      }

      const conflict = rawConflict as RawConflictLike;
      const a = asString(conflict.a);
      const b = asString(conflict.b);
      if (!a || !b) {
        return null;
      }

      const skillA = skills.find((skill) => skill.id === a);
      const skillB = skills.find((skill) => skill.id === b);

      return {
        a,
        b,
        aName: asString(conflict.aName) || skillA?.name || a,
        bName: asString(conflict.bName) || skillB?.name || b,
        summary:
          asString(conflict.summary) ||
          `${skillA?.name ?? a} overlaps with ${skillB?.name ?? b}.`,
      };
    })
    .filter((conflict): conflict is SkillConflict => Boolean(conflict));
}

function buildCounts(skills: SkillRecord[], conflicts: SkillConflict[], rawCounts?: Partial<SkillMetaCounts> | null): SkillMetaCounts {
  const conflictingSkillIds = new Set<string>();
  for (const conflict of conflicts) {
    conflictingSkillIds.add(conflict.a);
    conflictingSkillIds.add(conflict.b);
  }

  return {
    categories: rawCounts?.categories ?? new Set(skills.map((skill) => skill.category)).size,
    skills: rawCounts?.skills ?? skills.length,
    conflicting: rawCounts?.conflicting ?? conflictingSkillIds.size,
    similar: rawCounts?.similar ?? 0,
  };
}

export function normalizeSkillData(rawData: unknown, options?: { fallbackSource?: string; isMockData?: boolean }): NormalizedDataResult {
  const schemaDifferences = new Set<string>();
  const fallbackSource = options?.fallbackSource ?? "unknown";
  const isMockData = options?.isMockData ?? false;

  const rawDataSet = isObject(rawData) ? (rawData as RawSkillDataSetLike) : {};
  let rawSkills = rawDataSet.skills;

  if (!Array.isArray(rawSkills) && Array.isArray(rawData)) {
    rawSkills = rawData;
    schemaDifferences.add("Accepted a top-level array of skills instead of `{ skills: [...] }`.");
  }

  const skills = (Array.isArray(rawSkills) ? rawSkills : [])
    .map((entry, index) => normalizeSkill((isObject(entry) ? entry : {}) as RawSkillLike, index, schemaDifferences))
    .filter((skill, index, all) => all.findIndex((entry) => entry.id === skill.id) === index);

  if (!Array.isArray(rawSkills)) {
    schemaDifferences.add("No usable `skills` array was found; fallback data or empty state was used.");
  }

  const conflicts = normalizeConflicts(rawDataSet.conflicts, skills, schemaDifferences);
  const counts = buildCounts(skills, conflicts, rawDataSet.meta?.counts ?? null);

  return {
    data: {
      skills,
      conflicts,
      meta: {
        source: asString(rawDataSet.meta?.source, fallbackSource),
        isMockData: typeof rawDataSet.meta?.isMockData === "boolean" ? rawDataSet.meta.isMockData : isMockData,
        scannedAt: asString(rawDataSet.meta?.scannedAt, new Date(0).toISOString()),
        counts,
        iconAssignments: rawDataSet.meta?.iconAssignments
          ? {
              assigned: asNumber(rawDataSet.meta.iconAssignments.assigned) ?? 0,
              unique: asNumber(rawDataSet.meta.iconAssignments.unique) ?? 0,
              librarySize: asNumber(rawDataSet.meta.iconAssignments.librarySize) ?? 0,
              missingFiles: asNumber(rawDataSet.meta.iconAssignments.missingFiles) ?? 0,
            }
          : undefined,
      },
    },
    schemaDifferences: Array.from(schemaDifferences),
  };
}

const normalizedMock = normalizeSkillData(mockData, { fallbackSource: "mock", isMockData: true });

export interface SkillDataState {
  data: SkillDataSet;
  mode: DataMode;
  loading: boolean;
  usingFallback: boolean;
  schemaDifferences: string[];
}

export function useSkillData(): SkillDataState {
  const mode = useMemo(() => getDataMode(), []);
  const [state, setState] = useState<SkillDataState>({
    data: normalizedMock.data,
    mode,
    loading: mode !== "mock",
    usingFallback: true,
    schemaDifferences: normalizedMock.schemaDifferences,
  });

  useEffect(() => {
    if (mode === "mock") {
      setState({
        data: normalizedMock.data,
        mode,
        loading: false,
        usingFallback: true,
        schemaDifferences: normalizedMock.schemaDifferences,
      });
      return;
    }

    let cancelled = false;

    const loadRealData = async () => {
      try {
        const response = await fetch("/skills.json", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`skills.json request failed with ${response.status}`);
        }

        const raw = await response.json();
        const normalized = normalizeSkillData(raw, { fallbackSource: "scanner", isMockData: false });

        if (!cancelled) {
          setState({
            data: normalized.data.skills.length > 0 ? normalized.data : normalizedMock.data,
            mode,
            loading: false,
            usingFallback: normalized.data.skills.length === 0,
            schemaDifferences:
              normalized.data.skills.length > 0
                ? normalized.schemaDifferences
                : [...normalized.schemaDifferences, "Real scanner output contained no usable skills; fallback mock data was used."],
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: normalizedMock.data,
            mode,
            loading: false,
            usingFallback: true,
            schemaDifferences: [
              ...normalizedMock.schemaDifferences,
              `Real scanner output was unavailable: ${error instanceof Error ? error.message : "unknown error"}`,
            ],
          });
        }
      }
    };

    void loadRealData();

    return () => {
      cancelled = true;
    };
  }, [mode]);

  return state;
}
