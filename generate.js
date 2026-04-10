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

function countIndentation(value) {
  const match = value.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

function stripWrappingQuotes(value) {
  return value.replace(/^['"]|['"]$/g, "");
}

function parseInlineList(value) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return null;
  }

  return trimmed
    .slice(1, -1)
    .split(",")
    .map((item) => stripWrappingQuotes(item.trim()))
    .filter(Boolean);
}

function parseScalarValue(rawValue) {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return "";
  }

  const inlineList = parseInlineList(trimmed);
  if (inlineList) {
    return inlineList;
  }

  return stripWrappingQuotes(trimmed);
}

function toStringArray(value) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => toStringArray(item))
      .filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.includes("\n")) {
    return trimmed
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (trimmed.includes(",")) {
    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [trimmed];
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

function parseFrontmatterEnhanced(markdown) {
  const frontmatterMatch = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!frontmatterMatch) {
    return { data: {}, body: markdown };
  }

  const lines = frontmatterMatch[1].split(/\r?\n/);
  const isBlankLine = (line) => line.trim().length === 0;
  const nextMeaningfulIndex = (startIndex) => {
    let index = startIndex;
    while (index < lines.length && isBlankLine(lines[index])) {
      index += 1;
    }
    return index;
  };

  function parseList(startIndex, baseIndent) {
    const value = [];
    let index = startIndex;

    while (index < lines.length) {
      const line = lines[index];
      if (isBlankLine(line)) {
        index += 1;
        continue;
      }

      const indent = countIndentation(line);
      const trimmed = line.trim();
      if (indent < baseIndent || !trimmed.startsWith("- ")) {
        break;
      }

      value.push(parseScalarValue(trimmed.slice(2)));
      index += 1;
    }

    return { value, index };
  }

  function parseObject(startIndex, baseIndent) {
    const value = {};
    let index = startIndex;

    while (index < lines.length) {
      const line = lines[index];
      if (isBlankLine(line)) {
        index += 1;
        continue;
      }

      const indent = countIndentation(line);
      if (indent < baseIndent) {
        break;
      }

      if (indent > baseIndent) {
        index += 1;
        continue;
      }

      const trimmed = line.trim();
      if (trimmed.startsWith("- ")) {
        break;
      }

      const separatorIndex = trimmed.indexOf(":");
      if (separatorIndex === -1) {
        index += 1;
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const rawValue = trimmed.slice(separatorIndex + 1).trim();

      if (rawValue.length > 0) {
        value[key] = parseScalarValue(rawValue);
        index += 1;
        continue;
      }

      const childIndex = nextMeaningfulIndex(index + 1);
      if (childIndex >= lines.length) {
        value[key] = "";
        index = childIndex;
        continue;
      }

      const childLine = lines[childIndex];
      const childIndent = countIndentation(childLine);
      const childTrimmed = childLine.trim();

      if (childIndent <= indent) {
        value[key] = "";
        index = childIndex;
        continue;
      }

      if (childTrimmed.startsWith("- ")) {
        const parsedList = parseList(childIndex, childIndent);
        value[key] = parsedList.value;
        index = parsedList.index;
        continue;
      }

      const parsedObject = parseObject(childIndex, childIndent);
      value[key] = parsedObject.value;
      index = parsedObject.index;
    }

    return { value, index };
  }

  return {
    data: parseObject(0, 0).value,
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

function summarizeText(value, maxLength) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const sentences = normalized.split(/(?<=[.!?])\s+/);
  let summary = "";

  for (const sentence of sentences) {
    const candidate = summary ? `${summary} ${sentence}` : sentence;
    if (candidate.length > maxLength) {
      break;
    }
    summary = candidate;
  }

  if (summary) {
    return summary;
  }

  const truncated = normalized.slice(0, maxLength + 1);
  const boundary = Math.max(truncated.lastIndexOf(". "), truncated.lastIndexOf(", "), truncated.lastIndexOf(" "));
  const safeCutoff = boundary > Math.floor(maxLength * 0.6) ? boundary : maxLength;
  return `${normalized.slice(0, safeCutoff).trim()}...`;
}

function normalizeDisplayDescription(shortDescription, fullDescription) {
  if (shortDescription && shortDescription.trim().length > 0) {
    return shortDescription.trim();
  }

  return summarizeText(fullDescription, 300);
}

function collectBodySectionBlocks(body, headingNames) {
  const lines = body.split(/\r?\n/);
  const sections = [];
  let collecting = false;
  let currentLevel = 0;
  let buffer = [];

  const flush = () => {
    const content = buffer.join("\n").trim();
    if (content) {
      sections.push(content);
    }
    buffer = [];
  };

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2].trim().toLowerCase();
      if (collecting && level <= currentLevel) {
        flush();
        collecting = false;
      }

      if (headingNames.has(headingText)) {
        collecting = true;
        currentLevel = level;
      }

      continue;
    }

    if (collecting) {
      buffer.push(line);
    }
  }

  if (collecting) {
    flush();
  }

  return sections;
}

