import { promises as fs } from "node:fs";
import { watch as fsWatch } from "node:fs";
import { fileURLToPath } from "node:url";
import os from "node:os";
import path from "node:path";

const __scriptDir = path.dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();
const home = os.homedir();

const outputArgIndex = process.argv.indexOf("--output");
const outputPath = outputArgIndex !== -1
  ? process.argv[outputArgIndex + 1]
  : path.join(cwd, "public", "skills.json");

const iconsDirArgIndex = process.argv.indexOf("--icons-dir");
const generatedIconsDir = iconsDirArgIndex !== -1
  ? process.argv[iconsDirArgIndex + 1]
  : path.join(cwd, "public", "skill-icons");

const iconLibraryRoot = path.join(__scriptDir, "claude-skills-icons");
const iconLibraryIndexPath = path.join(iconLibraryRoot, "index.json");
const iconLibraryIconsDir = path.join(iconLibraryRoot, "icons");
const shouldWatch = process.argv.includes("--watch");

// Helper: Build list of plugin cache paths from installed_plugins.json
async function getPluginCachePaths() {
  const pluginsPaths = [];
  const installedPluginsPath = path.join(home, ".claude", "plugins", "installed_plugins.json");

  if (await pathExists(installedPluginsPath)) {
    try {
      const content = await fs.readFile(installedPluginsPath, "utf8");
      const installed = JSON.parse(content);

      if (installed.plugins && Array.isArray(installed.plugins)) {
        for (const plugin of installed.plugins) {
          if (plugin.marketplace && plugin.name && plugin.version) {
            const cachePath = path.join(
              home,
              ".claude",
              "plugins",
              "cache",
              plugin.marketplace,
              plugin.name,
              plugin.version,
              "skills"
            );
            pluginsPaths.push(cachePath);
          }
        }
      }
    } catch (error) {
      // Silently skip if file doesn't parse or doesn't exist
    }
  }

  return pluginsPaths;
}

// Base scan roots (these are checked first; non-existent paths silently skipped)
const baseScanRoots = [
  // Global/user-level
  path.join(home, ".agents", "skills"),
  path.join(home, ".claude", "skills"),
  path.join(home, ".cursor", "skills"),
  path.join(home, ".config", "opencode", "skills"),
  path.join(home, ".codex", "skills"),
  // Plugin marketplace (legacy path, still used by marketplace plugins)
  path.join(home, ".claude", "plugins", "marketplaces"),
  // Project-level (relative to cwd)
  path.join(cwd, ".agents", "skills"),
  path.join(cwd, ".claude", "skills"),
  path.join(cwd, ".cursor", "skills"),
  path.join(cwd, ".opencode", "skills"),
  path.join(cwd, ".github", "skills"),
];

// Plugin cache paths are added dynamically via getPluginCachePaths()
let scanRoots = baseScanRoots;

const ignoredDirectoryNames = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
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

function tokenizeLoose(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);
}

