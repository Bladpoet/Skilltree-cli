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
  x: number;       // left edge, absolute from container origin
  y: number;       // top edge, absolute from container origin
  length: number;  // width (horizontal) or height (vertical) in px
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

// All slot positions and line positions extracted directly from Figma via Desktop Bridge.
// Coordinates are absolute from the node container origin (Frame 1907/1910).
// Node size: 97×87px.

// Template "1" — single node, no connectors
const template1: CategoryTemplate = {
  id: "1",
  width: 240,
  height: 87,
  slots: [{ id: "top", x: 71, y: 0 }],
  connectors: [],
  lines: [],
  fillOrder: ["top"],
};

// Template "2" — vertical pair
const template2: CategoryTemplate = {
  id: "2",
  width: 240,
  height: 250,
  slots: [
    { id: "top", x: 71, y: 0 },
    { id: "bot", x: 71, y: 163 },
  ],
  connectors: [],
  lines: [
    { id: "v1", x: 120, y: 84, length: 78, orientation: "vertical" },
  ],
  fillOrder: ["top", "bot"],
};

// Template "3" — triangle (1 top, 2 below)
const template3: CategoryTemplate = {
  id: "3",
  width: 240,
  height: 170,
  slots: [
    { id: "top", x: 68, y: 0 },
    { id: "left", x: 0, y: 83 },
    { id: "right", x: 141, y: 83 },
  ],
  connectors: [],
  lines: [
    { id: "v1", x: 117, y: 84, length: 42, orientation: "vertical" },
    { id: "h1", x: 89, y: 126, length: 60, orientation: "horizontal" },
  ],
  fillOrder: ["top", "left", "right"],
};

// Template "4" — T-shape (1 top, 2 middle, 1 bottom center)
const template4: CategoryTemplate = {
  id: "4",
  width: 240,
  height: 250,
  slots: [
    { id: "top",   x: 68,  y: 0   },
    { id: "left",  x: 0,   y: 83  },
    { id: "right", x: 141, y: 83  },
    { id: "bot",   x: 68,  y: 163 },
  ],
  connectors: [],
  lines: [
    { id: "v1", x: 117, y: 84,  length: 78, orientation: "vertical"   },
    { id: "h1", x: 88,  y: 126, length: 60, orientation: "horizontal" },
  ],
  fillOrder: ["top", "left", "right", "bot"],
};

// Template "5" — vertical spine (3) + 1 horizontal pair
const template5: CategoryTemplate = {
  id: "5",
  width: 240,
  height: 411,
  slots: [
    { id: "spine1", x: 71,  y: 0   },
    { id: "left1",  x: 8,   y: 81  },
    { id: "right1", x: 149, y: 81  },
    { id: "spine2", x: 71,  y: 162 },
    { id: "spine3", x: 71,  y: 324 },
  ],
  connectors: [],
  lines: [
    { id: "v1", x: 120, y: 87,  length: 75, orientation: "vertical"   },
    { id: "v2", x: 120, y: 249, length: 75, orientation: "vertical"   },
    { id: "h1", x: 97,  y: 124, length: 60, orientation: "horizontal" },
  ],
  fillOrder: ["spine1", "left1", "right1", "spine2", "spine3"],
};

// Template "6" — vertical spine (2) + 2 horizontal pairs
const template6: CategoryTemplate = {
  id: "6",
  width: 240,
  height: 329,
  slots: [
    { id: "spine1", x: 71,  y: 0   },
    { id: "left1",  x: 7,   y: 81  },
    { id: "right1", x: 148, y: 81  },
    { id: "spine2", x: 71,  y: 162 },
    { id: "left2",  x: 3,   y: 242 },
    { id: "right2", x: 144, y: 242 },
  ],
  connectors: [],
  lines: [
    { id: "v1", x: 120, y: 87,  length: 75, orientation: "vertical"   },
    { id: "v2", x: 120, y: 249, length: 36, orientation: "vertical"   },
    { id: "h1", x: 96,  y: 124, length: 60, orientation: "horizontal" },
    { id: "h2", x: 92,  y: 285, length: 60, orientation: "horizontal" },
  ],
  fillOrder: ["spine1", "left1", "right1", "spine2", "left2", "right2"],
};

// Template "7" — vertical spine (3) + 2 horizontal pairs
const template7: CategoryTemplate = {
  id: "7",
  width: 240,
  height: 411,
  slots: [
    { id: "spine1", x: 71,  y: 0   },
    { id: "left1",  x: 7,   y: 81  },
    { id: "right1", x: 148, y: 81  },
    { id: "spine2", x: 71,  y: 162 },
    { id: "left2",  x: 3,   y: 242 },
    { id: "right2", x: 144, y: 242 },
    { id: "spine3", x: 71,  y: 324 },
  ],
  connectors: [],
  lines: [
    { id: "v1", x: 120, y: 87,  length: 75, orientation: "vertical"   },
    { id: "v2", x: 120, y: 249, length: 75, orientation: "vertical"   },
    { id: "h1", x: 96,  y: 124, length: 60, orientation: "horizontal" },
    { id: "h2", x: 92,  y: 285, length: 60, orientation: "horizontal" },
  ],
  fillOrder: ["spine1", "left1", "right1", "spine2", "left2", "right2", "spine3"],
};

export const categoryTemplates: Record<string, CategoryTemplate> = {
  "1": template1,
  "2": template2,
  "3": template3,
  "4": template4,
  "5": template5,
  "6": template6,
  "7": template7,
};

export function getCategoryTemplate(skillCount: number): CategoryTemplate {
  if (skillCount <= 1) return template1;
  if (skillCount === 2) return template2;
  if (skillCount === 3) return template3;
  if (skillCount === 4) return template4;
  if (skillCount === 5) return template5;
  if (skillCount === 6) return template6;
  return template7;
}
