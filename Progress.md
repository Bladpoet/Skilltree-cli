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

## Step 3 - First Category Cluster Template

### Completed
- Replaced the live app's remaining `figma:asset/...` runtime imports with local asset imports so Vite can build and serve the project outside Figma Make.
- Switched the active app to use the root `mock-skills.json` file as the current UI data source of truth.
- Implemented the first reusable category cluster orientation using fixed slot positions based on the Figma cluster reference.
- Rendered category clusters from grouped mock data with slot-based placement, decorative connectors, and hidden unused slots.
- Verified `npm run build` succeeds and verified `npm run dev` responds successfully on `http://127.0.0.1:4173` when started outside the sandbox.

### Components Created
- `src/app/lib/category-cluster-templates.ts`
- `src/app/lib/skill-tree.ts`
- `src/app/types/skills.ts`

### Components Updated
- `src/app/App.tsx`
- `src/app/components/category-cluster.tsx`
- `src/app/components/category-header.tsx`
- `src/app/components/category-rail.tsx`
- `src/app/components/figma-category-tab.tsx`
- `src/app/components/ornate-frame.tsx`
- `src/app/components/skill-node-icon-map.ts`

### Decisions Made
- Kept the raw Figma export files under `src/imports/` as reference material only and removed them from the runtime path instead of trying to fully convert them now.
- Implemented orientation `1` first, but kept the template/config structure reusable so orientations `2` and `3` can slot in later without rewriting the cluster renderer.
- Used decorative SVG line fragments derived from slot relationships rather than dependency logic, matching the PRD rule that connectors are visual only.
- Kept the drawer content intentionally lightweight in this step so the full detail drawer can still be built as its own focused step later.

### Assumptions
- The root `mock-skills.json` file is the correct source of truth during the UI-only build phase.
- A horizontally scrollable rail with hidden scrollbars is acceptable as a temporary bridge until the dedicated overflow arrow step is implemented.
- Preserving the current visual direction is more important than reproducing every Figma connector fragment exactly in this step.

### Known Issues
- Skill node glow can still overflow visually if a future container reintroduces clipping around cluster content.
- `src/app/components/skill-node.tsx` still uses `import * as LucideIcons`; explicit icon imports remain a later optimization.
- Heavy reference files remain in `src/imports/`, especially `Desktop16.tsx`, `ClaudeSkillTreeSideDrawer.tsx`, and the duplicated docs/data copies in that folder.
- The full production drawer layout and conflict navigation are not implemented yet; the current drawer is a temporary selection summary.

### Next Recommended Step
- Build the dedicated detail drawer component and wire conflict-to-conflict navigation, then continue with the remaining category orientations.

## Step 3 - Visual Fidelity Refinement

### Completed
- Used connected Figma frames `227:9149`, `235:12759`, and drawer group `235:14446` as the visual reference for the current Step 3 screen.
- Refined the title/stat area proportions to better match the Figma top bar spacing and badge sizing.
- Tightened the category cluster presentation with more Figma-like rail spacing and subtler decorative connectors.
- Reduced the current node glow intensity and adjusted default/selected/conflict fills and strokes to sit closer to the Figma component set.
- Restyled the lightweight right drawer as an overlaid side panel matching the connected Figma shell more closely without expanding its product scope.

### Components Created
- None

### Components Updated
- `src/app/App.tsx`
- `src/app/components/app-shell.tsx`
- `src/app/components/top-bar.tsx`
- `src/app/components/stat-badge.tsx`
- `src/app/components/ornate-frame.tsx`
- `src/app/components/figma-category-tab.tsx`
- `src/app/components/category-rail.tsx`
- `src/app/components/category-cluster.tsx`
- `src/app/components/detail-drawer.tsx`
- `src/app/components/skill-node.tsx`

### Decisions Made
- Kept all runtime-safe local assets and did not reintroduce any Figma-only imports.
- Preserved the existing template-driven cluster structure and focused only on visual corrections for the current screen.
- Kept the drawer lightweight in content while moving its shell closer to the Figma side-drawer composition.

### Assumptions
- Matching the Figma layout shell, proportions, and decorative weight is the priority for this pass, even if some micro-textures and exact vector fragments remain approximated.
- The current drawer can remain a visual placeholder until the later dedicated drawer step.

### Known Issues
- The drawer top-left green button and some internal panel textures are still simplified CSS stand-ins for heavier Figma image layers.
- Connector paths are visually closer now, but still approximated from slot relationships instead of reproducing each Figma fragment exactly.
- The stat badge and tab textures still rely on extracted local images, so bundle weight remains higher than ideal.
- Remaining cluster orientations are still not implemented in this step.

