import { promises as fs } from "node:fs";
import { watch as fsWatch } from "node:fs";
import os from "node:os";
import path from "node:path";

const cwd = process.cwd();
const home = os.homedir();
const outputPath = path.join(cwd, "public", "skills.json");
const shouldWatch = process.argv.includes("--watch");

const scanRoots = [
  path.join(home, ".codex", "skills"),
  path.join(home, ".claude", "skills"),
  path.join(home, ".claude", "plugins", "marketplaces"),
];

const ignoredDirectoryNames = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "cache",
  "backups",
]);

const stopWords = new Set([
  "a",
  "an",
  "and",
  "app",
  "asks",
  "assistant",
  "build",
  "built",
  "by",
  "can",
  "claude",
  "code",
  "coding",
  "create",
  "creates",
  "for",
  "from",
  "guidance",
  "help",
  "helps",
  "into",
  "local",
  "plugin",
  "plugins",
  "production",
  "provides",
  "should",
  "skill",
  "skills",
  "task",
  "tasks",
  "that",
  "the",
  "their",
  "them",
  "this",
  "tool",
  "tools",
  "use",
  "used",
  "user",
  "users",
  "using",
  "when",
  "with",
]);

function log(message) {
  console.log(`[skills:generate] ${message}`);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeWindowsPath(value) {
  return value.replace(/\\/g, "/");
}

function tokenize(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !stopWords.has(token));
}

function containsWholeToken(text, token) {
  if (token.includes(" ")) {
    return text.includes(token);
  }

  return new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text);
}

function parseFrontmatter(markdown) {
  const frontmatterMatch = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!frontmatterMatch) {
    return { data: {}, body: markdown };
  }

  const data = {};

  for (const line of frontmatterMatch[1].split(/\r?\n/)) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    data[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }

  return {
    data,
    body: markdown.slice(frontmatterMatch[0].length),
  };
}

