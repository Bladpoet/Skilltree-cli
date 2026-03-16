/**
 * ClaudeSkillTreeSideDrawer.tsx — Figma reference frame (refactored).
 * Original: ~4683 lines. Now uses shared components.
 * This file is NOT imported in the live app — it serves as a visual reference.
 * Shows the full skill tree view WITH the right-side detail drawer open.
 */
import svgPaths from "./svg-ftc0hkcrsa";
import imgButton from "figma:asset/cf33d1d7ce6cfc8f5b9efc28426760e1fe32583d.png";
import imgButton1 from "figma:asset/46fc92578eec7a57695a4458ffa776866bf926f3.png";
import imgButton2 from "figma:asset/15e0b986b2eb0bfb6e239fd61e160e3ec177e866.png";
import imgItem1 from "figma:asset/134baca7923b388c22b2e710106f8aebf7eef9ac.png";
import { imgImage, imgItem } from "./svg-dwdr2";
import { StatBadge } from "../app/components/stat-badge";
import { FigmaCategoryTab } from "../app/components/figma-category-tab";
import { FigmaHexNode, FigmaHexFrame, FigmaPaletteIcon } from "../app/components/figma-hex-frame";
import { FigmaArrow } from "../app/components/figma-arrow";
import { FigmaTreeConnector } from "../app/components/figma-connector";

/* ──────────────────────── Top Bar (shared) ──────────────────────── */

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

/* ──────────────────── Divider ──────────────────── */

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

/* ──────────────── Tree Cluster ──────────────── */

function TreeCluster({ topLabel, childLabel1, childLabel2 }: {
  topLabel: string;
  childLabel1: string;
  childLabel2: string;
}) {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1">
        <div className="col-1 ml-[98px] mt-0 relative row-1">
          <FigmaHexNode label={topLabel} />
        </div>
        <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-[87.59px] place-items-start relative row-1">
          <div className="col-1 ml-[196px] mt-0 relative row-1">
            <FigmaHexNode label={childLabel1} />
          </div>
          <div className="col-1 ml-0 mt-0 relative row-1">
            <FigmaHexNode label={childLabel2} />
          </div>
        </div>
        <div className="col-1 ml-[86px] mt-[81.59px] relative row-1">
          <FigmaTreeConnector />
        </div>
      </div>
    </div>
  );
}

/* ──────────── Diamond Cluster ──────────── */

const DIAMOND_NODES = [
  { ml: "227.21px", mt: "0" },
  { ml: "227.21px", mt: "179.15px" },
  { ml: "114.33px", mt: "107.05px" },
  { ml: "114.33px", mt: "244.69px" },
  { ml: "46.61px", mt: "0" },
  { ml: "46.61px", mt: "351.74px" },
  { ml: "0", mt: "185.7px" },
];

const DIAMOND_CONNECTORS = [
  { rotation: 135, ml: "91.03px", mt: "185.7px", flip: false },
  { rotation: 45, ml: "134px", mt: "77.92px", flip: true },
  { rotation: 45, ml: "203.91px", mt: "328.44px", flip: true },
  { rotation: 135, ml: "157.3px", mt: "77.92px", flip: false },
  { rotation: 135, ml: "93.94px", mt: "326.98px", flip: false },
  { rotation: 45, ml: "203.91px", mt: "188.61px", flip: true },
];

