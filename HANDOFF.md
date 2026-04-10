# Skill Tree CLI - Handoff

## Current State
- Full skill tree UI with hexagonal nodes, category clusters, detail drawer
- Real scanner integration with `generate.js` -> `public/skills.json`
- Custom brush-stroke SVG assets exported from Figma (NOT Lucide icons)
- Sound effects for UI interactions (drawer open/close)
- Typography: Albertus Nova font family
- npx CLI packaging working (`skilltree-cli`)
- **NEW: Splash screen** - 3-second loading animation before main app (smooth fade-out, no blank flashes)

## Last Completed
- **Scanner Bug Fixes + Overlap Scoring Overhaul** (2026-04-09) - Restored skill count from 7 to 31 + trustworthy overlap detection
  - Fixed `ignoredDirectoryNames` set - removed `"cache"` which was blocking `~/.claude/plugins/cache/` tree
  - Restored `~/.claude/plugins/marketplaces` to baseScanRoots (was deleted, re-added as permanent base root alongside plugin cache paths)
  - Fixed trigger extraction - now uses `fullDescription` instead of truncated display description (avoids losing "Use when..." clauses)
  - Capped trigger phrases at 40 characters for drawer chip display (ensures one-liners without CSS ellipsis)
  - Implemented multi-signal overlap scoring system to replace binary conflict/similar logic:
    - Added `levenshtein()` utility for slug similarity detection
    - Added `genericActionVerbs` set to filter noise words before token comparison
    - New scoring: identical slug = 10pts (instant flag), near-identical = 5pts, +2 per shared trigger token, +1 per shared description token, threshold 6
    - Result: overlap badge dropped from inflated count to only genuine overlaps (skills with shared domain signals like "copywriting" <-> "copy-editing")
  - Verified: 31 skills found (up from 7), 9 genuine overlaps (vs many false positives), 6 categories (10-category system from previous work)

- **Drawer Origin Simplification + Trigger Refinement** (2026-04-09) - Drawer provenance simplified; trigger chips now read like curated use-case labels
  - Drawer: replaced multi-row provenance with a single `Origin` section that displays the humanized install family (the same wording previously used for "Installed from")
  - Drawer: intentionally does not render `Allowed tools` yet, but it remains in the data model for future use
  - Runtime model passthrough: `installedFrom`, `tags`, `shortDescription`, `license`, `compatibility`, and `allowedTools` are preserved by the normalizer (optional/non-breaking for older scan outputs and mock data)
  - Trigger refinement: new ranked pipeline that prefers explicit trigger fields, then structured sections (`When to use`, `Use when`, `Triggers`, `Best used for`), then description-based extraction, with skill-name fallback only as last resort
  - Trigger normalization: strips policy markers (`Always`, `Recommended`, `Optional`, `Skip`), dedupes by meaning, and caps output to 4 chips per skill
  - Font cleanup: removed remaining `Rajdhani` usage (stat badges now use `Albertus Nova`) and removed the Google Fonts import from `src/styles/fonts.css`
  - HTML title: `index.html` now uses `Skill Tree`
  - Packaging cleanup (prep for later npx slimming): removed unused deps and moved browser-only libs out of published runtime `dependencies` where safe (verify with `npm run build` + `npm pack --dry-run`)

- `3e71b4a` - Add npx CLI packaging for skilltree-cli

- **Splash Screen Feature** (2026-04-06) - 3-second loading screen with smooth app transition
  - Created `src/app/components/splash-screen.tsx` - full-featured splash with animated logo, title, pulsing dots, tagline
  - Modified `src/app/App.tsx` - 3-phase splash timing (content visible -> content fading while app fades in -> splash unmounts)
  - Exported `src/assets/splash-logo.png` from Figma (93x140px at 3x scale, 55KB)
  - Set dark body background in `index.html` for seamless transitions
  - Background (gradient + image) persists throughout fade sequence, only content fades

