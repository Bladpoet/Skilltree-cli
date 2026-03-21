/**
 * Desktop16.tsx — Figma reference frame (refactored).
 * Original: ~4158 lines. Now uses shared components.
 * This file is NOT imported in the live app — it serves as a visual reference.
 */
import svgPaths from "./svg-tfxbcoju7v";
import { StatBadge } from "../app/components/stat-badge";
import { FigmaCategoryTab } from "../app/components/figma-category-tab";
import { FigmaHexNode } from "../app/components/figma-hex-frame";
import { FigmaArrow } from "../app/components/figma-arrow";
import { FigmaTreeConnector } from "../app/components/figma-connector";
import React from "react";

/* ──────────────────────────── Top Bar ──────────────────────────── */

function TopBar() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex items-center justify-between px-[48px] py-[40px] w-full">
        <p
          className="shrink-0 text-[#b79962] text-[40px] whitespace-nowrap"
          style={{ fontFamily: "'Marcellus', serif" }}
        >
          Claude Skills
        </p>
        <div className="flex gap-[18.189px] items-center shrink-0">
          <StatBadge value={16} label="Categories" />
          <StatBadge value={4} label="Conflicting" />
          <StatBadge value={6} label="Similar" />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── Divider Line ──────────────────────── */

function Divider() {
  return (
    <div className="h-0 relative shrink-0 w-[1357px]">
      <div className="absolute inset-[-0.97px_0_0.09px_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1357 0.882552">
          <path d={svgPaths.p39c4f300} fill="#837F76" />
        </svg>
      </div>
    </div>
  );
}

/* ──────────────── Tree Cluster (Orientation 1) ──────────────── */
/**
 * Tree cluster: 1 top node → 2 children below, connected by a V-line.
 * Used by the first 4 tabbed categories.
 */
function TreeCluster({ topLabel, childLabel1, childLabel2 }: {
  topLabel: string;
  childLabel1: string;
  childLabel2: string;
}) {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      {/* Row: top node + children group + connector */}
      <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1">
        {/* Top node (centered) */}
        <div className="col-1 ml-[98px] mt-0 relative row-1">
          <FigmaHexNode label={topLabel} />
        </div>
        {/* Children group */}
        <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-[87.59px] place-items-start relative row-1">
          {/* Right child (offset) */}
          <div className="col-1 ml-[196px] mt-0 relative row-1">
            <FigmaHexNode label={childLabel1} />
          </div>
          {/* Left child */}
          <div className="col-1 ml-0 mt-0 relative row-1">
            <FigmaHexNode label={childLabel2} />
          </div>
        </div>
        {/* V-connector */}
        <div className="col-1 ml-[86px] mt-[81.59px] relative row-1">
          <FigmaTreeConnector />
        </div>
      </div>
    </div>
  );
}

/* ──────── Diamond Cluster (Orientation 2) ─────── */
/**
 * Diamond cluster: 8 nodes in a diamond/grid pattern with diagonal connectors.
 * Uses absolute-positioned grid offsets from the Figma frame.
 */
interface DiamondNode {
  label: string;
  ml: string;
  mt: string;
}

const DIAMOND_NODES: DiamondNode[] = [
  { label: "Frontend skill", ml: "227.21px", mt: "0" },
  { label: "Frontend skill", ml: "227.21px", mt: "179.15px" },
  { label: "Frontend skill", ml: "114.33px", mt: "107.05px" },
  { label: "Frontend skill", ml: "114.33px", mt: "244.69px" },
  { label: "Frontend skill", ml: "46.61px", mt: "0" },
  { label: "Frontend skill", ml: "46.61px", mt: "351.74px" },
  { label: "Frontend skill", ml: "0", mt: "185.7px" },
];

interface DiamondConnector {
  rotation: number;
  ml: string;
  mt: string;
  flip?: boolean;
}

const DIAMOND_CONNECTORS: DiamondConnector[] = [
  { rotation: 135, ml: "91.03px", mt: "185.7px" },
  { rotation: 45, ml: "134px", mt: "77.92px", flip: true },
  { rotation: 45, ml: "203.91px", mt: "328.44px", flip: true },
  { rotation: 135, ml: "157.3px", mt: "77.92px" },
  { rotation: 135, ml: "93.94px", mt: "326.98px" },
  { rotation: 45, ml: "203.91px", mt: "188.61px", flip: true },
];

