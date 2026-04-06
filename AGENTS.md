# Skill Tree CLI - Agent Guide

## Project Overview
Visual skill tree viewer for Claude Code. Scans installed skills on the machine and displays them in a game-inspired dark interface with premium handcrafted aesthetic.

**Run:** `npx skilltree-cli` or `npm run dev:real`

## Tech Stack
- **React 18** + **TypeScript**
- **Vite 6** (build tool)
- **Tailwind CSS 4** (styling)
- **Radix UI** (accessible primitives)
- **Motion** (animations)
- **use-sound** (audio effects)
- **Figma MCP** (design sync)

## Project Structure
```
src/
├── app/
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks (use-sound-effects)
│   ├── lib/              # Business logic (skill-data, skill-tree, category-cluster-templates)
│   └── types/            # TypeScript definitions
├── assets/               # Custom SVG/PNG assets (brush-stroke style, NOT Lucide)
├── styles/                # CSS (fonts, theme, tailwind)
public/
├── skill-icons/           # Scanned icons
skills.json               # Generated skill data
generate.js               # Skill scanner script
```

## Key Components
- `skill-node.tsx` - Hexagonal skill nodes with states (default/hover/selected/conflict)
- `detail-drawer.tsx` - Right-side drawer panel
- `detail-drawer-primitives.tsx` - Drawer UI primitives (close button, copy icon, category pill, etc.)
- `category-cluster.tsx` - Skill cluster rendering with orientations
- `category-rail.tsx` - Horizontal category navigation with overflow arrows
- `top-bar.tsx` - App header with stats

## Design Aesthetic
**IMPORTANT:** This project uses custom handcrafted assets with brush-stroke textures - NOT generic icon libraries. All icons, buttons, and decorative elements are custom SVGs exported from Figma.

**Font:** Albertus Nova (serif, premium feel)
**Theme:** Dark interface with warm cream drawer (`rgb(255,247,227)`), gold/brown accents

## Button Icon Colors
| Button | Default | Hover | Copied |
|--------|---------|-------|--------|
| Close | #635949 | #282521 | N/A |
| Copy | #7E766D | #282521 | #494542 |

## Figma Connection
- **File:** Claude Skillset (`gOD8BR4rpEoefKlmyu7um9`)
- **MCP Tools:** Use `figma_navigate`, `figma_capture_screenshot`, `figma_execute`, etc.
- **IMPORTANT:** Use Figma to export actual SVG assets, do not create placeholder SVGs

## Do Not Touch
- `src/imports/` - Figma reference files (read-only)
- `src/styles/theme.css` - Base design tokens
- `node_modules/`, `dist/` - Build artifacts
- `claude-skills-icons/` - Icon library (do not modify)

## Task Execution Rules
1. Run in **Plan mode first**
2. Prefer editing existing files over creating new ones
3. Run `npm run build` to verify changes compile
4. Update Progress.md after major changes
5. For visual work: export assets from Figma, do not create SVGs from scratch

## MCP Tools Available
- `figma_navigate` - Open Figma files
- `figma_capture_screenshot` - Visual validation
- `figma_execute` - Run Figma plugin code
- `figma_get_component` - Get component specs
- Use for visual reference and asset export, not routine code edits

## Important Notes
- Images cannot be processed by this AI model - describe visual issues in text
- Custom brush-stroke assets are exported from Figma, not generated inline
- Use Progress.md for handoff documentation