- **SVG Brushstroke Connectors** (2026-04-08) - Exact Figma-to-code connector implementation
  - Exported `src/assets/connector-vertical.svg` (1x78px brushstroke, fill="#C2AE87") and `src/assets/connector-horizontal.svg` (60x1px brushstroke) from Figma
  - Added `TemplateLine` interface to `src/app/lib/category-cluster-templates.ts` with fields: `id`, `x`, `y`, `length`, `orientation`
  - Rewrote all 7 category cluster templates with exact absolute coordinates extracted from Figma:
    - Template 1 (1 node): Single node, no connectors
    - Template 2 (2 nodes): Vertical pair with 1 vertical connector (x=120, y=84, length=78)
    - Template 3 (3 nodes): Triangle with 1 vertical (x=117, y=84, length=42) + 1 horizontal (x=89, y=126, length=60)
    - Template 4 (4 nodes): T-shape with 1 vertical (x=117, y=84, length=78) + 1 horizontal (x=88, y=126, length=60)
    - Template 5 (5 nodes): Vertical spine with 2 verticals + 1 horizontal
    - Template 6 (6 nodes): Vertical spine with 2 verticals + 2 horizontals
    - Template 7 (7+ nodes): Vertical spine with 3 nodes + 2 horizontal pairs
  - Updated `DecorativeConnector` in `src/app/components/category-cluster.tsx` to render SVG brushstroke images instead of `<line>` elements
  - Replaced SVG connector layer with absolute-positioned `<img>` elements from `template.lines`, sized dynamically by `length` and `orientation`
  - Coordinates extracted directly from Figma via Desktop Bridge plugin to ensure pixel-perfect accuracy

## Next Steps / Future Polish
- Test splash on various screen sizes and connections
- Optional: Add user preference to skip splash on return visits (localStorage)
- Optional: Sound effects during splash sequence
- Monitor splash timing for mobile (may want to reduce 3s delay on slow networks)

## Key Decisions
- Connectors are decorative only, not dependency graph
- 3 rotating category orientations
- Icons from custom `claude-skills-icons/` library, not generic icon sets
- Mock vs real data via `?data=mock|real|auto` query params
- Scanner output: `public/skills.json` served by Vite

## Splash Screen Technical Details

### Architecture
- **3-phase timing system** in `App.tsx`:
  - "content" (0-2.7s): Splash bg + content visible, app opacity 0
  - "fading" (2.7-3.5s): Content fades, app fades in simultaneously underneath splash bg
  - "done" (3.5s+): Splash unmounted, app fully visible
- **Two-layer component structure**:
  - Background layer (z-index 998): Never fades, dark gradient + atmospheric image (identical to AppShell bg)
  - Content layer (z-index 999): Fades independently via `contentVisible` prop
- **No flashing**: Identical backgrounds on both splash and app ensure visual continuity when splash unmounts

### Timings
- Content fade: 0.3s ease
- App fade: 0.5s ease (starts at 2.7s, no delay)
- Content fully gone: 3.0s
- Splash fully unmounts: 3.5s (app already at ~100% opacity by this point)

### Visual Design
- Background: Linear gradient `#0a0500` -> `#0e0900` + `claude-skill-tree-bg.png` (atmospheric arc/glow)
- Logo: Vectorized circuit tree, 93x140px PNG
- Title: Albertus Nova Light, 24px, letter-spacing 0.35em, gold gradient (rgb(194,137,21) -> rgb(136,73,0))
- Loading dots: 3 ellipses, white-to-amber gradient, staggered pulse (1.4s cycle, 0.2s offsets)
- Tagline: Albertus Nova Light, 16px, rgb(130,112,97)
- Border lines: CSS gradients, top 58.9% width, bottom 93.3% width

## Design Tokens (from Figma)
- Drawer BG: `rgb(255,247,227)`
- Close button: `#635949` default, `#282521` hover
- Copy button: `#7E766D` default, `#282521` hover, `#494542` copied
- Font: Albertus Nova (serif)

## Run Commands
- `npm run dev:real` - Run scanner then start dev server
- `npm run skills:generate` - Run scanner once
- `npm run build` - Production build