function DiamondCluster() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative row-1">
      {/* Nodes */}
      {DIAMOND_NODES.map((node, i) => (
        <div key={`node-${i}`} className="col-1 relative row-1" style={{ marginLeft: node.ml, marginTop: node.mt }}>
          <FigmaHexNode label={node.label} />
        </div>
      ))}
      {/* Diagonal connectors */}
      {DIAMOND_CONNECTORS.map((conn, i) => (
        <div
          key={`conn-${i}`}
          className="col-1 flex items-center justify-center relative row-1 size-[23.304px]"
          style={{ marginLeft: conn.ml, marginTop: conn.mt }}
        >
          <div className={`flex-none ${conn.flip ? "-scale-y-100" : ""}`} style={{ transform: `rotate(${conn.rotation}deg)` }}>
            <div className="h-0 relative w-[32.956px]">
              <div className="absolute inset-[-0.73px_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32.9565 0.728243">
                  <path d={svgPaths.p11f3ac00} fill="white" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Vertical connector */}
      <div className="col-1 flex h-[23.304px] items-center justify-center relative row-1 w-0" style={{ marginLeft: "157.3px", marginTop: "221.39px" }}>
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[23.304px]">
            <div className="absolute inset-[-0.73px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.3038 0.728243">
                <path d={svgPaths.p892ee00} fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────── Tabbed Category Section ──────────────── */

function TabbedCategory({ name, topLabel, childLabel1, childLabel2 }: {
  name: string;
  topLabel: string;
  childLabel1: string;
  childLabel2: string;
}) {
  return (
    <div className="flex flex-col gap-[32px] items-center relative shrink-0 w-[289.943px]">
      <FigmaCategoryTab name={name} />
      <TreeCluster topLabel={topLabel} childLabel1={childLabel1} childLabel2={childLabel2} />
    </div>
  );
}

/* ──────── Text-header Category Section (diamond) ──────── */

function TextCategory({ name, width = 321.155, gap = 33.499 }: {
  name: string;
  width?: number;
  gap?: number;
}) {
  return (
    <div className="flex flex-col items-center relative shrink-0" style={{ width, gap }}>
      <p
        className="min-w-full shrink-0 text-[11.652px] text-center text-white w-[min-content]"
        style={{ fontFamily: "'Geist', sans-serif", fontWeight: 500 }}
      >
        {name}
      </p>
      <DiamondCluster />
    </div>
  );
}

/* ──────────────── Category Rail ──────────────── */

function CategoryRail() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex gap-[96px] items-start px-[48px] py-[32px] relative w-full">
        {/* Tabbed categories (tree clusters) */}
        <TabbedCategory name="Design" topLabel="Frontend skill" childLabel1="supabase-postgres-best-practices" childLabel2="Frontend skill" />
        <TabbedCategory name="Finance" topLabel="Frontend skill" childLabel1="supabase-postgres-best-practices" childLabel2="Frontend skill" />
        <TabbedCategory name="Development" topLabel="Frontend skill" childLabel1="supabase-postgres-best-practices" childLabel2="Frontend skill" />
        <TabbedCategory name="Marketing" topLabel="Frontend skill" childLabel1="supabase-postgres-best-practices" childLabel2="Frontend skill" />

        {/* Text-header categories (diamond clusters) */}
        <TextCategory name="Marketing" width={321.155} gap={33.499} />
        <TextCategory name="Development" width={346.643} gap={33.499} />
        <TextCategory name="Design" width={321.155} gap={36.412} />

        {/* Right fade gradient */}
        <div className="absolute bg-gradient-to-l from-[#0e1118] from-[10.098%] h-[844px] right-0 to-[rgba(14,17,24,0)] top-[-24.08px] via-[62.503%] via-[rgba(14,17,24,0.8)] w-[265px]" />
        <FigmaArrow />
      </div>
    </div>
  );
}

/* ──────────────── Root Component ──────────────── */

export default function Desktop() {
  return (
    <div className="bg-gradient-to-b from-[#151821] relative size-full to-[#05080d]" data-name="Desktop - 16">
      <div className="absolute flex flex-col gap-[24px] items-center left-0 top-0 w-[1440px]">
        <TopBar />
        <Divider />
        <CategoryRail />
      </div>
    </div>
  );
}
