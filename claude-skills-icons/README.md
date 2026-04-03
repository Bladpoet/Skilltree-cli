# Claude Skills Icon Library

A curated icon library for AI skill tree UIs. Each icon is paired with rich semantic metadata so a skill scanner can intelligently assign the best unique icon to any skill — no duplicates, no hardcoding, works for any skill that will ever exist.

## Structure

```
claude-skills-icons/
├── index.json              ← master metadata for all icons
├── icons/                  ← SVG icon files
│   ├── accessible.svg
│   ├── activity.svg
│   └── ... (331 icons)
└── README.md               ← this file
```

## How It Works

The scanner loads `index.json` once. For each skill it discovers, it scores every icon's `description` and `tags` against the skill's name and description. It picks the highest-scoring unused icon. No two skills ever share the same icon.

### Scoring Algorithm (reference implementation)

```javascript
function scoreIcon(icon, skill) {
  const skillText = `${skill.name} ${skill.description}`.toLowerCase();
  let score = 0;

  // Tag matches (high weight — exact keyword matches)
  for (const tag of icon.tags) {
    if (skillText.includes(tag.toLowerCase())) {
      score += 2.0;
    }
  }

  // Description matches (medium weight — phrase overlap)
  const descWords = icon.description.toLowerCase().split(/[\s,]+/);
  for (const word of descWords) {
    if (word.length > 2 && skillText.includes(word)) {
      score += 0.5;
    }
  }

  // Name bonus (direct name match gets a boost)
  if (skillText.includes(icon.name.toLowerCase())) {
    score += 3.0;
  }

  return score * icon.weight;
}
```

### Assignment Logic

```javascript
function assignIcons(skills, icons) {
  const assignments = new Map();
  const usedIcons = new Set();

  for (const skill of skills) {
    let bestIcon = null;
    let bestScore = 0;

    for (const icon of icons) {
      if (usedIcons.has(icon.name)) continue;

      const score = scoreIcon(icon, skill);
      if (score > bestScore) {
        bestScore = score;
        bestIcon = icon;
      }
    }

    if (bestIcon) {
      usedIcons.add(bestIcon.name);
      assignments.set(skill.name, bestIcon);
    } else {
      // Fallback to default icon
      assignments.set(skill.name, icons.find(i => i.name === "default"));
    }
  }

  return assignments;
}
```

## Metadata Schema

Each entry in `index.json` follows this structure:

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Icon name (matches the SVG filename without extension) |
| `file` | `string` | SVG filename (e.g. `"brain.svg"`) |
| `description` | `string` | Comma-separated semantic phrases describing what this icon represents and which skill domains it maps to. Optimized for text similarity scoring. |
| `tags` | `string[]` | 10-12 keywords spanning literal meaning, domain context, action verbs, and adjacent concepts. Used for exact keyword matching during scoring. |
| `weight` | `number` | Specificity multiplier (0.1–1.0). Higher for unambiguous icons, lower for generic ones. Applied as a final multiplier to the raw score. |

### Weight Tiers

| Weight | Meaning | Examples |
|--------|---------|----------|
| `1.0` | Unambiguous — maps to exactly one domain | `brand-github`, `microscope`, `shield-lock`, `api` |
| `0.8–0.9` | Specific but flexible — strong signal for a domain | `brain`, `rocket`, `puzzle`, `test-pipe` |
| `0.6–0.7` | Moderately generic — useful in multiple contexts | `search`, `code`, `tools`, `layout` |
| `0.4–0.5` | Very generic — high collision risk, low specificity | `check`, `star`, `flag`, `help` |
| `0.1` | Fallback — only used when nothing else matches | `default` |

## Library Stats

- **Total icons:** 331 + 1 default fallback
- **Average tags per icon:** 12
- **Average weight:** 0.74
- **Weight distribution:**
  - 1.0: 18 icons (highly specific)
  - 0.8–0.9: 134 icons (specific)
  - 0.6–0.7: 157 icons (moderately generic)
  - 0.4–0.5: 22 icons (very generic)
  - 0.1: 1 icon (default fallback)

## Adding New Icons

1. Export the new icon as SVG into the `icons/` folder
2. Add an entry to `index.json` following the schema above
3. Write a description and tags that cover the domains this icon could represent
4. Assign an appropriate weight based on specificity

## Design Notes

All icons are derived from Tabler Icons, styled with brush stroke effects and outlined strokes for a distinctive hand-drawn aesthetic. The visual style is consistent across the entire library.

## License

Icons based on Tabler Icons (tabler.io). Check Tabler's license for usage terms.
