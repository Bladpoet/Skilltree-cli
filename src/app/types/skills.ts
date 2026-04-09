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
  icon?: string;
  iconName?: string;
  iconFile?: string;
  iconPath?: string;
  iconSource?: string;
  iconScore?: number;
  tags?: string[];
  shortDescription?: string;
  license?: string;
  compatibility?: string;
  allowedTools?: string;
}

export interface SkillIconAssignmentMeta {
  assigned: number;
  unique: number;
  librarySize: number;
  missingFiles: number;
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
    iconAssignments?: SkillIconAssignmentMeta;
  };
}
