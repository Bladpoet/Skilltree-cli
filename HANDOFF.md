# Skill Tree CLI - Handoff

## Current State
- Full skill tree UI with hexagonal nodes, category clusters, detail drawer
- Real scanner integration with `generate.js` → `public/skills.json`
- Custom brush-stroke SVG assets exported from Figma (NOT Lucide icons)
- Sound effects for UI interactions (drawer open/close)
- Typography: Albertus Nova font family
- npx CLI packaging working

## Last Completed
- `351bfec` - Typography updated to Albertus Nova across all components
- `574b483` - Sound effects added for drawer open/close

## In Progress
- **Detail drawer button hover states** - Close (X) and Copy button hover decorations
- Added assets: `close-icon.svg`, `copy-icon.svg`, `check-icon.svg`, `hover-decoration.svg`
- Components modified: `detail-drawer-primitives.tsx`, `detail-drawer.tsx`, `skill-detail-panel.tsx`
- Hover decoration sizing for copy button needs visual verification

## Next Steps
- Verify/improve close and copy button hover decorations visually
- Test hover decoration sizing (copy button decoration 25x31 may overflow 16x16 container)
- Continue polish pass if needed

## Key Decisions
- Connectors are decorative only, not dependency graph
- 3 rotating category orientations
- Icons from custom `claude-skills-icons/` library, not generic icon sets
- Mock vs real data via `?data=mock|real|auto` query params
- Scanner output: `public/skills.json` served by Vite

## Design Tokens (from Figma)
- Drawer BG: `rgb(255,247,227)`
- Close button: `#635949` default, `#282521` hover
- Copy button: `#7E766D` default, `#282521` hover, `#494542` copied
- Font: Albertus Nova (serif)

## Run Commands
- `npm run dev:real` - Run scanner then start dev server
- `npm run skills:generate` - Run scanner once
- `npm run build` - Production build
