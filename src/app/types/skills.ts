export interface SkillConflict {
  a: string;
  b: string;
  aName: string;
  bName: string;
  summary: string;
}

export interface SkillRecord {
  id: string;
  name: string;
  category: string;
  description: string;
  triggers: string[];
  dependents?: string[];
  path: string;
  source: string;
  sourceUrl: string | null;
  conflictsWith: string[];
}

export interface RelatedConflict {
  conflict: SkillConflict;
  relatedSkill: SkillRecord;
}

export interface SkillMetaCounts {
  categories: number;
  skills: number;
  conflicting: number;
  similar: number;
}

export interface SkillDataSet {
  skills: SkillRecord[];
  conflicts: SkillConflict[];
  meta: {
    source: string;
    isMockData: boolean;
    scannedAt: string;
    counts: SkillMetaCounts;
  };
}