function normalizeSearchText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
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
  const lines = frontmatterMatch[1].split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      i++;
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    // Check if this is a nested block (e.g., "metadata:")
    if (rawValue === "") {
      const nested = {};
      i++;

      // Read indented sub-keys
      while (i < lines.length) {
        const nextLine = lines[i];
        // Check if line starts with whitespace (indented)
        if (nextLine.match(/^\s+/) && nextLine.trim() !== "") {
          const subSeparatorIndex = nextLine.indexOf(":");
          if (subSeparatorIndex !== -1) {
            const subKey = nextLine.slice(nextLine.search(/\S/), subSeparatorIndex).trim();
            const subRawValue = nextLine.slice(subSeparatorIndex + 1).trim();
            const subValue = subRawValue.replace(/^['"]|['"]$/g, "");

            // Handle tags specially — split on comma and trim
            if (subKey === "tags") {
              nested[subKey] = subValue
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);
            } else {
              nested[subKey] = subValue;
            }

            i++;
            continue;
          }
        }

        // Non-indented line or end of input — exit nested block
        break;
      }

      data[key] = nested;
    } else {
      // Regular flat key:value
      data[key] = rawValue.replace(/^['"]|['"]$/g, "");
      i++;
    }
  }

  return {
    data,
    body: markdown.slice(frontmatterMatch[0].length),
  };
}

function firstDefinedString(...values) {
  for (const value of values) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }

  return null;
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

function normalizeDisplayDescription(shortDescription, fullDescription) {
  // Priority: use shortDescription if present, otherwise truncate full description
  if (shortDescription && shortDescription.trim().length > 0) {
    return shortDescription.trim();
  }

  // Truncate full description to 300 characters
  const maxLength = 300;
  if (fullDescription.length > maxLength) {
    return fullDescription.slice(0, maxLength) + "...";
  }

  return fullDescription;
}

function extractTriggerPhrases(description, name) {
  const phrases = [];

  // Step 1: Look for explicit "Use when..." clauses first
  const useWhenPatterns = [
    /use when (.+?)(?:\.|$)/i,
    /use this when (.+?)(?:\.|$)/i,
    /use this skill when (.+?)(?:\.|$)/i,
    /this skill should be used when (.+?)(?:\.|$)/i,
    /should be used when (.+?)(?:\.|$)/i,
  ];

  for (const pattern of useWhenPatterns) {
    const match = description.match(pattern);
    if (match) {
      const clause = match[1]
        .replace(/^the user\s+/i, "")
        .replace(/^to\s+/i, "")
        .replace(/["']/g, "")
        .trim();

      if (clause.length >= 3) {
        phrases.push(clause);
        break; // Only take the first "Use when..." clause
      }
    }
  }

  // Step 2: Apply sentence-level extraction for additional triggers
  const patterns = [
    /trigger when (.+?)(?:\.|$)/i,
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

      if (cleaned.length >= 3 && !phrases.includes(cleaned)) {
        phrases.push(cleaned);
      }
    }
  }

  // Step 3: Add skill name as fallback
  const nameLabel = titleCase(name.replace(/[-_]/g, " "));
  if (!phrases.includes(nameLabel)) {
    phrases.push(nameLabel);
  }

  // Step 4: Deduplicate and cap phrase length to fit trigger chip (40 chars max)
  const deduped = Array.from(new Set(phrases));
  const capped = deduped.map(phrase =>
    phrase.length > 40
      ? phrase.slice(0, phrase.lastIndexOf(" ", 40)) || phrase.slice(0, 40)
      : phrase
  );

  return capped.slice(0, 6);
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

const genericActionVerbs = new Set([
  "create", "build", "generate", "make", "write", "add", "update", "edit",
  "modify", "change", "manage", "handle", "process", "use", "help", "provide",
  "enable", "support", "allow", "run", "execute", "perform", "set", "get",
  "fetch", "load", "show", "display", "render", "list", "find", "search",
  "check", "review", "analyze", "read", "open", "close", "start", "stop",
  "move", "copy", "delete", "remove", "send", "receive", "save", "store",
  "apply", "implement", "define", "configure", "setup", "install", "convert",
  "format", "parse", "extract", "import", "export", "integrate", "connect",
  "publish", "deploy",
]);

function deriveCategory(filePath, name, description) {
  const normalizedPath = normalizeWindowsPath(filePath).toLowerCase();
  const normalizedName = name.toLowerCase();
  const normalizedDescription = description.toLowerCase();
  const combined = `${normalizedPath} ${normalizedName} ${normalizedDescription}`;

  // 10-category system with equal weights (2 for all)
  const categorySignals = {
    Development: [
      "typescript", "javascript", "python", "git", "api", "debug", "refactor", "test", "build",
      "deploy", "database", "backend", "server", "node", "react", "code", "script", "terminal",
      "sdk", "library", "mcp", "plugin", "agent",
    ],
    DevOps: [
      "docker", "kubernetes", "ci", "cd", "pipeline", "infrastructure", "monitoring", "nginx",
      "cloud", "aws", "heroku", "vercel", "ansible", "terraform", "container", "helm",
    ],
    Design: [
      "figma", "frontend", "design", "ui", "ux", "layout", "visual", "component", "css",
      "styling", "wireframe", "prototype", "typography", "colour", "color",
    ],
    Automation: [
      "automation", "hook", "workflow", "webhook", "cron", "scheduler", "trigger", "event",
      "installer", "recurring", "batch", "headless",
    ],
    Content: [
      "markdown", "docs", "documentation", "writing", "blog", "readme", "guide", "brief",
      "copywriting", "article", "draft", "editorial",
    ],
    Data: [
      "analytics", "sql", "database", "spreadsheet", "csv", "chart", "visualisation", "visualization",
      "dataset", "pandas", "etl", "dashboard", "metrics", "query",
    ],
    Research: [
      "search", "summarise", "summarize", "research", "synthesis", "fact", "crawl", "scrape",
      "survey", "analysis", "compare", "report",
    ],
    Communication: [
      "email", "slack", "pr", "pull request", "changelog", "meeting", "notes", "message",
      "notification", "announce", "newsletter",
    ],
    Security: [
      "auth", "authentication", "permission", "secret", "vulnerability", "encrypt", "token",
      "oauth", "firewall", "audit", "compliance", "pentest",
    ],
    Finance: [
      "stripe", "payment", "billing", "invoice", "checkout", "subscription", "expense",
      "budget", "accounting", "tax", "revenue",
    ],
  };

  const scores = {};
  const priority = [
    "Development", "DevOps", "Design", "Automation", "Content",
    "Data", "Research", "Communication", "Security", "Finance",
  ];

  // Initialize scores
  for (const category of priority) {
    scores[category] = 0;
  }

  // Score all categories equally (weight = 2)
  const weight = 2;
  for (const [category, signals] of Object.entries(categorySignals)) {
    const seen = new Set();
    for (const signal of signals) {
      if (seen.has(signal)) {
        continue;
      }

      if (containsWholeToken(combined, signal)) {
        scores[category] += weight;
        seen.add(signal);
      }
    }
  }

  // Tie-breaking: use priority order
  let bestCategory = "Development";
  let bestScore = -1;

  for (const category of priority) {
    const score = scores[category];
    if (score > bestScore) {
      bestCategory = category;
      bestScore = score;
    }
  }

  return bestCategory;
}

function deriveSource(filePath) {
  const normalized = normalizeWindowsPath(filePath).toLowerCase();

  // Codex
  if (normalized.includes("/.codex/skills/.system/")) {
    return "codex/system";
  }
  if (normalized.includes("/.codex/skills/")) {
    return "codex/skills";
  }

  // Canonical agents location
  if (normalized.includes("/.agents/skills/")) {
    return "agents/skills";
  }

  // Cursor
  if (normalized.includes("/.cursor/skills/")) {
    return "cursor/skills";
  }

  // OpenCode
  if (normalized.includes("/.config/opencode/skills/") || normalized.includes("/.opencode/skills/")) {
    return "opencode/skills";
  }

  // GitHub
  if (normalized.includes("/.github/skills/")) {
    return "github/skills";
  }

  // Claude Code plugin cache
  const pluginCacheMatch = normalized.match(/\/\.claude\/plugins\/cache\/[^/]+\/([^/]+)\/[^/]+\/skills\//);
  if (pluginCacheMatch) {
    return `claude-plugin/${pluginCacheMatch[1]}`;
  }

  // Legacy marketplace plugin path
  const marketplacePluginMatch = normalized.match(/\/\.claude\/plugins\/marketplaces\/[^/]+\/(?:plugins|external_plugins)\/([^/]+)\//);
  if (marketplacePluginMatch) {
    return `claude-marketplace/${marketplacePluginMatch[1]}`;
  }

  // Claude skills
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

function buildSkillTextForScoring(skill) {
  const triggers = Array.isArray(skill.triggers) ? skill.triggers.join(" ") : "";
  return normalizeSearchText(`${skill.name} ${skill.description} ${skill.category} ${triggers}`);
}

function scoreIconForSkill(icon, skillText) {
  let score = 0;

  for (const tag of icon.tags) {
    const normalizedTag = normalizeSearchText(String(tag));
    if (!normalizedTag) {
      continue;
    }

    if (containsWholeToken(skillText, normalizedTag)) {
      score += 2;
    }
  }

  const matchedDescriptionWords = new Set();
  for (const word of tokenizeLoose(icon.description)) {
    if (matchedDescriptionWords.has(word)) {
      continue;
    }

    if (containsWholeToken(skillText, word)) {
      score += 0.5;
      matchedDescriptionWords.add(word);
    }
  }

  const normalizedIconName = normalizeSearchText(icon.name);
  if (normalizedIconName && containsWholeToken(skillText, normalizedIconName)) {
    score += 3;
  }

  return score * icon.weight;
}

async function loadIconLibrary() {
  if (!(await pathExists(iconLibraryIndexPath))) {
    throw new Error(`icon library index not found at ${iconLibraryIndexPath}`);
  }

  const raw = await fs.readFile(iconLibraryIndexPath, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("icon library index must be an array");
  }

  const validIcons = [];
  const missingFiles = [];

  for (const entry of parsed) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const name = String(entry.name ?? "").trim();
    const file = String(entry.file ?? "").trim();
    const description = String(entry.description ?? "").trim();
    const tags = Array.isArray(entry.tags)
      ? entry.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : [];
    const weight = Number(entry.weight ?? 0.1);

    if (!name || !file || !description || tags.length === 0 || Number.isNaN(weight)) {
      continue;
    }

    const absoluteFilePath = path.join(iconLibraryIconsDir, file);
    if (!(await pathExists(absoluteFilePath))) {
      missingFiles.push(file);
      continue;
    }

    validIcons.push({
      name,
      file,
      description,
      tags,
      weight: Math.min(1, Math.max(0, weight)),
      absoluteFilePath,
      webPath: `/skill-icons/${file}`,
    });
  }

  const fallbackIcon = validIcons.find((icon) => icon.name === "default") ?? validIcons[0] ?? null;
  const nonFallbackIcons = validIcons.filter((icon) => !fallbackIcon || icon.name !== fallbackIcon.name);

  return {
    allIcons: validIcons,
    nonFallbackIcons,
    fallbackIcon,
    missingFiles,
  };
}

function assignUniqueIconsToSkills(skills, iconLibrary) {
  const assignedBySkillId = new Map();
  const usedIconNames = new Set();
  const sortedSkills = [...skills].sort((a, b) => {
    const byId = a.id.localeCompare(b.id);
    if (byId !== 0) {
      return byId;
    }

    return a.name.localeCompare(b.name);
  });

  for (const skill of sortedSkills) {
    const skillText = buildSkillTextForScoring(skill);
    let bestIcon = null;
    let bestScore = -Infinity;

    for (const icon of iconLibrary.nonFallbackIcons) {
      if (usedIconNames.has(icon.name)) {
        continue;
      }

      const score = scoreIconForSkill(icon, skillText);
      if (score > bestScore) {
        bestScore = score;
        bestIcon = icon;
      }
    }

    if (!bestIcon && iconLibrary.fallbackIcon && !usedIconNames.has(iconLibrary.fallbackIcon.name)) {
      bestIcon = iconLibrary.fallbackIcon;
      bestScore = 0;
    }

    if (!bestIcon && iconLibrary.fallbackIcon) {
      bestIcon = iconLibrary.fallbackIcon;
      bestScore = 0;
    }

    if (!bestIcon) {
      continue;
    }

    usedIconNames.add(bestIcon.name);
    assignedBySkillId.set(skill.id, {
      iconName: bestIcon.name,
      iconFile: bestIcon.file,
      iconPath: bestIcon.webPath,
      iconSource: "custom-library",
      iconScore: Number(bestScore.toFixed(3)),
    });
  }

  const enriched = skills.map((skill) => {
    const assignment = assignedBySkillId.get(skill.id);
    if (!assignment) {
      return skill;
    }

    return {
      ...skill,
      icon: assignment.iconName,
      ...assignment,
    };
  });

  return {
    skills: enriched,
    assignedCount: assignedBySkillId.size,
    uniqueIconCount: usedIconNames.size,
    usedIconNames,
  };
}

async function syncAssignedIconAssets(usedIconNames, iconLibrary) {
  const iconsByName = new Map(iconLibrary.allIcons.map((icon) => [icon.name, icon]));
  await fs.rm(generatedIconsDir, { recursive: true, force: true });
  await fs.mkdir(generatedIconsDir, { recursive: true });

  const namesToCopy = Array.from(usedIconNames);
  for (const name of namesToCopy) {
    const icon = iconsByName.get(name);
    if (!icon) {
      continue;
    }

    await fs.copyFile(icon.absoluteFilePath, path.join(generatedIconsDir, icon.file));
  }
}

function inferRelationships(skills) {
  // Build token sets for each skill: trigger tokens and description tokens
  // Remove stop words and generic action verbs for meaningful overlap detection
  const triggerTokensById = new Map(
    skills.map((skill) => [
      skill.id,
      new Set(
        skill.triggers
          .flatMap((trigger) => tokenize(trigger))
          .filter((token) => !genericActionVerbs.has(token))
      ),
    ])
  );

  const descriptionTokensById = new Map(
    skills.map((skill) => [
      skill.id,
      new Set(
        tokenize(skill.description)
          .filter((token) => !genericActionVerbs.has(token))
      ),
    ])
  );

  // Function to score overlap between two skills
  function scoreOverlap(skillA, skillB) {
    let score = 0;

    // Signal 1: Slug similarity (strongest signal of duplication)
    const slugA = slugify(skillA.name);
    const slugB = slugify(skillB.name);

    if (slugA === slugB) {
      return 10; // Identical slug = instant flag, highest confidence
    }

    const editDistance = levenshtein(slugA, slugB);
    if (editDistance <= 3 && Math.min(slugA.length, slugB.length) >= 8) {
      score += 5; // Near-identical slug = likely same skill variant
    }

    // Signal 2: Shared trigger tokens (functional intent overlap)
    const triggerA = triggerTokensById.get(skillA.id) ?? new Set();
    const triggerB = triggerTokensById.get(skillB.id) ?? new Set();
    const sharedTriggerTokens = intersect(triggerA, triggerB).length;
    score += Math.min(sharedTriggerTokens * 2, 8); // +2 per token, cap at +8

    // Signal 3: Shared description tokens (output/domain overlap)
    const descA = descriptionTokensById.get(skillA.id) ?? new Set();
    const descB = descriptionTokensById.get(skillB.id) ?? new Set();
    const sharedDescTokens = intersect(descA, descB).length;
    score += Math.min(sharedDescTokens, 4); // +1 per token, cap at +4

    return score;
  }

  const conflicts = [];
  const overlappingSkillIds = new Set();
  const overlapsById = new Map(skills.map((skill) => [skill.id, new Set()]));

  // Score all pairs and flag overlaps
  for (let index = 0; index < skills.length; index += 1) {
    for (let otherIndex = index + 1; otherIndex < skills.length; otherIndex += 1) {
      const skill = skills[index];
      const otherSkill = skills[otherIndex];
      const score = scoreOverlap(skill, otherSkill);

      // Threshold: 6+ points = genuine overlap
      if (score >= 6) {
        overlappingSkillIds.add(skill.id);
        overlappingSkillIds.add(otherSkill.id);

        overlapsById.get(skill.id)?.add(otherSkill.id);
        overlapsById.get(otherSkill.id)?.add(skill.id);

        // Build a summary of why they overlap
        const triggerA = triggerTokensById.get(skill.id) ?? new Set();
        const triggerB = triggerTokensById.get(otherSkill.id) ?? new Set();
        const sharedTokens = intersect(triggerA, triggerB);
        const summary = sharedTokens.length > 0
          ? `${skill.name} overlaps with ${otherSkill.name} around ${sharedTokens.slice(0, 2).join(" and ")}.`
          : `${skill.name} overlaps with ${otherSkill.name}.`;

        conflicts.push({
          a: skill.id,
          b: otherSkill.id,
          aName: skill.name,
          bName: otherSkill.name,
          summary,
        });
      }
    }
  }

  const enrichedSkills = skills.map((skill) => ({
    ...skill,
    conflictsWith: Array.from(overlapsById.get(skill.id) ?? []),
  }));

  return {
    skills: enrichedSkills,
    conflicts,
    similarCount: overlappingSkillIds.size, // Now represents genuine overlaps only
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
  const fullDescription = extractDescription(String(data.description ?? ""), body);

  // Extract new fields
  const metadata = data.metadata ?? {};
  const tags = Array.isArray(metadata.tags) ? metadata.tags : [];
  const shortDescription = metadata["short-description"] ?? metadata.shortDescription ?? null;
  const license = data.license ?? null;
  const compatibility = data.compatibility ?? null;
  const allowedTools = data["allowed-tools"] ?? data.allowedTools ?? null;

  // Use shortDescription if available, otherwise truncate fullDescription
  const description = normalizeDisplayDescription(shortDescription, fullDescription);

  const category = deriveCategory(filePath, name, description);
  const source = firstDefinedString(data.source, deriveSource(filePath));
  const sourceUrl = firstDefinedString(data.sourceUrl, data.source_url, data.url, data.homepage);

  const skill = {
    id: `${slugify(category)}-${slugify(name)}-${slugify(path.relative(home, filePath))}`,
    name,
    category,
    description,
    triggers: extractTriggerPhrases(fullDescription, name),
    path: normalizeWindowsPath(filePath),
    source,
    sourceUrl,
    conflictsWith: [],
  };

  // Add optional fields only if they have values
  if (tags.length > 0) {
    skill.tags = tags;
  }
  if (shortDescription) {
    skill.shortDescription = shortDescription;
  }
  if (license) {
    skill.license = license;
  }
  if (compatibility) {
    skill.compatibility = compatibility;
  }
  if (allowedTools) {
    skill.allowedTools = allowedTools;
  }

  return skill;
}

async function buildSkillData() {
  // Dynamically add plugin cache paths
  const pluginCachePaths = await getPluginCachePaths();
  scanRoots = [...baseScanRoots, ...pluginCachePaths];

  const files = new Set();
  const resolvedPaths = new Set(); // For deduplication by real path

  for (const root of scanRoots) {
    for (const file of await collectSkillFiles(root)) {
      try {
        // Deduplicate by resolved real path
        const realPath = await fs.realpath(file);
        if (resolvedPaths.has(realPath)) {
          continue; // Skip if we've already seen this file via a symlink
        }
        resolvedPaths.add(realPath);
        files.add(file);
      } catch {
        // If realpath fails, add the file anyway
        files.add(file);
      }
    }
  }

  const skills = [];

  for (const filePath of Array.from(files).sort()) {
    skills.push(await readSkill(filePath));
  }

  const iconLibrary = await loadIconLibrary();
  const { skills: iconAssignedSkills, assignedCount, uniqueIconCount, usedIconNames } = assignUniqueIconsToSkills(skills, iconLibrary);
  await syncAssignedIconAssets(usedIconNames, iconLibrary);

  const { skills: enrichedSkills, conflicts, similarCount } = inferRelationships(iconAssignedSkills);
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
      iconAssignments: {
        assigned: assignedCount,
        unique: uniqueIconCount,
        librarySize: iconLibrary.allIcons.length,
        missingFiles: iconLibrary.missingFiles.length,
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