function extractDescription(frontmatterDescription, body) {
  if (frontmatterDescription && frontmatterDescription.trim().length > 0) {
    return frontmatterDescription.trim();
  }

  const paragraphs = body
    .split(/\r?\n\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter((block) => !block.startsWith("#") && !block.startsWith("- ") && !block.startsWith("```"));

  return paragraphs[0] ?? "No description available.";
}

function extractTriggerPhrases(description, name) {
  const phrases = [];
  const patterns = [
    /trigger when (.+?)(?:\.|$)/i,
    /use this skill when (.+?)(?:\.|$)/i,
    /should be used when (.+?)(?:\.|$)/i,
    /when the user asks to (.+?)(?:\.|$)/i,
    /when the user asks for (.+?)(?:\.|$)/i,
  ];

  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (!match) {
      continue;
    }

    for (const part of match[1].split(/,| or | and /i)) {
      const cleaned = part
        .replace(/^the user asks to\s+/i, "")
        .replace(/^the user asks for\s+/i, "")
        .replace(/^the user\s+/i, "")
        .replace(/^to\s+/i, "")
        .replace(/["']/g, "")
        .trim();

      if (cleaned.length >= 3) {
        phrases.push(cleaned);
      }
    }
  }

  const nameLabel = titleCase(name.replace(/[-_]/g, " "));
  phrases.push(nameLabel);

  return Array.from(new Set(phrases)).slice(0, 6);
}

function deriveCategory(filePath, name, description) {
  const normalizedPath = normalizeWindowsPath(filePath).toLowerCase();
  const normalizedName = name.toLowerCase();
  const normalizedDescription = description.toLowerCase();
  const combined = `${normalizedPath} ${normalizedName} ${normalizedDescription}`;

  if (
    containsWholeToken(combined, "stripe") ||
    containsWholeToken(combined, "payment") ||
    containsWholeToken(combined, "billing")
  ) {
    return "Finance";
  }

  if (
    containsWholeToken(combined, "openai") ||
    containsWholeToken(combined, "documentation") ||
    normalizedName.endsWith("docs")
  ) {
    return "Knowledge";
  }

  if (containsWholeToken(combined, "mcp") || containsWholeToken(combined, "model context protocol")) {
    return "Integration";
  }

  if (
    containsWholeToken(combined, "automation") ||
    containsWholeToken(combined, "hook") ||
    containsWholeToken(combined, "workflow") ||
    containsWholeToken(combined, "install") ||
    containsWholeToken(combined, "setup")
  ) {
    return "Automation";
  }

  if (
    containsWholeToken(combined, "markdown") ||
    containsWholeToken(combined, "writing") ||
    containsWholeToken(combined, "content") ||
    containsWholeToken(combined, "playground")
  ) {
    return "Content";
  }

  if (containsWholeToken(combined, "example") || containsWholeToken(combined, "prototype")) {
    return "Experimental";
  }

  if (
    containsWholeToken(combined, "agent") ||
    containsWholeToken(combined, "command") ||
    containsWholeToken(combined, "plugin") ||
    containsWholeToken(combined, "structure") ||
    containsWholeToken(combined, "settings") ||
    containsWholeToken(combined, "creator") ||
    containsWholeToken(combined, "development")
  ) {
    return "Development";
  }

  if (
    containsWholeToken(combined, "figma") ||
    containsWholeToken(combined, "frontend") ||
    containsWholeToken(combined, "design") ||
    containsWholeToken(combined, "component")
  ) {
    return "Design";
  }

  return "General";
}

function deriveSource(filePath) {
  const normalized = normalizeWindowsPath(filePath).toLowerCase();

  if (normalized.includes("/.codex/skills/.system/")) {
    return "codex/system";
  }

  if (normalized.includes("/.codex/skills/")) {
    return "codex/skills";
  }

  const marketplacePluginMatch = normalized.match(/\/\.claude\/plugins\/marketplaces\/[^/]+\/(?:plugins|external_plugins)\/([^/]+)\//);
  if (marketplacePluginMatch) {
    return `claude-marketplace/${marketplacePluginMatch[1]}`;
  }

  if (normalized.includes("/.claude/skills/")) {
    return "claude/skills";
  }

  return "local";
}

function keywordSetForSkill(skill) {
  return new Set(tokenize(`${skill.name} ${skill.description}`));
}

function nameTokenSet(skill) {
  return new Set(tokenize(skill.name).filter((token) => token !== "design"));
}

function intersect(setA, setB) {
  const values = [];

  for (const value of setA) {
    if (setB.has(value)) {
      values.push(value);
    }
  }

  return values;
}

function buildConflictSummary(skillA, skillB, overlappingTerms) {
  if (overlappingTerms.length > 0) {
    const focus = overlappingTerms.slice(0, 2).join(" and ");
    return `${skillA.name} overlaps with ${skillB.name} around ${focus}.`;
  }

  return `${skillA.name} overlaps with ${skillB.name}.`;
}

function inferRelationships(skills) {
  const conflicts = [];
  const similarSkillIds = new Set();
  const conflictsById = new Map(skills.map((skill) => [skill.id, new Set()]));
  const keywordsById = new Map(skills.map((skill) => [skill.id, keywordSetForSkill(skill)]));
  const nameTokensById = new Map(skills.map((skill) => [skill.id, nameTokenSet(skill)]));
  const signalTokens = new Set([
    "automation",
    "figma",
    "hook",
    "hookify",
    "installer",
    "markdown",
    "mcp",
    "openai",
    "playground",
    "stripe",
  ]);
  const highSignalIgnore = new Set([
    "agent",
    "automation",
    "command",
    "create",
    "development",
    "docs",
    "guide",
    "guidance",
    "plugin",
    "plugins",
    "references",
    "settings",
    "skill",
    "skills",
    "structure",
    "write",
  ]);

  for (let index = 0; index < skills.length; index += 1) {
    for (let otherIndex = index + 1; otherIndex < skills.length; otherIndex += 1) {
      const skill = skills[index];
      const otherSkill = skills[otherIndex];
      const keywordOverlap = intersect(keywordsById.get(skill.id), keywordsById.get(otherSkill.id)).filter(
        (token) => token !== "design" && !highSignalIgnore.has(token),
      );
      const nameOverlap = intersect(nameTokensById.get(skill.id), nameTokensById.get(otherSkill.id)).filter(
        (token) => !highSignalIgnore.has(token),
      );
      const signalOverlap = [...new Set([...nameOverlap, ...keywordOverlap])].filter((token) => signalTokens.has(token));
      const sameCategory = skill.category === otherSkill.category;
      const isConflict = slugify(skill.name) === slugify(otherSkill.name) || nameOverlap.length > 0 || signalOverlap.length > 0;
      const isSimilar = sameCategory || signalOverlap.length > 0;

      if (isSimilar) {
        similarSkillIds.add(skill.id);
        similarSkillIds.add(otherSkill.id);
      }

      if (!isConflict) {
        continue;
      }

      conflicts.push({
        a: skill.id,
        b: otherSkill.id,
        aName: skill.name,
        bName: otherSkill.name,
        summary: buildConflictSummary(skill, otherSkill, [...nameOverlap, ...signalOverlap]),
      });

      conflictsById.get(skill.id)?.add(otherSkill.id);
      conflictsById.get(otherSkill.id)?.add(skill.id);
    }
  }

  const enrichedSkills = skills.map((skill) => ({
    ...skill,
    conflictsWith: Array.from(conflictsById.get(skill.id) ?? []),
  }));

  return {
    skills: enrichedSkills,
    conflicts,
    similarCount: similarSkillIds.size,
  };
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function collectSkillFiles(directory) {
  const skillFiles = [];

  if (!(await pathExists(directory))) {
    return skillFiles;
  }

  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (ignoredDirectoryNames.has(entry.name.toLowerCase())) {
        continue;
      }

      skillFiles.push(...(await collectSkillFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name === "SKILL.md") {
      skillFiles.push(fullPath);
    }
  }

  return skillFiles;
}

async function readSkill(filePath) {
  const markdown = await fs.readFile(filePath, "utf8");
  const { data, body } = parseFrontmatter(markdown);
  const name = String(data.name ?? path.basename(path.dirname(filePath)));
  const description = extractDescription(String(data.description ?? ""), body);
  const category = deriveCategory(filePath, name, description);

  return {
    id: `${slugify(category)}-${slugify(name)}-${slugify(path.relative(home, filePath))}`,
    name,
    category,
    description,
    triggers: extractTriggerPhrases(description, name),
    path: normalizeWindowsPath(filePath),
    source: deriveSource(filePath),
    sourceUrl: null,
    conflictsWith: [],
  };
}

async function buildSkillData() {
  const files = new Set();

  for (const root of scanRoots) {
    for (const file of await collectSkillFiles(root)) {
      files.add(file);
    }
  }

  const skills = [];

  for (const filePath of Array.from(files).sort()) {
    skills.push(await readSkill(filePath));
  }

  const { skills: enrichedSkills, conflicts, similarCount } = inferRelationships(skills);
  const categories = new Set(enrichedSkills.map((skill) => skill.category)).size;
  const conflictingSkills = new Set(conflicts.flatMap((conflict) => [conflict.a, conflict.b])).size;

  return {
    skills: enrichedSkills,
    conflicts,
    meta: {
      source: "scanner",
      isMockData: false,
      scannedAt: new Date().toISOString(),
      counts: {
        categories,
        skills: enrichedSkills.length,
        conflicting: conflictingSkills,
        similar: similarCount,
      },
    },
  };
}

async function writeSkillData() {
  const payload = await buildSkillData();
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  log(`wrote ${payload.skills.length} skills to ${outputPath}`);
  return payload;
}

async function main() {
  await writeSkillData();

  if (!shouldWatch) {
    return;
  }

  log("watching local skill folders for changes...");

  let timer = null;
  const rerun = () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(async () => {
      try {
        await writeSkillData();
      } catch (error) {
        log(`refresh failed: ${error instanceof Error ? error.message : "unknown error"}`);
      }
    }, 250);
  };

  for (const root of scanRoots) {
    if (!(await pathExists(root))) {
      continue;
    }

    fsWatch(root, { recursive: true }, (_eventType, filename) => {
      if (!filename || !filename.endsWith("SKILL.md")) {
        return;
      }

      rerun();
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