const triggerPolicyMarkers = /^(?:\*\*)?(?:always|recommended|optional|skip)(?:\*\*)?\s*(?::|-|for)?\s*/i;
const leadingIntentPattern = /^(?:(?:generate|create|build|write|rewrite|improve|edit|review|critique|evaluate|find|implement|maintain|install|develop|make|check|audit|update|polish|refresh|scale|iterate|design|brainstorm|manage|configure|describe|discover|explore|give feedback on|help(?:\s+me)?(?:\s+to)?)\b(?:\s*,\s*|\s+or\s+|\s+and\s+|\s+))+?/i;
const triggerLabelMatchers = [
  { pattern: /\b(?:existing marketing copy|existing copy|copy feedback|proofread|content audit|copy sweep|polish this|tighten this up|refresh outdated content|make this better)\b/i, label: "Copy editing" },
  { pattern: /\b(?:marketing copy|landing page|homepage|pricing page|feature page|product page|hero section|value proposition|tagline|cta copy|website text)\b/i, label: "Marketing copy" },
  { pattern: /\b(?:ad creative|ad copy|rsa headlines|bulk ad copy|creative testing|ad variations)\b/i, label: "Ad creative" },
  { pattern: /\b(?:automation recommendations?|automation recommender)\b/i, label: "Automation recommendations" },
  { pattern: /\bclaude\.md\b|\bproject memory\b/i, label: "CLAUDE.md maintenance" },
  { pattern: /\b(?:payment processing|billing|checkout|subscriptions?|stripe)\b/i, label: "Payment processing" },
  { pattern: /\bcomponent librar(?:y|ies)\b/i, label: "Component libraries" },
  { pattern: /\bdesign system\b/i, label: "Design systems" },
  { pattern: /\b(?:web components|frontend|user interface|ui)\b/i, label: "Frontend UI" },
  { pattern: /\b(?:brainstorm|creative work|design before implementation)\b/i, label: "Design planning" },
  { pattern: /\b(?:find skills|looking for functionality)\b/i, label: "Skill discovery" },
  { pattern: /\b(?:figma design|implement design|component specs|build figma)\b/i, label: "Figma implementation" },
  { pattern: /\b(?:image generation|illustrations?|mockups?|sprites?|textures?)\b/i, label: "Image generation" },
  { pattern: /\b(?:openai docs|official documentation|gpt-5\.4)\b/i, label: "OpenAI docs" },
  { pattern: /\b(?:playground|explorer|interactive tool)\b/i, label: "Playgrounds" },
  { pattern: /\bplugin settings\b/i, label: "Plugin settings" },
  { pattern: /\b(?:plugin creator|plugin structure|plugin directories|scaffold plugin)\b/i, label: "Plugin development" },
  { pattern: /\b(?:create or update a skill|skill creator|skill development|skill authoring)\b/i, label: "Skill authoring" },
  { pattern: /\b(?:install curated skills|install skills|skill installer)\b/i, label: "Skill installation" },
  { pattern: /\bmcp\b/i, label: "MCP integration" },
  { pattern: /\bagent development\b/i, label: "Agent development" },
  { pattern: /\bhook development\b/i, label: "Hook development" },
  { pattern: /\bcommand development\b/i, label: "Command development" },
  { pattern: /\b(?:review|critique|feedback)\b/i, label: "Critique" },
];