### Next Recommended Step
- Keep Step 3 closed after review, then move to the dedicated drawer/content step or the remaining cluster orientations, depending on priority.

## Step 4 - Detail Drawer And Conflict Navigation

### Completed
- Expanded the drawer from a placeholder summary into a fuller skill detail panel using the PRD and technical PRD field requirements.
- Added dedicated sections for skill title, category, path, triggers, source link, and conflict details.
- Implemented conflict navigation so conflicting skills inside the drawer are clickable and switch the active selection immediately.
- Kept the drawer inside the current runtime-safe visual shell and preserved the existing app shell, node system, and cluster layout direction.
- Verified `npm run build` succeeds and verified `npm run dev` responds successfully on `http://127.0.0.1:4173`.

### Components Created
- `src/app/components/skill-detail-panel.tsx`

### Components Updated
- `src/app/App.tsx`
- `src/app/components/detail-drawer.tsx`
- `src/app/lib/skill-tree.ts`
- `src/app/types/skills.ts`

### Decisions Made
- Kept the drawer content modular by moving the full inner content into its own component instead of growing `App.tsx` further.
- Used clickable conflict cards with the existing `SkillNode` component so navigation stays visually consistent with the rest of the UI.
- Kept the current Figma-aligned shell styling and only expanded the content model required for Step 4.

### Assumptions
- Conflict navigation should keep the drawer open and simply replace the selected skill detail view.
- Showing the selected skill as a larger node inside the drawer is consistent with the current visual direction and acceptable for Step 4.

### Known Issues
- The drawer shell is still an approximation of the Figma side panel rather than a pixel-perfect reconstruction of every decorative texture layer.
- Conflict items are implemented as richer cards rather than exact Figma duplicate mini-panels.
- `src/app/components/skill-node.tsx` still uses `import * as LucideIcons`; explicit icon imports remain a later optimization.
- Remaining cluster orientations and rail overflow arrows are still separate later steps.

### Next Recommended Step
- Continue with the remaining category orientations and rail overflow behavior once the Step 4 drawer flow is approved.

## QA And Polish Pass - Step 1 To 4 Flow

### Issues Found
- Conflict cards in the drawer nested a clickable `SkillNode` inside a clickable card, creating invalid interaction structure.
- Drawer scroll position did not reset when switching between selected skills from the conflict list.
- The selected drawer node switched to the conflict visual state, which reduced clarity between "selected" and "has conflicts".
- Trigger chips and conflict-card content needed stronger wrapping protection for longer values.
- The rail hid overflow without a strong navigation affordance, making clipped categories easy to miss.
- The drawer repeated category information in multiple places and could feel redundant.

### Issues Fixed
- Made drawer preview nodes non-interactive inside conflict cards to remove nested-button behavior.
- Reset drawer scroll to the top whenever the selected skill changes.
- Kept the main drawer node visually selected and used the conflict badge/section to communicate conflict status separately.
- Improved wrapping and overflow handling for long paths, trigger values, and long conflict-card skill names.
- Added lightweight left/right rail controls and edge fades to improve overflow discoverability without changing the overall product direction.
- Reduced repeated drawer metadata by simplifying the secondary meta line.

### Intentionally Deferred
- Full remaining cluster orientations are still deferred.
- Exact pixel reconstruction of every Figma connector fragment and drawer texture layer is still deferred.
- Explicit per-icon Lucide imports are still deferred.
- Larger bundle-size cleanup is still deferred because the local texture assets are still being used for fidelity.

### Recommended Next Step
- Implement the remaining category orientations and then finish the rail/overflow interaction as a complete polished step.

## Scanner Integration And Real-Data Readiness

### Completed
- Added a runtime-safe data loader that attempts to read real scanner output from `public/skills.json` and falls back to `mock-skills.json` when the scanner file is missing or unusable.
- Kept the mock-data path intact and added a simple query-param mode switch for development: `?data=mock`, `?data=real`, or `?data=auto`.
- Normalized incoming scanner-shaped data into the existing UI data model so current category, drawer, trigger, source, path, and conflict components can render without structural changes.
- Added selection guard logic so the drawer closes cleanly if the active skill disappears after switching between mock and real datasets.
- Verified `npm run build` succeeds after the data-loading changes.

### Components Created
- `src/app/lib/skill-data.ts`

### Components Updated
- `src/app/App.tsx`

### Decisions Made
- Kept the current UI and interaction structure unchanged and handled real-data support as a data-layer concern rather than a component redesign.
- Used `public/skills.json` as the real-data contract expected by the PRD and technical PRD, even though no scanner output file exists in this workspace yet.
- Preserved mock data as the default-safe fallback so local development remains stable when scanner output is absent or partial.

