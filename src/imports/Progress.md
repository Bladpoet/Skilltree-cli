# Claude Skills — Progress V2.4

## Purpose
This file tracks build progress so work can move between Figma Make and Cursor without losing context.

This is a living handoff document.
Figma Make should update it after every major generation or refinement step.

---

## Current direction locked in
- skill-tree-first UI
- connectors are decorative only
- 3 rotating category orientations
- no empty ghost nodes in the live UI
- right-side detail drawer
- category overflow handled with edge arrows
- no visible bottom scrollbar in intended UI
- icons inside hex nodes should come from custom icons or mapped library icons
- do not let the build tool guess icons loosely
- mock data stays separate from real scanner output
- build in chunks, not one giant prompt

---

## Current build environment
Primary build tool for now:
- Figma Make

Fallback / later continuation:
- Cursor

---

## Data mode
During UI build:
- use `mock-skills.json`
- do not overwrite real scanner output

When scanner wiring begins:
- switch to `public/skills.json`

---

## Build order
1. app shell
2. top stats and title
3. reusable skill node
4. one category cluster template
5. category header
6. drawer
7. click interactions
8. remaining category templates
9. overflow arrows
10. polish

---

## Required log entry format
Use this exact structure after each major step.

```md
## Step X - [Name]

### Completed
- ...

### Components Created
- ...

### Components Updated
- ...

### Decisions Made
- ...

### Assumptions
- ...

### Known Issues
- ...

### Next Recommended Step
- ...
```

### Logging rules
- keep entries short and factual
- mention actual component names when possible
- state what changed, not vague impressions
- include shortcuts or temporary logic
- include anything another AI would need to continue safely

---

## Notes for later handoff
If this moves to Cursor later, preserve:
- template-driven category rendering
- mock vs real data separation
- icon mapping logic
- component boundaries
- overflow rail behavior
- drawer interaction logic

---

## Step 1 - App Shell

