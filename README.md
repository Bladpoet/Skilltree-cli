# Skill Tree

A visual skill tree viewer for AI coding tools. Scans skills installed on your machine and displays them in a game-inspired dark interface — browse by category, inspect details, and spot overlapping skills at a glance.

## Usage

```bash
npx skilltree-cli
```

That's it. The scanner runs, your browser opens, and the skill tree renders automatically.

## What it scans

Skill Tree looks for installed skills in these locations:

**Global (user-level)**

| Location | Source |
|---|---|
| `~/.claude/skills/` | Claude Code global skills |
| `~/.claude/plugins/marketplaces/` | Claude marketplace plugins |
| `~/.claude/plugins/cache/.../skills/` | Installed Claude plugins |
| `~/.cursor/skills/` | Cursor editor skills |
| `~/.config/opencode/skills/` | OpenCode skills |
| `~/.codex/skills/` | Codex skills |
| `~/.agents/skills/` | Generic agent skills |

**Project-level (current directory)**

| Location | Source |
|---|---|
| `.claude/skills/` | Claude Code project skills |
| `.cursor/skills/` | Cursor project skills |
| `.opencode/skills/` | OpenCode project skills |
| `.github/skills/` | GitHub project skills |
| `.agents/skills/` | Generic agent project skills |

No API keys or accounts required. Everything runs locally on your machine.

## What you get

- All discovered skills in one place, organised by category
- A detail panel per skill showing full description, triggers, file path, and source
- Overlap detection — skills that serve similar purposes are flagged and cross-linked
- Summary stats at the top (skills, categories, overlapping)
- Sound effects and a splash screen because why not

## Requirements

- Node.js 18 or later

## Local development

```bash
# Install dependencies
npm install

# Run the scanner then start the dev server (uses your real skills)
npm run dev:real

# Start the dev server with mock data (no scanner needed)
npm run dev
```

## How it works

`generate.js` scans the skill directories on your machine and writes a `public/skills.json` file. The React front end reads that file and renders the tree. When you run `npx skilltree-cli`, a CLI wrapper handles both steps and opens the result in your browser automatically.
