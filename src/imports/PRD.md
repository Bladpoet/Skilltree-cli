# Claude Skills — V2.4 PRD

## Overview
Claude Skills is a local visual tool for Claude Code users. It scans installed skills on a machine, writes the results to `public/skills.json`, and presents them in a game-inspired skill tree interface.

The current direction is no longer a card or grid dashboard. The main product expression is now the skill tree UI.

---

## Core problem
Users install Claude Code skills across multiple locations and lose visibility into:
- what skills they have
- what each skill does
- which skills overlap or conflict
- where each skill lives on disk

The product solves this by turning scattered skill files into one browsable visual system.

---

## Product goals
The app should let a user:
- see all discovered skills in one place
- browse them by category
- inspect one skill in detail
- quickly notice conflicts
- navigate from one conflicting skill to another
- understand source, triggers, and path without opening files manually

---

## V1 product shape
V1 is a local-only tool with:
- a Node scanner script
- a React front end
- no backend
- no database
- no required AI

Flow:

```bash
node generate.js
npm run dev
```

`generate.js` scans skill locations and writes `public/skills.json`. The front end reads that file and renders the tree.

---

## Main UI direction
The product is presented as a videogame-inspired skill tree with a premium dark interface.

### Structure
- each hex node = one skill
- each category cluster = one category of skills
- each category has a predefined orientation template
- only the number of slots needed for the discovered skills are shown
- unused slots are hidden in the live UI

### Important note on connectors
Connectors are decorative only. They do not communicate dependency or graph logic.

### Category orientations
There are 3 predefined category orientations.
They rotate across the page for visual rhythm.

Example rotation:
- 4 categories → `1, 2, 3, 1`
- 5 categories → `1, 2, 3, 1, 2`

Each template has:
- slot positions
- connector fragments
- a fill order for 1 to max skills

---

## Node states
Each skill node is a reusable component with multiple states:
- default
- hover
- selected / pressed
- conflict

The selected state is tied to the open detail drawer.

---

## Detail drawer
Clicking a skill opens a right-side detail drawer.

The drawer should contain:
- skill name
- category tag
- path
- description
- triggers list
- source link
- conflict section

### Conflict section
The conflict section should show:
- short conflict summary in plain language
- conflicting skill items as clickable navigation targets

The drawer should not include:
- conflict severity
- overlapping keyword lists
- unnecessary metadata that weakens clarity

---

## Page-level elements
The page should also show:
- app title
- summary stats at the top
  - total categories
  - conflicting skills or conflict count
  - similar skills count
- note that built-in Claude Code skills are not included in v1 if they cannot be reliably scanned from disk

---

## Category treatment
Each category cluster should have:
- a category header component
- one of the 3 predefined orientations
- only the visible skills for that category
- hidden unused slots

Category headers should be reusable components because their design may change later.

---

## Category overflow behavior
When the number of categories exceeds the visible page width:
- use left/right edge arrow controls as the primary navigation
- treat the category area as a controlled horizontal rail
- a visible bottom scrollbar should not be part of the intended UI
- secondary input methods like trackpad, mouse wheel, or swipe can still work if supported
- arrows should hide or disable at the ends of the rail

---

## Mock data policy
During UI build and proof of concept work:
- keep mock data in a separate file such as `mock-skills.json`
- keep real scanner output in `public/skills.json`
- make it easy to switch between mock and real data with a simple flag
- mock data must be removable or ignorable without changing component structure

This prevents build-time testing data from conflicting with real scan output.

---

## Icon strategy for hex nodes
Each hexagonal skill node should show an icon.

Icon source priority:
1. use a matching icon from a custom uploaded icon set if provided
2. otherwise use a mapped icon from an installed icon library
3. otherwise use a default fallback icon

Preferred icon library: `lucide-react`.

Important rule for build tools:
- do not guess icons loosely
- use a defined skill-to-icon mapping when possible
- fallback only when no mapped or provided icon exists

---

## Build and handoff logging
The build should maintain a living `Progress.md` file so another AI tool such as Cursor can take over at any point.

Logging rules:
- Figma Make should update the progress file after every major generation or refinement step
- entries should be concise, factual, and easy for another AI to parse
- the file should act as a build log, decision log, and handoff note combined
- the format should stay consistent across all steps

---

## What is explicitly not required in V1
- AI-generated descriptions
- AI-dependent categorization
- AI-dependent rendering
- dependency graph logic for connectors
- backend services
- user accounts
- install/remove skills from the UI

---

## AI stance
V1 does not require AI.

Descriptions come from the scanned skill files. Categories and conflicts can be rule-based.

AI may be considered in a later version for:
- cleaner conflict summaries
- smarter categorization
- improved natural-language summaries

The product should still work fully without AI.

---

## Build approach
The UI should be built in components, even when using Figma Make first.

Current implementation approach:
- use Figma Make first for the proof of concept and visual fidelity
- build the UI in chunks, not one giant prompt
- maintain a structured `Progress.md` so the project can later move into Cursor cleanly