### Issues Found
- The app was still hard-wired to `mock-skills.json`, so no real scanner output could be loaded.
- Schema-difference tracking inside the normalization layer was being dropped during skill and conflict mapping.
- No actual `public/skills.json` or local `generate.js` scanner script is present in this repository, so a full real scanner round-trip could not be tested here.

### Issues Fixed
- Replaced the direct mock-data wiring with a normalized loader hook that prefers `/skills.json` when available.
- Fixed schema-note collection so field fallbacks and inferred conflict handling are now reported correctly.
- Kept the current mock dataset as the automatic fallback when real data is unavailable, empty, or malformed.

### Schema Differences Found
- The loader now accepts a top-level array of skills in addition to the expected `{ skills: [...] }` shape.
- `title` is accepted as a fallback for `name`.
- `group` is accepted as a fallback for `category`.
- `filePath` is accepted as a fallback for `path`.
- `trigger` is accepted as a fallback for `triggers`.
- Top-level `conflicts` can be derived from `skills[].conflictsWith` when a scanner output omits the explicit conflict list.

### UI Breakpoints Caused By Real Data
- No real scanner file was available locally, so there were no confirmed live UI breakpoints from actual scanner output in this workspace.
- Long names, long paths, trigger wrapping, and multi-conflict drawer behavior were already covered in the earlier QA pass and remain the main likely pressure points for real datasets.
- Unknown or missing fields now degrade to safe placeholders such as `Uncategorized`, `Path unavailable`, and `Unknown source` instead of breaking the current UI flow.

### Intentionally Deferred
- Building the actual `generate.js` scanner is still deferred because this step only covered app integration and safe real-data loading.
- Pixel-level validation against a real scanned dataset is still deferred until a real `public/skills.json` artifact is available in the repo or generated locally.

### Recommended Next Step
- Add or restore the real scanner script that writes `public/skills.json`, then run the app against a real scan and tune any category distribution or drawer content edge cases revealed by production-shaped data.

## Real Scanner Round-Trip

### Completed
- Recreated the missing local scanner as `generate.js` because no original `generate.js` existed in this workspace.
- Added a real output location at `public/skills.json`, which is the exact file the app now reads in `?data=real` and `?data=auto` mode.
- Wired the local generation workflow into `package.json` with `npm run skills:generate` and `npm run skills:watch`.
- Scanned the currently available real skill locations on this machine: `~/.codex/skills`, `~/.claude/skills` when present, and `~/.claude/plugins/marketplaces`.
- Generated a real `public/skills.json` file from installed local skills and verified a fresh Vite server serves it as `application/json`.
- Verified the app route responds successfully in real-data mode with `http://127.0.0.1:4174/?data=real`.

### Components Created
- `generate.js`
- `public/skills.json`

### Components Updated
- `package.json`
- `Progress.md`

### Decisions Made
- Rebuilt the scanner around the current app contract instead of waiting for a missing original script, so the real-data path is now functional in this workspace.
- Kept the scanner output in the final UI shape expected by the app to minimize runtime branching and reduce front-end breakage risk.
- Excluded plugin cache folders from scanning and focused on stable install locations to avoid duplicate cached skills.
- Added a watch mode rather than a more complex daemon so local refresh stays simple and easy to reason about.

### Exact Real-Data Location
- Generated scanner output must live at `public/skills.json`.
- Vite serves that file at `/skills.json`.
- The app reads it when running with `?data=real` or the default `?data=auto` mode when the file exists.

### Local Workflow
- Generate once: `npm run skills:generate`
- Regenerate on changes: `npm run skills:watch`
- Run the app against real data: `npm run dev` and open `/?data=real`
- If the dev server was already running before `public/skills.json` existed, restart it so Vite picks up the new public asset.

### Issues Found
- The original scanner script was missing entirely from this workspace, so no real scan output could be produced until it was recreated.
- Raw installed `SKILL.md` files do not provide the full UI schema directly; they generally lack explicit `category`, `triggers`, `sourceUrl`, and `conflictsWith` fields.
- The first scanner heuristic pass over-grouped too many skills and produced too many conflicts, which would have made the UI noisy and less trustworthy.
- A Vite server started before `public/skills.json` existed returned the SPA HTML fallback at `/skills.json`; a fresh server restart fixed that.

### Issues Fixed
- Recreated the scanner and generated a real `public/skills.json` file locally.
- Added package scripts for one-shot generation and watch-based refresh.
- Tightened category and conflict heuristics so the current real dataset distributes across 9 categories with no category exceeding the current 7-slot cluster limit.
- Verified a fresh dev server serves `/skills.json` correctly as JSON and serves the app successfully in `?data=real` mode.

