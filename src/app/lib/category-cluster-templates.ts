export type ClusterOrientation = 1 | 2 | 3;

export interface CategoryTemplateSlot {
  id: string;
  x: number;
  y: number;
}

export interface CategoryTemplateConnector {
  id: string;
  fromSlot: string;
  toSlot: string;
  visibleWhenSlots: string[];
}

export interface CategoryTemplate {
  id: string;
  width: number;
  height: number;
  slots: CategoryTemplateSlot[];
  connectors: CategoryTemplateConnector[];
  fillOrder: string[];
}

const orientationOneSlots: CategoryTemplateSlot[] = [
  { id: "top-center", x: 98, y: 0 },
  { id: "upper-left", x: 0, y: 88 },
  { id: "upper-right", x: 196, y: 88 },
  { id: "middle-center", x: 98, y: 163 },
  { id: "lower-left", x: 0, y: 251 },
  { id: "lower-right", x: 196, y: 251 },
  { id: "bottom-center", x: 98, y: 326 },
];

const orientationOneConnectors: CategoryTemplateConnector[] = [
  {
    id: "top-left-branch",
    fromSlot: "top-center",
    toSlot: "upper-left",
    visibleWhenSlots: ["top-center", "upper-left"],
  },
  {
    id: "top-right-branch",
    fromSlot: "top-center",
    toSlot: "upper-right",
    visibleWhenSlots: ["top-center", "upper-right"],
  },
  {
    id: "left-to-middle",
    fromSlot: "upper-left",
    toSlot: "middle-center",
    visibleWhenSlots: ["upper-left", "middle-center"],
  },
  {
    id: "right-to-middle",
    fromSlot: "upper-right",
    toSlot: "middle-center",
    visibleWhenSlots: ["upper-right", "middle-center"],
  },
  {
    id: "middle-to-lower-left",
    fromSlot: "middle-center",
    toSlot: "lower-left",
    visibleWhenSlots: ["middle-center", "lower-left"],
  },
  {
    id: "middle-to-lower-right",
    fromSlot: "middle-center",
    toSlot: "lower-right",
    visibleWhenSlots: ["middle-center", "lower-right"],
  },
  {
    id: "lower-left-to-bottom",
    fromSlot: "lower-left",
    toSlot: "bottom-center",
    visibleWhenSlots: ["lower-left", "bottom-center"],
  },
  {
    id: "lower-right-to-bottom",
    fromSlot: "lower-right",
    toSlot: "bottom-center",
    visibleWhenSlots: ["lower-right", "bottom-center"],
  },
];

export const categoryTemplates: Record<number, CategoryTemplate> = {
  1: {
    id: "orientation-1",
    width: 290,
    height: 436,
    slots: orientationOneSlots,
    connectors: orientationOneConnectors,
    fillOrder: [
      "top-center",
      "upper-left",
      "upper-right",
      "middle-center",
      "lower-left",
      "lower-right",
      "bottom-center",
    ],
  },
};

export function getCategoryTemplate(orientation: ClusterOrientation): CategoryTemplate {
  return categoryTemplates[orientation] ?? categoryTemplates[1];
}
