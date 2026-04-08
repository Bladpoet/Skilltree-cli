export interface CategoryTemplateSlot {
  id: string;
  x: number;
  y: number;
}

export interface CategoryTemplateConnector {
  id: string;
  fromSlot: string;
  toSlot: string;
}

export interface TemplateLine {
  id: string;
  x: number;
  y: number;
  length: number;
  orientation: "horizontal" | "vertical";
}

export interface CategoryTemplate {
  id: string;
  width: number;
  height: number;
  slots: CategoryTemplateSlot[];
  connectors: CategoryTemplateConnector[];
  lines: TemplateLine[];
  fillOrder: string[];
}

// Template "2" — vertical pair (2 skills)
const template2: CategoryTemplate = {
  id: "2",
  width: 240,
  height: 308,
  slots: [
    { id: "top", x: 76, y: 0 },
    { id: "bot", x: 76, y: 163 },
  ],
  connectors: [{ id: "top-bot", fromSlot: "top", toSlot: "bot" }],
  lines: [{ id: "v1", x: 120, y: 84, length: 78, orientation: "vertical" }],
  fillOrder: ["top", "bot"],
};

// Template "3" — triangle (3 skills)
const template3: CategoryTemplate = {
  id: "3",
  width: 240,
  height: 308,
  slots: [
    { id: "top", x: 76, y: 0 },
    { id: "left", x: 0, y: 111 },
    { id: "right", x: 151, y: 111 },
  ],
  connectors: [
    { id: "top-left", fromSlot: "top", toSlot: "left" },
    { id: "top-right", fromSlot: "top", toSlot: "right" },
  ],
  lines: [
    { id: "v1", x: 117, y: 84, length: 42, orientation: "vertical" },
    { id: "h1", x: 89, y: 43, length: 60, orientation: "horizontal" },
    { id: "h2", x: 87, y: 126, length: 31, orientation: "horizontal" },
  ],
  fillOrder: ["top", "left", "right"],
};

// Template "4" — single vertical stem with one branch (4 skills)
const template4: CategoryTemplate = {
  id: "4",
  width: 240,
  height: 308,
  slots: [
    { id: "top", x: 76, y: 0 },
    { id: "left1", x: 0, y: 81 },
    { id: "right1", x: 151, y: 81 },
    { id: "mid", x: 76, y: 162 },
  ],
  connectors: [],
  lines: [
    { id: "v1", x: 117, y: 84, length: 78, orientation: "vertical" },
    { id: "h1", x: 88, y: 126, length: 60, orientation: "horizontal" },
  ],
  fillOrder: ["top", "left1", "right1", "mid"],
};

// Template "5" — diamond spine (5 skills)
const template5: CategoryTemplate = {
  id: "5",
  width: 240,
  height: 524,
  slots: [
    { id: "top", x: 76, y: 0 },
    { id: "left1", x: 0, y: 81 },
    { id: "right1", x: 151, y: 81 },
    { id: "mid", x: 76, y: 162 },
    { id: "left2", x: 0, y: 243 },
  ],
  connectors: [],
  lines: [
    { id: "v1", x: 49, y: 87, length: 75, orientation: "vertical" },
    { id: "v2", x: 49, y: 249, length: 75, orientation: "vertical" },
    { id: "h1", x: 89, y: 43, length: 60, orientation: "horizontal" },
  ],
  fillOrder: ["top", "left1", "right1", "mid", "left2"],
};

// Template "6" — diamond spine with right leaf (6 skills)
const template6: CategoryTemplate = {
  id: "6",
  width: 240,
  height: 524,
  slots: [
    { id: "top", x: 76, y: 0 },
    { id: "left1", x: 0, y: 81 },
    { id: "right1", x: 151, y: 81 },
    { id: "mid", x: 76, y: 162 },
    { id: "left2", x: 0, y: 243 },
    { id: "right2", x: 151, y: 243 },
  ],
  connectors: [],
  lines: [
    { id: "v1", x: 49, y: 87, length: 75, orientation: "vertical" },
    { id: "v2", x: 49, y: 249, length: 36, orientation: "vertical" },
    { id: "h1", x: 89, y: 43, length: 60, orientation: "horizontal" },
  ],
  fillOrder: ["top", "left1", "right1", "mid", "left2", "right2"],
};

// Template "7" — full diamond spine (7 skills)
const template7: CategoryTemplate = {
  id: "7",
  width: 240,
  height: 524,
  slots: [
    { id: "top", x: 76, y: 0 },
    { id: "left1", x: 0, y: 81 },
    { id: "right1", x: 151, y: 81 },
    { id: "mid", x: 76, y: 162 },
    { id: "left2", x: 0, y: 243 },
    { id: "right2", x: 151, y: 243 },
  ],
  connectors: [],
  lines: [
    { id: "v1", x: 49, y: 87, length: 75, orientation: "vertical" },
    { id: "v2", x: 49, y: 249, length: 75, orientation: "vertical" },
    { id: "h1", x: 89, y: 43, length: 60, orientation: "horizontal" },
  ],
  fillOrder: ["top", "left1", "right1", "mid", "left2", "right2"],
};

export const categoryTemplates: Record<string, CategoryTemplate> = {
  "2": template2,
  "3": template3,
  "4": template4,
  "5": template5,
  "6": template6,
  "7": template7,
};

export function getCategoryTemplate(skillCount: number): CategoryTemplate {
  if (skillCount === 1) return template2; // template2 can handle 1 node
  if (skillCount === 2) return template2;
  if (skillCount === 3) return template3;
  if (skillCount === 4) return template4;
  if (skillCount === 5) return template5;
  if (skillCount === 6) return template6;
  return template7;
}