### Schema Differences Found
- Real installed skill files expose `name` and `description` in frontmatter, but categories must be inferred from names, paths, and content.
- Real installed skill files do not expose a canonical `sourceUrl`, so generated records currently use text-only `source` values with `sourceUrl: null`.
- Real installed skill files do not expose explicit `conflictsWith` relationships, so current conflict links are inferred heuristically.
- Real installed skill files do not expose trigger arrays, so trigger chips are inferred from phrases like `Trigger when...` and `Use this skill when...` in descriptions.

### UI Breakpoints Caused By Real Data
- No hard rendering break was found in the generated real dataset after the scanner heuristics were tightened.
- Real data includes duplicate visible names such as `skill-creator` from different install sources; IDs remain unique, but the UI currently does not visually distinguish duplicate labels beyond category and drawer details.
- Some inferred trigger chips are still less polished than hand-authored mock data because they are derived from prose rather than explicit structured fields.
- Rail overflow works conceptually for the 9-category real dataset, but this pass did not include browser automation to visually confirm every scroll state.

### Intentionally Deferred
- Richer source metadata and canonical source links are deferred until the original scanner logic or a dedicated metadata file can be copied from the source project.
- More precise conflict inference is deferred; current conflicts are intentionally conservative heuristics rather than a deep semantic overlap system.
- Automatic browser-level visual validation for `?data=real` is still deferred because this pass focused on making the round-trip work reliably in the local runtime.

### What To Copy From The Original Project If Available
- The original `generate.js` scanner if it contains richer category/source/conflict logic than this recreated version.
- Any explicit metadata rules or mappings for category assignment, trigger extraction, and conflict detection.
- Any canonical source-link resolution logic if the original project tracked repository or marketplace URLs for installed skills.

### Next Recommended Step
- Compare this recreated scanner against the original project scanner if it exists elsewhere, then either merge in the richer metadata rules or add a lightweight post-scan metadata layer so duplicate names, source links, and conflict inference become more precise.

## Step 5 - Scanner Icons, Category Tuning, Motion Polish

### Completed
- Integrated custom icon library scanning from local `claude-skills-icons/index.json` and assigned icons per skill in scanner output.
- Enforced strict unique icon assignment per scan and copied only used icon assets to `public/skill-icons/`.
- Extended skill schema and normalization to support icon metadata (`icon`, `iconName`, `iconFile`, `iconPath`, `iconSource`, `iconScore`).
- Updated skill node rendering to consume scanner-assigned icon paths and preserve state-aware visuals.
- Retuned scanner category grouping with weighted source/content heuristics to reduce over-fragmentation.
- Updated pressed-state icon tint to dark brown and ensured overlap warning triangle is shown for overlapping nodes in selected/pressed flow.
- Added tokenized blurred icon highlight for default and hover states (hover stronger).
- Increased top stat badge size.
- Replaced rail edge overlay fade with CSS `mask-image` fade for cleaner blending over textured backgrounds.
- Improved drawer entry motion with eased overlay fade and panel slide/scale animation.
- Converted `claude-skills-icons` from gitlink to regular tracked directory so future icon-library edits commit normally.

### Components Created
- `public/skill-icons/*` (generated icon asset set)

### Components Updated
- `generate.js`
- `src/app/types/skills.ts`
- `src/app/lib/skill-data.ts`
- `src/app/components/skill-node.tsx`
- `src/app/components/category-cluster.tsx`
- `src/app/components/skill-detail-panel.tsx`
- `src/app/components/category-rail.tsx`
- `src/app/components/stat-badge.tsx`
- `src/app/components/detail-drawer.tsx`
- `claude-skills-icons/*` (now regular tracked directory)

### Decisions Made
- Kept scanner as the source of truth for icon assignment and passed icon metadata through the app data model.
- Used strict uniqueness per scan for icon distribution.
- Used tokenized visual parameters for glow/fade sizing to simplify future tuning.
- Used CSS masking for overflow fade to blend independently of background coloration.

### Assumptions
- Skill count remains below icon-library size in normal runs; fallback icon is available if exhausted.
- Source/path-based category weighting is preferable to broad generic category defaults.
- Smooth motion should preserve existing Figma-inspired visual hierarchy and not change core layout.

### Known Issues
- `public/skills.json` remains ignored by git and is regenerated locally.
- Category heuristics are rule-based and may still need occasional override mappings for edge-case skills.
- Some motion values may still need final timing calibration against Figma references.

### Next Recommended Step
- Add a lightweight category-overrides map and optional scanner diagnostics output (top icon/category scores per skill), then run a visual parity pass for motion timing across default/hover/pressed/drawer transitions.
