# Claude Skills — Technical PRD V2.4

## Technical overview
Claude Skills consists of two layers:
1. a local Node scanner that writes `public/skills.json`
2. a React front end that renders a template-driven skill tree UI

V1 should remain fully usable without AI.

---

## Data flow

```bash
node generate.js -> public/skills.json -> React app reads data -> renders skill tree
```

During UI build, mock data can stand in for scanner output.

```bash
mock-skills.json -> React app reads mock data -> renders skill tree
```

The front end should treat scanned skill data as source of truth when the scanner is active.

---

## Front-end architecture direction
The current UI should be built as a component system.
The build may start in Figma Make, but the output should remain understandable enough to continue in Cursor later.

Recommended top-level structure:
- `AppShell`
- `TopBar`
- `StatsRow`
- `CategoryRail`
- `CategoryCluster`
- `SkillNode`
- `SkillDrawer`
- `OverflowArrow`

---

## Category cluster rendering model
Each category should be rendered from a predefined template.

Each template should define:
- width
- height
- slot positions
- connector fragments
- fill order

Example shape:

```ts
type Slot = {
  id: string
  x: number
  y: number
}

type ConnectorFragment = {
  id: string
  from: [number, number]
  to: [number, number]
  visibleWhenSlots: string[]
}

type CategoryTemplate = {
  id: string
  width: number
  height: number
  slots: Slot[]
  connectors: ConnectorFragment[]
  fillOrder: string[]
}
```

Rendering behavior:
- choose orientation by category index rotation
- assign discovered skills into template slots using fill order
- render only the number of slots needed
- render only connector fragments tied to visible slots

Connectors remain decorative.

---

## Node rendering model
Each skill node is a reusable component.

Supported states:
- default
- hover
- selected
- conflict

The selected state should be driven by app state.
The conflict state should come from skill data.

Suggested props:

```ts
type SkillNodeProps = {
  id: string
  label: string
  icon?: string
  state: 'default' | 'hover' | 'selected' | 'conflict'
  onClick?: () => void
}
```

---

## Icon handling
Preferred library: `lucide-react`.

Icon source priority:
1. custom uploaded icon asset
2. mapped icon from `lucide-react`
3. default fallback icon

Suggested approach:
- define a skill-to-icon mapping object
- allow override by provided custom icon asset
- avoid free-form auto-chosen icons during build

Example:

```ts
const iconMap = {
  'api-logs': 'FileSearch',
  'debug-assistant': 'Bug',
  'react-ui-builder': 'PanelsTopLeft',
}
```

---

## Drawer data model
The drawer should render:
- category tag
- skill name
- path
- description
- triggers list
- source link
- conflict items

Conflict item structure:

```ts
type ConflictItem = {
  skillId: string
  skillName: string
  summary: string
}
```

Do not include:
- conflict severity
- overlapping keyword lists

Clicking a conflicting skill item should select that skill and refresh the drawer.

---

## Overflow behavior
When categories exceed the visible rail width:
- show left/right edge arrow controls
- treat the category area as a horizontal rail
- do not rely on a visible bottom scrollbar as the intended UI
- secondary natural scrolling may still work

Suggested implementation:
- track current rail offset or active page position
- disable or hide arrows at bounds
- keep category movement predictable

---

## Mock data strategy
Use a separate mock file during build:
- `mock-skills.json` for UI testing
- `public/skills.json` for real scanner output

Suggested switch:

```ts
const useMockData = true
const dataPath = useMockData ? '/mock-skills.json' : '/skills.json'
```

This keeps mock and real flows separate and avoids conflicts.

---

## Figma Make build strategy
The build should happen in ordered chunks.
Do not generate the whole app in one prompt.

Recommended order:
1. app shell
2. top bar and stat badges
3. skill node component
4. one category cluster template
5. category header
6. drawer
7. interactions
8. other category templates
9. overflow arrows and rail behavior
10. polish

The output should preserve enough structure to later continue in Cursor.

---

## Progress logging requirement
A living `Progress.md` file should be maintained during build.

Figma Make should update it after every major generation or refinement step.
The goal is clean handoff to Cursor or another AI.

Required entry structure:

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

Rules:
- keep entries concise
- be factual, not promotional
- name actual components when possible
- note any visual drift from the Figma frame
- note any shortcuts or temporary logic
