# Skill Tree CLI - Handoff

## Current State
- Full skill tree UI with hexagonal nodes, category clusters, detail drawer
- Real scanner integration with `generate.js` → `public/skills.json`
- Custom brush-stroke SVG assets exported from Figma (NOT Lucide icons)
- Sound effects for UI interactions (drawer open/close)
- Typography: Albertus Nova font family
- npx CLI packaging working (`skilltree-cli`)
- **NEW: Splash screen** — 3-second loading animation before main app (smooth fade-out, no blank flashes)

## Last Completed
- `3e71b4a` - Add npx CLI packaging for skilltree-cli
- **Splash Screen Feature** (2026-04-06) - 3-second loading screen with smooth app transition
  - Created `src/app/components/splash-screen.tsx` — full-featured splash with animated logo, title, pulsing dots, tagline
  - Modified `src/app/App.tsx` — 3-phase splash timing (content visible → content fading while app fades in → splash unmounts)
  - Exported `src/assets/splash-logo.png` from Figma (93×140px at 3x scale, 55KB)
  - Set dark body background in `index.html` for seamless transitions
  - Background (gradient + image) persists throughout fade sequence, only content fades

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
  - "content" (0–2.7s): Splash bg + content visible, app opacity 0
  - "fading" (2.7–3.5s): Content fades, app fades in simultaneously underneath splash bg
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
- Background: Linear gradient `#0a0500` → `#0e0900` + `claude-skill-tree-bg.png` (atmospheric arc/glow)
- Logo: Vectorized circuit tree, 93×140px PNG
- Title: Albertus Nova Light, 24px, letter-spacing 0.35em, gold gradient (rgb(194,137,21) → rgb(136,73,0))
- Loading dots: 3 ellipses, white→amber gradient, staggered pulse (1.4s cycle, 0.2s offsets)
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
