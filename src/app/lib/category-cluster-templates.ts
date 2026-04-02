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

export interface CategoryTemplate {
  id: string;
  width: number;
  height: number;
  slots: CategoryTemplateSlot[];
  connectors: CategoryTemplateConnector[];
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
  fillOrder: ["top", "left", "right"],
};

// Template "5" — diamond spine (4-6 skills)
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
    { id: "right2", x: 151, y: 243 },
  ],
  connectors: [
    { id: "top-left1", fromSlot: "top", toSlot: "left1" },
    { id: "top-right1", fromSlot: "top", toSlot: "right1" },
    { id: "left1-mid", fromSlot: "left1", toSlot: "mid" },
    { id: "right1-mid", fromSlot: "right1", toSlot: "mid" },
    { id: "mid-left2", fromSlot: "mid", toSlot: "left2" },
    { id: "mid-right2", fromSlot: "mid", toSlot: "right2" },
  ],
  fillOrder: ["top", "left1", "right1", "mid", "left2", "right2"],
};

export const categoryTemplates: Record<string, CategoryTemplate> = {
  "2": template2,
  "3": template3,
  "5": template5,
};

export function getCategoryTemplate(skillCount: number): CategoryTemplate {
  if (skillCount <= 2) return template2;
  if (skillCount <= 3) return template3;
  return template5;
}