function normalizeTriggerPhrase(value) {
  const withoutExamples = value
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s+[—-]\s+[^—-]+?\s+[—-]\s+/g, " ")
    .replace(/\s[-–—]\s.*$/g, "")
    .replace(/[`"']/g, "")
    .replace(/\b(?:also use when|use this whenever)\b.*$/i, "")
    .replace(/\bfor any\b.*$/i, "")
    .replace(/\bfor [^.]+ platform\b.*$/i, "")
    .replace(/\bfor campaign strategy\b.*$/i, "")
    .replace(/\bfor landing page copy\b.*$/i, "")
    .replace(/^(?:use this skill|use this|use)\s+(?:when|whenever|before)\s+/i, "")
    .replace(/^the user mentions\s+/i, "")
    .replace(/^mentions\s+/i, "")
    .replace(/^when the user\s+(?:asks to|asks for|wants to|needs to)\s+/i, "")
    .replace(/^the user\s+(?:asks to|asks for|wants to|needs to)\s+/i, "")
    .replace(/^to\s+/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[,:;.\-–—]+|[,:;.\-–—]+$/g, "");

  if (!withoutExamples) {
    return "";
  }

  const normalizedValue =
    withoutExamples.includes(",") && !/\b(?:or|and)\b/i.test(withoutExamples)
      ? withoutExamples.split(",")[0].trim()
      : withoutExamples;

  return summarizeText(normalizedValue, 48).replace(/\.\.\.$/, "").trim();
}

function deriveTriggersFromDescription(description) {
  const sentences = description
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const patterns = [
    /use this before (.+)/i,
    /use (?:this skill )?when (.+)/i,
    /use this whenever (.+)/i,
    /when the user (?:asks to|asks for|wants to|needs to) (.+)/i,
    /this skill should be used when (.+)/i,
    /should be used when (.+)/i,
  ];

  const matches = [];
  for (const sentence of sentences) {
    for (const pattern of patterns) {
      const match = sentence.match(pattern);
      if (match?.[1]) {
        matches.push(match[1]);
        break;
      }
    }
  }

  return matches;
}

function extractTriggerPhrases(frontmatter, body, description, name) {
  const structuredTriggers = [
    ...toStringArray(frontmatter.triggers),
    ...toStringArray(frontmatter.trigger),
    ...toStringArray(frontmatter.metadata?.triggers),
  ];

  const bodySections = collectBodySectionBlocks(
    body,
    new Set(["when to use", "use when", "trigger", "triggers", "best used for"])
  );

  const bodySectionTriggers = bodySections.flatMap((section) => {
    const bullets = section
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.slice(2).trim());

    if (bullets.length > 0) {
      return bullets;
    }

    return section
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .slice(0, 2);
  });

  const candidates = [
    ...structuredTriggers,
    ...bodySectionTriggers,
    ...deriveTriggersFromDescription(description),
    titleCase(name.replace(/[-_]/g, " ")),
  ];

  const seen = new Set();
  const normalized = [];

  for (const candidate of candidates) {
    const phrase = normalizeTriggerPhrase(candidate);
    const compactPhrase =
      phrase.includes(",") && !/\b(?:or|and)\b/i.test(phrase)
        ? phrase.split(",")[0].trim()
        : phrase;

    if (compactPhrase.length < 3) {
      continue;
    }

    const dedupeKey = normalizeSearchText(compactPhrase);
    if (!dedupeKey || seen.has(dedupeKey)) {
      continue;
    }

    seen.add(dedupeKey);
    normalized.push(compactPhrase);
  }

  return normalized.slice(0, 4);
}

function extractQuotedExamples(description) {
  const matches = Array.from(description.matchAll(/["']([^"']{3,40})["']/g));
  return matches
    .map((match) =>
      (match[1] ?? "")
        .replace(/\*\*/g, "")
        .replace(/[`"]/g, "")
        .replace(/[,:;.\-–—]+$/g, "")
        .trim()
    )
    .filter((example) => {
      const words = example.split(/\s+/).filter(Boolean);
      return (
        example.length >= 4 &&
        example.length <= 28 &&
        words.length >= 2 &&
        words.length <= 4 &&
        !/^(?:write|rewrite|edit|review|check|audit|update|improve|help|make|create|build|this|my)\b/i.test(example)
      );
    });
}

