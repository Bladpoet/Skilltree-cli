# Claude Skills — Figma Make Build Plan V2.4

Use this file as the step-by-step build order for Figma Make.
Do not generate the whole app in one step.
Follow the prompts in order.

---

## Global instructions for Figma Make
- Use the attached PRD, technical PRD, context file, progress file, and mock data as context.
- Follow the existing Figma frames closely for visual fidelity.
- Build this project in ordered chunks.
- Use reusable components.
- Use `mock-skills.json` during build.
- Do not use empty ghost nodes in the live UI.
- Connectors are decorative only.
- Use edge arrows for category overflow, not a visible bottom scrollbar.
- Do not guess icons loosely. Use a defined mapping or provided icons.
- After every major generation or refinement step, update `Progress.md` using the exact required structure.
- Keep progress entries concise and factual so Cursor or another AI can continue later.

---

## Prompt 0 — Setup instruction
Use the attached PRD, technical PRD, context log, build plan, progress file, and mock data as project context. Follow the existing Figma frames closely. Build this project in the exact order defined in the build plan. Use reusable components. Use mock data for now. Do not build everything at once. After each major step, update `Progress.md` using the required structure.

---

## Prompt 1 — App shell
Build the base app shell for a dark, premium, game-inspired Claude Skills interface. Follow the existing Figma frame closely. Include the page background, the top-left title area, the top-right stat badge area, the central horizontal region where category clusters will live, and the reserved right-side drawer area. Keep the structure component based and maintainable.

---

## Prompt 2 — Top bar and stat badges
Create reusable top bar elements for the title and the stat badges. Match the tone and spacing of the Figma frame. The stat badges should support values like total categories, conflicts, and similar skills.

---

## Prompt 3 — Hexagonal skill node
Create a reusable hexagonal skill node component for individual skills. It should support these states: default, hover, selected, and conflict. Include an icon area and a label area. The icon should come from either a provided custom icon set or a mapped icon from `lucide-react`, with a fallback icon if no match exists. Do not loosely invent icons.

---

## Prompt 4 — One category cluster template
Create one reusable category cluster component using a predefined layout template. It should place skill nodes in fixed positions and render decorative connector fragments behind them. Hide unused slots completely instead of showing ghost nodes. Use realistic mock skill names from `mock-skills.json`.

---

## Prompt 5 — Category header
Create the category header as its own reusable component. It should sit above each category cluster and match the current Figma direction.

---

## Prompt 6 — Detail drawer
Create the right-side detail drawer. It should contain:
- category tag
- skill name
- path
- description
- triggers list as chips
- source link
- conflict section

In the conflict section:
- do not show severity
- do not show overlapping keywords
- show a short conflict summary
- show conflicting skills as clickable items

Match the Figma frame closely.

---

## Prompt 7 — Node interaction
Add interactions so clicking a skill node opens the detail drawer and marks that node as selected. Clicking a conflicting skill inside the drawer should switch selection to that skill.

---

## Prompt 8 — Additional category orientations
Add support for 3 predefined category orientations for category clusters. Rotate them across categories in this pattern: 1, 2, 3, 1, 2... Only render the number of nodes needed for each category.

---

## Prompt 9 — Overflow arrows and rail behavior
Add overflow handling for many categories using left/right edge arrow controls as the primary navigation. Treat the category area as a horizontal rail. Do not use a visible bottom scrollbar as part of the intended UI. Hide or disable arrows at the ends.

---

## Prompt 10 — Polish and cleanup
Polish blur, transitions, spacing, typography, and visual hierarchy while keeping the output readable and maintainable. Keep the component structure understandable enough that the project can later continue in Cursor.