### Completed
- Full dark background scene (`#16161a`)
- Top bar with "Claude Skills" title in Marcellus font, gold (#b79962)
- Three stat badges (Categories, Conflicting, Similar) using Figma SVG assets and Cinzel/Rajdhani fonts
- Horizontal category rail container (empty, ready for clusters)
- Right-side detail drawer shell (hidden by default, toggleable via state)
- Overall layout proportions matching Figma frame

### Components Created
- `/src/app/components/app-shell.tsx` — main layout wrapper (flex row: content + drawer)
- `/src/app/components/top-bar.tsx` — title + stat badges row
- `/src/app/components/stat-badge.tsx` — reusable ornate badge with Figma SVG paths and image assets
- `/src/app/components/category-rail.tsx` — horizontal rail container for future category clusters
- `/src/app/components/detail-drawer.tsx` — right-side drawer shell with close button

### Components Updated
- `/src/app/App.tsx` — wired all shell components, imports mock-skills.json for stats

### Decisions Made
- Background color `#16161a` chosen to match Figma dark atmosphere
- Stat badges reuse Figma-exported SVG paths and base texture image directly for visual fidelity
- Each stat badge gets a unique SVG filter ID to avoid SVG filter collisions
- Drawer defaults to closed; toggled via `drawerOpen` state in App
- Google Fonts loaded for Marcellus, Marcellus SC, Rajdhani, Cinzel
- Mock data imported directly from `mock-skills.json` (not fetched)

### Assumptions
- Figma asset imports (`figma:asset/...`) resolve correctly in the build environment
- SVG path data from `svg-tfxbcoju7v.ts` is available and complete
- Drawer width of 320px matches intended Figma proportions

### Known Issues
- Drawer cannot be opened yet (no skill node click interaction wired — that is Step 7)
- Category rail is empty — clusters will be added in Steps 4-5
- Drawer content is empty — will be built in Step 6

### Next Recommended Step
- Step 2: Build reusable top bar stat badge refinements and divider styling if needed, or proceed directly to Step 3 (hexagonal skill node component)

---

## Step 1.1 - Refactor App Shell

### Completed
- Extracted repeated ornate badge SVG structure into shared `OrnateFrame` component
- Simplified `StatBadge` to compose `OrnateFrame` instead of inlining ~80 lines of SVG per badge
- SVG filter IDs now auto-generated via `useId()` instead of manual `filterId` props
- Replaced inline SVG close icon in `DetailDrawer` with lucide-react `X`
- Removed redundant `isOpen` prop from `DetailDrawer` (parent already gates rendering)
- Removed redundant wrapper div in `TopBar`
- Stat badge labels rendered via data array loop instead of 3 separate JSX blocks
- Created placeholder skeletons for `HexNode`, `CategoryHeader`, `CategoryCluster`

### Components Created
- `/src/app/components/ornate-frame.tsx` — shared Figma ornate badge frame (base texture, rings, glow, decoration marks)
- `/src/app/components/hex-node.tsx` — placeholder skeleton for reusable hex skill node (Step 3)
- `/src/app/components/category-header.tsx` — placeholder skeleton for category tab header (Step 5)
- `/src/app/components/category-cluster.tsx` — placeholder skeleton for category cluster layout (Step 4)

### Components Updated
- `/src/app/components/stat-badge.tsx` — now composes `OrnateFrame`, removed ~80 lines of inline SVG, removed `filterId` prop
- `/src/app/components/top-bar.tsx` — removed wrapper div, stat badges rendered via loop
- `/src/app/components/detail-drawer.tsx` — uses lucide-react `X`, removed `isOpen` prop
- `/src/app/App.tsx` — simplified stats destructuring, removed `isOpen` pass-through

### Decisions Made
- `OrnateFrame` uses `useId()` for SVG filter IDs — no collision risk, no manual naming
- Decoration SVG paths stored in a const array inside `OrnateFrame` to avoid per-instance duplication
- Placeholder components have typed props matching the Technical PRD interfaces
- `HexNode` uses CSS `clip-path` for temporary hex shape (will be replaced with Figma SVG in Step 3)
- `CategoryCluster` accepts `orientation` prop (1/2/3) matching the 3-template rotation plan

### Assumptions
- `useId()` is available (React 18+)
- Placeholder components will be fully replaced in their respective build steps
- Component file names follow kebab-case convention for consistency

### Known Issues
- Placeholder hex node uses CSS clip-path, not the Figma hex SVG — visual fidelity is temporary
- Drawer still cannot be opened (no interaction wired yet — Step 7)
- Category rail still empty — clusters added in Step 4

### Next Recommended Step
- Step 2: Top bar refinements if needed, or proceed directly to Step 3 (hexagonal skill node component with Figma SVG and icon mapping)

---

## Step 1.2 - Refactor Figma Reference Files

### Completed
- Refactored `Desktop16.tsx` from ~4158 lines to ~220 lines (95% reduction)
- Refactored `ClaudeSkillTreeSideDrawer.tsx` from ~4683 lines to ~370 lines (92% reduction)
- Extracted 5 new shared components used by both reference files and future live app
- Reviewed SVG path files — left as-is (auto-generated asset files, no duplication issues)

### Components Created
- `/src/app/components/figma-hex-frame.tsx` — `FigmaHexFrame` (3-layer hex SVG), `FigmaPaletteIcon` (default icon overlay), `FigmaHexNode` (frame + label combo)
- `/src/app/components/figma-category-tab.tsx` — `FigmaCategoryTab` (gradient tab with edge SVGs and texture)
- `/src/app/components/figma-connector.tsx` — `FigmaTreeConnector` (V-shaped), `FigmaDiagonalLine` (angled connector)
- `/src/app/components/figma-arrow.tsx` — `FigmaArrow` (right-edge scroll arrow)

### Files Refactored
- `/src/imports/Desktop16.tsx` — replaced ~40 identical hex node definitions with `FigmaHexNode`, ~5 tab definitions with `FigmaCategoryTab`, ~3 stat badge groups with `StatBadge`, connector clusters with data-driven loops
- `/src/imports/ClaudeSkillTreeSideDrawer.tsx` — same hex/tab/badge cleanup, plus extracted drawer-specific components: `DrawerButton`, `TriggerTag`, `SkillInfo`, `Breadcrumb`, `SourceLink`, `ConflictBadge`, `DrawerHexNode`

### Heavy Files Status
| File | Original Size | Refactored Size | Status |
|------|--------------|-----------------|--------|
| `Desktop16.tsx` | ~4158 lines | ~220 lines | ✅ Refactored |
| `ClaudeSkillTreeSideDrawer.tsx` | ~4683 lines | ~370 lines | ✅ Refactored |
| `svg-tfxbcoju7v.ts` | large | unchanged | ✅ Acceptable — auto-generated SVG path data, no duplication |
| `svg-ftc0hkcrsa.ts` | large | unchanged | ✅ Acceptable — auto-generated SVG path data, contains drawer-specific paths |
| `svg-dwdr2.tsx` | ~2 lines | unchanged | ✅ Minimal — inline SVG data URIs for mask images |

### Decisions Made
- SVG path files left as-is — they are asset files, not component code; they don't duplicate each other (different Figma exports with overlapping but not identical content)
- Both `svg-tfxbcoju7v.ts` and `svg-ftc0hkcrsa.ts` export the same key names for shared paths; shared components import from `svg-tfxbcoju7v` only
- Drawer content extracted into named components (`TriggerTag`, `ConflictBadge`, etc.) so they can be reused when building the live drawer in Step 6
- Diamond cluster node/connector positions stored in const arrays instead of 14+ separate component definitions
- Hex frame shared component uses exact Figma measurements (93.943px, polygon insets, rotation angles)

### Assumptions
- Reference files do not need to render pixel-identically — close visual match is sufficient
- `FigmaHexFrame` will be replaced or wrapped by the live `HexNode` in Step 3
- Drawer components will be adapted into the live `DetailDrawer` in Step 6

### Known Issues
- Reference files may show slight visual differences from originals due to simplified wrapper structure
- `ClaudeSkillTreeSideDrawer` globe icon SVG preserved inline (unique, not reused elsewhere — could extract later)
- Both reference files share `TreeCluster` and `DiamondCluster` code (minor duplication between files — acceptable for reference files)

### What Should Be Cleaned Later in Cursor/Codex
- Consolidate `svg-ftc0hkcrsa.ts` and `svg-tfxbcoju7v.ts` into a single SVG paths file if confirmed they have identical shared keys
- Replace `FigmaHexFrame` with the production `HexNode` component once Step 3 is complete
- Replace `FigmaCategoryTab` with the production `CategoryHeader` once Step 5 is complete
- Move drawer-specific components (`TriggerTag`, `ConflictBadge`, `DrawerButton`) into `/src/app/components/` when building Step 6
- Consider deleting the reference files entirely once all live components match the Figma fidelity

### Next Recommended Step
- Step 3: Build the production hexagonal skill node component (`HexNode`) using `FigmaHexFrame` as the base, adding icon mapping, state variants, and click interaction

---

## Step 2 - Hexagonal Skill Node Component System

### Completed
- Built production `SkillNode` component with 4 visual states: default, hover, selected, conflict
- Created skill-to-icon mapping system using lucide-react
- Uses Figma hex frame SVG paths from Component1.tsx (svg-x0e8ml4dfy) as the visual source of truth
- Integrated into App.tsx with state demo row and interactive demo row showing all states
- Hover state auto-applies on mouse enter when controlled state is "default"
- Conflict state shows a warning badge (AlertTriangle icon) in top-right corner
- Labels truncate with text-ellipsis for long skill names
- Old `hex-node.tsx` placeholder converted to a re-export shim for backward compatibility

### Components Created
- `/src/app/components/skill-node.tsx` — `SkillNode` (main component), `HexFrame` (state-aware hex shape), `ConflictBadge` (warning indicator)
- `/src/app/components/skill-node-icon-map.ts` — `skillIconMap` (skill name → lucide icon name), `FALLBACK_ICON` constant

### Components Updated
- `/src/app/components/hex-node.tsx` — replaced placeholder with re-export shim pointing to `SkillNode`
- `/src/app/App.tsx` — added state demo row (4 fixed-state nodes) + interactive demo row (8 skills from mock data with click-to-select and conflict detection)

### Decisions Made
- Used `svg-x0e8ml4dfy.ts` paths (from Figma Component1 frame) instead of `svg-tfxbcoju7v.ts` (Desktop16 thumbnails) — Component1 is the explicit single-node design frame, more authoritative
- Hex size set to 94px to match category rail grid sizing from Desktop16 layout
- State colors derived from 4 Figma frame screenshots: default (gray #F0F1F3/#515E59), hover (gold outline #DCB773), selected (gold glow #DCB773 + stronger fill), conflict (red #6B3A3A/#8B6060 + badge)
- Glow effect implemented as a blurred div behind the hex (not SVG filter) for performance and simplicity
- Icon resolution uses a mapping object + fallback; no auto-guessing per Technical PRD guidance
- `SkillNode` is a `<button>` element for accessibility (keyboard focusable, click handler)
- Hover state only activates when controlled state is "default" — prevents hover overriding selected/conflict

### Assumptions
- The 94px hex size will work in category cluster layouts (Step 4); may need adjustment
- Icon mapping will grow as more skills are added — currently covers all mock-skills.json entries
- `FigmaHexFrame` and `FigmaHexNode` in figma-hex-frame.tsx remain for reference file usage; production code uses `SkillNode`

### Known Issues
- Glow effect may clip in tight layouts — overflow-visible on parent containers may be needed
- The component imports all of lucide-react via `import * as LucideIcons` — tree-shaking should handle this in production builds, but could be optimized with dynamic imports later
- Conflict badge position is absolute top-right — may need adjustment based on cluster layout context

### Next Recommended Step
- Step 3: Category cluster layout templates (template-driven rendering of skill nodes in tree/diamond patterns with connectors)