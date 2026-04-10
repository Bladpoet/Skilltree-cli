# Skill Tree

A visual skill tree viewer for AI coding tools. Scans skills installed on your machine and displays them in a game-inspired dark interface — browse by category, inspect details, and spot overlapping skills at a glance.

## Usage

```bash
npx skilltree-cli
```

That's it. The scanner runs, your browser opens, and the skill tree renders automatically.

## What it scans

Skill Tree looks for installed skills in these locations:

| Location | Source |
|---|---|
| `~/.claude/skills/` | Claude Code skills |
| `~/.claude/plugins/marketplaces/` | Claude marketplace plugins |
| `~/.codex/skills/` | Codex skills |

No API keys or accounts required. Everything runs locally on your machine.

## Requirements

- Node.js 18 or later

## What you get

- All discovered skills in one place, organised by category
- A detail panel per skill showing description, triggers, file path, and source
- Conflict detection — skills that overlap in purpose are flagged and cross-linked
- Summary stats at the top (skills, categories, overlapping)

## Local development

```bash
# Install dependencies
npm install

# Run scanner then start the dev server
npm run dev:real

# Or start the dev server with mock data
npm run dev
```

## How it works

`generate.js` scans the skill directories on your machine and writes a `skills.json` file. The React front end reads that file and renders the tree. When you run `npx skill-tree`, a CLI wrapper handles both steps and opens the result in your browser automatically.