function DiamondCluster() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative row-1">
      {DIAMOND_NODES.map((n, i) => (
        <div key={`n${i}`} className="col-1 relative row-1" style={{ marginLeft: n.ml, marginTop: n.mt }}>
          <FigmaHexNode label="Frontend skill" />
        </div>
      ))}
      {DIAMOND_CONNECTORS.map((c, i) => (
        <div key={`c${i}`} className="col-1 flex items-center justify-center relative row-1 size-[23.304px]" style={{ marginLeft: c.ml, marginTop: c.mt }}>
          <div className={`flex-none ${c.flip ? "-scale-y-100" : ""}`} style={{ transform: `rotate(${c.rotation}deg)` }}>
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

/* ──────────── Category Sections ──────────── */

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

function TextCategory({ name, width = 321.155, gap = 33.499 }: {
  name: string;
  width?: number;
  gap?: number;
}) {
  return (
    <div className="flex flex-col items-center relative shrink-0" style={{ width, gap }}>
      <p className="min-w-full shrink-0 text-[11.652px] text-center text-white w-[min-content]"
        style={{ fontFamily: "'Geist', sans-serif", fontWeight: 500 }}>
        {name}
      </p>
      <DiamondCluster />
    </div>
  );
}

/* ──────────── Category Rail ──────────── */

function CategoryRail() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex gap-[96px] items-start px-[48px] py-[32px] relative w-full">
        <TabbedCategory name="Design" topLabel="Frontend skill" childLabel1="supabase-postgres-best-practices" childLabel2="Frontend skill" />
        <TabbedCategory name="Finance" topLabel="Frontend skill" childLabel1="supabase-postgres-best-practices" childLabel2="Frontend skill" />
        <TabbedCategory name="Development" topLabel="Frontend skill" childLabel1="supabase-postgres-best-practices" childLabel2="Frontend skill" />
        <TabbedCategory name="Marketing" topLabel="Frontend skill" childLabel1="supabase-postgres-best-practices" childLabel2="Frontend skill" />
        <TextCategory name="Marketing" width={321.155} gap={33.499} />
        <TextCategory name="Development" width={346.643} gap={33.499} />
        <TextCategory name="Design" width={321.155} gap={36.412} />
        <div className="absolute bg-gradient-to-l from-[#0e1118] from-[10.098%] h-[844px] right-0 to-[rgba(14,17,24,0)] top-[-24.08px] via-[62.503%] via-[rgba(14,17,24,0.8)] w-[265px]" />
        <FigmaArrow />
      </div>
    </div>
  );
}

/* ──────────────── Main View ──────────────── */

function MainView() {
  return (
    <div className="absolute flex flex-col gap-[24px] items-center left-0 top-0 w-[1440px]">
      <TopBar />
      <Divider />
      <CategoryRail />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DRAWER PANEL — unique content from the Figma side drawer
   ═══════════════════════════════════════════════════════════ */

/* ── Drawer button (category pill) ── */

function DrawerButton({ label, variant = "green" }: { label: string; variant?: "green" | "gray" }) {
  const gradientFrom = variant === "green" ? "#1d3923" : "#4c4c4c";
  const gradientTo = variant === "green" ? "#5f946a" : "#2d2d2d";
  const borderColor = variant === "green" ? "#5f946a" : "#232f25";

  return (
    <div className="flex items-center justify-center px-[20px] py-[8px] relative shrink-0 w-[69px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})` }} />
        <img alt="" className="absolute max-w-none object-cover opacity-70 size-full" src={imgButton} />
        <img alt="" className="absolute max-w-none mix-blend-multiply object-cover opacity-40 size-full" src={imgButton1} />
        <img alt="" className="absolute max-w-none mix-blend-overlay object-cover opacity-80 size-full" src={imgButton2} />
      </div>
      <div aria-hidden="true" className="absolute border border-solid inset-[-0.5px] pointer-events-none" style={{ borderColor }} />
      <p className="text-[12px] text-white whitespace-nowrap" style={{ fontFamily: "'Marcellus', serif", lineHeight: "8px" }}>{label}</p>
    </div>
  );
}

/* ── Close X icon ── */

function CloseIcon() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip_x)">
          <path d={svgPaths.p20d2e400} fill="white" />
          <path d={svgPaths.p3f77e4c0} fill="white" />
        </g>
        <defs>
          <clipPath id="clip_x">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

/* ── Breadcrumb path ── */

function Breadcrumb() {
  return (
    <div className="flex gap-[4px] items-center shrink-0 text-[#9aa2b1] text-[12px] w-full"
      style={{ fontFamily: "'Marcellus', serif", lineHeight: "16px" }}>
      {["Product", "/", "vally", "/", "..."].map((part, i) => (
        <p key={i} className="shrink-0">{part}</p>
      ))}
    </div>
  );
}

/* ── Skill title + description ── */

function SkillInfo() {
  return (
    <div className="flex flex-col gap-[16px] items-start shrink-0 w-full">
      <div className="flex flex-col items-start shrink-0 w-[295px] whitespace-nowrap">
        <p className="shrink-0 text-[32px] text-center text-white"
          style={{ fontFamily: "'Marcellus SC', serif" }}>Frontend skill</p>
        <Breadcrumb />
      </div>
      <div className="min-w-full shrink-0 text-[16px] text-white w-[min-content]"
        style={{ fontFamily: "'Marcellus', serif" }}>
        <p className="mb-0">Automatically translates natural language layout requests into production-ready Tailwind CSS</p>
        <p>classes. Excels at responsive design, complex grid layouts, and consistent spacing systems.</p>
      </div>
    </div>
  );
}

/* ── Trigger tag (slash command pill) ── */

function TriggerTag({ command, variant = "conflict" }: { command: string; variant?: "conflict" | "default" }) {
  const bgGradient = variant === "conflict"
    ? "linear-gradient(90deg, rgba(172,64,64,0) 0%, rgba(125,51,51,0.49) 100%)"
    : "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 100%)";

  return (
    <div className="flex gap-[5px] isolate items-center justify-center px-[8px] py-[4px] relative shrink-0 w-[83px]">
      <div className="flex items-center justify-center relative shrink-0 z-[2]">
        <p className="text-[14px] text-right text-white whitespace-nowrap"
          style={{ fontFamily: "'Marcellus', serif", textShadow: "0px 0px 2px rgba(0,0,0,0.8)" }}>
          {command}
        </p>
      </div>
      {/* Decorative background layers */}
      <div className="absolute contents inset-0 z-[1]">
        <div className="absolute flex inset-0 items-center justify-center">
          <div className="-scale-y-100 flex-none h-[26px] rotate-180 w-[83px]">
            <div className="bg-gradient-to-r from-[#1a1a1a] size-full to-[rgba(44,44,44,0)]"
              style={{ maskImage: `url('${imgImage}')`, WebkitMaskImage: `url('${imgImage}')` }} />
          </div>
        </div>
        <div className="absolute inset-0" style={{ background: bgGradient, maskImage: `url('${imgImage}')`, WebkitMaskImage: `url('${imgImage}')` }} />
        <div className="absolute contents inset-0">
          <div className="absolute inset-0" style={{ maskImage: `url('${imgImage}'), url('${imgItem}')`, WebkitMaskImage: `url('${imgImage}'), url('${imgItem}')` }}>
            <img alt="" className="absolute inset-0 max-w-none mix-blend-color-burn object-cover opacity-80 pointer-events-none size-full" src={imgItem1} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Triggers list ── */

function TriggersList() {
  return (
    <div className="flex flex-col gap-[8px] items-start shrink-0 w-full">
      <p className="shrink-0 text-[#b79962] text-[16px] w-full"
        style={{ fontFamily: "'Marcellus SC', serif" }}>Triggers list</p>
      <div className="flex gap-[16px] items-center overflow-clip shrink-0 w-full">
        <TriggerTag command="/search" variant="conflict" />
        <TriggerTag command="/find" variant="default" />
        <DrawerButton label="Finance" variant="gray" />
      </div>
    </div>
  );
}

/* ── Source link ── */

function SourceLink() {
  return (
    <div className="flex flex-col gap-[8px] h-[47px] items-start shrink-0 w-[61px]">
      <p className="shrink-0 text-[#b79962] text-[16px] w-full"
        style={{ fontFamily: "'Marcellus SC', serif" }}>Source</p>
      <div className="flex gap-[4px] items-center shrink-0 w-full">
        {/* Globe icon */}
        <div className="overflow-clip relative shrink-0 size-[16px]">
          <svg className="absolute block size-full" fill="none" viewBox="0 0 32 32" />
          <div className="absolute inset-[12.5%]">
            <div className="absolute inset-[-6.25%]">
              <svg className="block size-full" fill="none" viewBox="0 0 13.5 13.5">
                <path d={svgPaths.p32b567f0} stroke="#9AA2B1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[37.5%_15%_62.5%_15%]">
            <div className="absolute inset-[-0.75px_-6.7%]">
              <svg className="block size-full" fill="none" viewBox="0 0 12.7 1.5">
                <path d="M0.75 0.75H11.95" stroke="#9AA2B1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[62.5%_15%_37.5%_15%]">
            <div className="absolute inset-[-0.75px_-6.7%]">
              <svg className="block size-full" fill="none" viewBox="0 0 12.7 1.5">
                <path d="M0.75 0.75H11.95" stroke="#9AA2B1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[12.5%_52.08%_12.5%_37.18%]">
            <div className="absolute inset-[-6.25%_-43.65%_-6.25%_-43.64%]">
              <svg className="block size-full" fill="none" viewBox="0 0 3.21863 13.5002">
                <path d={svgPaths.p31e7ed00} stroke="#9AA2B1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[12.5%_37.18%_12.5%_52.08%]">
            <div className="absolute inset-[-6.25%_-43.64%_-6.25%_-43.65%]">
              <svg className="block size-full" fill="none" viewBox="0 0 3.21863 13.5002">
                <path d={svgPaths.p30eeb380} stroke="#9AA2B1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
        <a className="cursor-pointer text-[#2563eb] text-[12px] underline whitespace-nowrap"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: "16px" }}
          href="https://skills.sh/vercel-labs/skills/find-skills">
          Skill.sh
        </a>
      </div>
    </div>
  );
}

/* ── Conflict badge ── */

function ConflictBadge() {
  return (
    <div className="flex gap-[5px] isolate items-center justify-end pr-[40px] relative rounded-bl-[80px] rounded-tl-[80px] shrink-0"
      style={{ backgroundImage: "linear-gradient(90.195deg, rgba(129, 24, 0, 0.21) 26.033%, rgba(129, 24, 0, 0) 99.961%)" }}>
      {/* Conflict icon */}
      <div className="relative shrink-0 size-[24px] z-[2]">
        <svg className="absolute block size-full" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" fill="#FFCDCD" r="12" />
          <g clipPath="url(#clip_conflict)">
            <path d={svgPaths.p3e8a9200} fill="#811800" />
            <path d={svgPaths.p75e82f0} fill="#811800" opacity="0.4" />
            <path d={svgPaths.p31b22a00} fill="#811800" />
            <path d={svgPaths.p1b960f00} fill="black" />
            <path d={svgPaths.p19f00400} fill="#811800" />
          </g>
          <path d={svgPaths.p29695700} fill="#811700" />
          <defs>
            <clipPath id="clip_conflict">
              <rect fill="white" height="14" transform="translate(4.73891 4.73891)" width="14" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <p className="text-[10px] text-center text-white whitespace-nowrap z-[1]"
        style={{ fontFamily: "'Marcellus', serif", lineHeight: "14px" }}>Conflict</p>
    </div>
  );
}

/* ── Selected hex node (in drawer) ── */

function DrawerHexNode() {
  return (
    <div className="flex flex-col gap-[2.913px] items-center shrink-0 w-[93.943px]">
      <FigmaHexFrame>
        <FigmaPaletteIcon />
      </FigmaHexFrame>
      <p className="min-w-full overflow-hidden text-[10.2px] text-center text-ellipsis text-white whitespace-nowrap w-[min-content]"
        style={{ fontFamily: "'Marcellus SC', serif" }}>Frontend skill</p>
    </div>
  );
}

/* ── Full drawer panel ── */

function DrawerContent() {
  return (
    <div className="flex flex-col gap-[32px] items-center p-[32px] relative shrink-0 w-full">
      <ConflictBadge />
      <DrawerHexNode />
      <div className="flex flex-col gap-[24px] items-start shrink-0 w-full">
        <SkillInfo />
        <TriggersList />
        <SourceLink />
      </div>
    </div>
  );
}

function DrawerHeader() {
  return (
    <div className="flex items-center justify-between shrink-0 w-full">
      <DrawerButton label="Finance" variant="green" />
      <CloseIcon />
    </div>
  );
}

function DrawerPanel() {
  return (
    <div className="absolute bg-[#191a1c] h-[1024px] right-0 rounded-[8px] top-0 w-[443px]">
      <div className="flex flex-col gap-[24px] items-center px-[24px] pt-[16px] relative w-full">
        <DrawerHeader />
        <DrawerContent />
      </div>
    </div>
  );
}

/* ──────────────── Root Component ──────────────── */

export default function ClaudeSkillTreeSideDrawer() {
  return (
    <div className="bg-gradient-to-b from-[#151821] relative size-full to-[#05080d]" data-name="Claude Skill Tree (Side Drawer)">
      <MainView />
      {/* Backdrop blur overlay */}
      <div className="absolute backdrop-blur-[6.7px] bg-[rgba(25,26,28,0.4)] h-[1024px] left-0 top-0 w-[1434px]" />
      {/* Drawer */}
      <DrawerPanel />
    </div>
  );
}