function deriveTriggerCandidatesFromDescription(description) {
  const sentences = description
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const patterns = [
    /use this before (.+)/i,
    /use (?:this skill )?when (.+)/i,
    /use this whenever (.+)/i,
    /when the user (?:asks to|asks for|wants to|needs to) (.+)/i,
    /this skill should be used when (.+)/i,
    /should be used when (.+)/i,
    /(?:use this|this skill should be used|recommended|invoke|triggered|best used)\s+when\s+(?:the user (?:asks?|wants?|needs?) to\s+)?(.+)/i,
  ];

  const matches = [];
  for (const sentence of sentences) {
    for (const pattern of patterns) {
      const match = sentence.match(pattern);
      if (match?.[1]) {
        // Split on commas and " or " to separate verb phrases
        const phrases = match[1]
          .split(/\s+or\s+|,\s*/)
          .map(p => p.trim())
          .filter(Boolean);
        matches.push(...phrases);
        break;
      }
    }
  }

  return matches;
}

function normalizeTriggerCandidate(value) {
  return value
    .replace(/\*\*/g, "")
    .replace(/[`"]/g, "")
    .replace(triggerPolicyMarkers, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s+[â€”-]\s+[^â€”-]+?\s+[â€”-]\s+/g, " ")
    .replace(/\s[-â€“â€”]\s.*$/g, "")
    .replace(/\b(?:also use when|use this whenever)\b.*$/i, "")
    .replace(/\bfor campaign strategy\b.*$/i, "")
    .replace(/\bfor landing page copy\b.*$/i, "")
    .replace(/\bfor email copy\b.*$/i, "")
    .replace(/\bfor editing existing copy\b.*$/i, "")
    .replace(/^(?:use this skill|use this|use)\s+(?:when|whenever|before)\s+/i, "")
    .replace(/^the user says\s+/i, "")
    .replace(/^the user mentions\s+/i, "")
    .replace(/^mentions\s+/i, "")
    .replace(/^when the user\s+(?:asks to|asks for|wants to|needs to)\s+/i, "")
    .replace(/^the user\s+(?:asks to|asks for|wants to|needs to)\s+/i, "")
    .replace(/^to\s+/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[,:;.\-â€“â€”]+|[,:;.\-â€“â€”]+$/g, "");
}

function labelizeTriggerCandidate(value, fallbackName) {
  const normalized = normalizeTriggerCandidate(value);
  if (!normalized) {
    return null;
  }

  for (const matcher of triggerLabelMatchers) {
    if (matcher.pattern.test(normalized)) {
      return matcher.label;
    }
  }

  const stripped = normalized
    .replace(leadingIntentPattern, "")
    .replace(/\b(?:for any|for all|whenever)\b.*$/i, "")
    .replace(/\b(?:including|such as|like)\b.*$/i, "")
    .replace(/^existing\s+/i, "")
    .replace(/^new\s+/i, "")
    .replace(/^(?:a|an|the)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();

  if (stripped.length >= 4) {
    return titleCase(stripped);
  }

  return titleCase(fallbackName.replace(/[-_]/g, " "));
}

function addRankedTrigger(candidateMap, label, priority) {
  if (!label) {
    return;
  }

  const dedupeKey = normalizeSearchText(label);
  if (!dedupeKey) {
    return;
  }

  const existing = candidateMap.get(dedupeKey);
  if (!existing || priority > existing.priority) {
    candidateMap.set(dedupeKey, { label, priority });
  }
}

function extractRefinedTriggerPhrases(frontmatter, body, description, name) {
  const structuredTriggers = [
    ...toStringArray(frontmatter.triggers),
    ...toStringArray(frontmatter.trigger),
    ...toStringArray(frontmatter.metadata?.triggers),
  ];

  const bodySections = collectBodySectionBlocks(
    body,
    new Set(["when to use", "use when", "trigger", "triggers", "best used for"])
  );

  const bodySectionTriggers = bodySections.flatMap((section) => {
    const rawBulletLines = section
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.replace(/^- /, "").trim());

    const bullets = rawBulletLines
      .filter((line) => !triggerPolicyMarkers.test(line));

    if (bullets.length > 0) {
      return bullets;
    }

    if (rawBulletLines.length > 0) {
      return [];
    }

    return section
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => !triggerPolicyMarkers.test(sentence))
      .filter(Boolean)
      .slice(0, 2);
  });

  const descriptionTriggers = deriveTriggerCandidatesFromDescription(description);
  const quotedExamples = extractQuotedExamples(description);
  const candidateMap = new Map();

  for (const trigger of structuredTriggers) {
    addRankedTrigger(candidateMap, labelizeTriggerCandidate(trigger, name), 100);
  }

  for (const trigger of bodySectionTriggers) {
    addRankedTrigger(candidateMap, labelizeTriggerCandidate(trigger, name), 80);
  }

  for (const trigger of descriptionTriggers) {
    addRankedTrigger(candidateMap, labelizeTriggerCandidate(trigger, name), 60);
  }

  for (const example of quotedExamples.slice(0, 3)) {
    addRankedTrigger(candidateMap, titleCase(example), 40);
  }

  addRankedTrigger(candidateMap, titleCase(name.replace(/[-_]/g, " ")), 10);

  // Deduplicate by stem: keep shorter/cleaner form if one is prefix of another
  const dedupedEntries = Array.from(candidateMap.values());
  const toRemove = new Set();
  for (let i = 0; i < dedupedEntries.length; i++) {
    for (let j = i + 1; j < dedupedEntries.length; j++) {
      const a = dedupedEntries[i].label.toLowerCase();
      const b = dedupedEntries[j].label.toLowerCase();
      if (a.includes(b) && a !== b) {
        toRemove.add(i);
      } else if (b.includes(a) && a !== b) {
        toRemove.add(j);
      }
    }
  }

  return dedupedEntries
    .filter((_, idx) => !toRemove.has(idx))
    .sort((a, b) => b.priority - a.priority || a.label.localeCompare(b.label))
    .slice(0, 4)
    .map((entry) => entry.label);
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
  const { data, body } = parseFrontmatterEnhanced(markdown);
  const name = String(data.name ?? path.basename(path.dirname(filePath)));
  const fullDescription = extractDescription(String(data.description ?? ""), body);

  const metadata = data.metadata ?? {};
  const tags = toStringArray(metadata.tags ?? data.tags);
  const shortDescription = metadata["short-description"] ?? metadata.shortDescription ?? null;
  const license = data.license ?? null;
  const compatibility = data.compatibility ?? null;
  const allowedTools = toStringArray(
    data["allowed-tools"] ??
    data.allowedTools ??
    metadata["allowed-tools"] ??
    metadata.allowedTools
  );
  const description = normalizeDisplayDescription(shortDescription, fullDescription);

  const category = deriveCategory(filePath, name, description);
  const source = firstDefinedString(data.source, deriveSource(filePath));
  const installedFrom = deriveSource(filePath);
  const sourceUrl = firstDefinedString(data.sourceUrl, data.source_url, data.url, data.homepage);
  const triggers = extractRefinedTriggerPhrases(data, body, fullDescription, name);

  const skill = {
    id: `${slugify(category)}-${slugify(name)}-${slugify(path.relative(home, filePath))}`,
    name,
    category,
    description,
    triggers,
    path: normalizeWindowsPath(filePath),
    source,
    installedFrom,
    sourceUrl,
    conflictsWith: [],
  };

  // Add optional fields only if they have values
  if (tags.length > 0) {
    skill.tags = tags;
  }
  if (fullDescription && fullDescription !== description) {
    skill.fullDescription = fullDescription;
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
  if (allowedTools.length > 0) {
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
