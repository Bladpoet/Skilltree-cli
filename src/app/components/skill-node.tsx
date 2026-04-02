import { useState, useCallback } from "react";
import imgEffect from "../../assets/node-effect.png";
import imgIconDefault from "../../assets/node-icon.svg";
import imgIconHover from "../../assets/node-icon-hover.svg";
import imgIconPressed from "../../assets/node-icon-pressed.svg";

export type SkillNodeState = "default" | "hover" | "selected" | "conflict";

export interface SkillNodeProps {
  id: string;
  label: string;
  iconKey?: string;
  state?: SkillNodeState;
  onClick?: () => void;
  interactive?: boolean;
}

// Exact dimensions from Figma
const W = 88.934;
const H = 86.958;
const OVERLAP_W = 95.07;
// Inner centered frame: left 2.44, top 0.88, size 83.739
const FRAME_SIZE = 83.739;
const FRAME_L = 2.44;
const FRAME_T = 0.88;
// Base diamond size inside the frame (rotated 45deg)
const BASE_SIZE = 59.212;
// Inner outline (rotated 45deg) — wrapper 72.574 at left 8.02 top 6.47
const OUTLINE_WRAPPER = 72.574;
const OUTLINE_SIZE = 51.317;
// Figma gives these in outer node coordinates; convert to inner-frame coordinates.
const OUTLINE_L = 8.02 - FRAME_L;
const OUTLINE_T = 6.47 - FRAME_T;
const DECORATION_SIZE = 59.29;
const DECORATION_L = 12.28;
const DECORATION_T = 12.28;

type StateKey = "default" | "hover" | "pressed" | "overlap";

interface StateColors {
  baseStroke: string;
  outlineStroke: string;
  boxShadow?: string;
  insetShadow?: string;
}

const COLORS: Record<StateKey, StateColors> = {
  default: {
    baseStroke: "#d2d2d2",
    outlineStroke: "#ae9a73",
  },
  hover: {
    baseStroke: "#ffe38f",
    outlineStroke: "#ffdd79",
    boxShadow: "0px 2px 4px 0px rgba(249,201,61,0.26)",
    insetShadow: "inset 0px 0px 2.961px 0px #c0a46c",
  },
  pressed: {
    baseStroke: "#ffe38f",
    outlineStroke: "#ffdd79",
    boxShadow: "0px 2px 4px 0px rgba(249,201,61,0.26)",
    insetShadow: "inset 0px 0px 2.961px 0px #c0a46c",
  },
  overlap: {
    baseStroke: "#d2d2d2",
    outlineStroke: "#ae9a73",
  },
};

function toStateKey(state: SkillNodeState): StateKey {
  if (state === "selected") return "pressed";
  if (state === "conflict") return "overlap";
  return state as StateKey;
}

const FIGMA_DECORATION_SRC: Record<StateKey, string> = {
  default: "https://www.figma.com/api/mcp/asset/80bcbfbf-037d-4ade-8279-25a98dd63207",
  hover: "https://www.figma.com/api/mcp/asset/02821831-739a-4659-b732-835405d52699",
  pressed: "https://www.figma.com/api/mcp/asset/8f1d14bb-0bde-402b-9935-15f78458328b",
  overlap: "https://www.figma.com/api/mcp/asset/78881cf2-f6ed-4b74-adcf-9d596561ad36",
};

const OVERLAP_VECTOR = "https://www.figma.com/api/mcp/asset/a805a779-6ed0-468f-a900-388fb62586c2";
const OVERLAP_VECTOR_STROKE_A = "https://www.figma.com/api/mcp/asset/8dd16920-2c4c-4415-9e58-33cd3c79c952";
const OVERLAP_VECTOR_STROKE_B = "https://www.figma.com/api/mcp/asset/cfe3bdb8-0e9b-4502-bee5-0f108b1d0c63";
const OVERLAP_VECTOR_STROKE_C = "https://www.figma.com/api/mcp/asset/91d9d264-b46c-4476-9a60-21178d3881c9";
const OVERLAP_ELLIPSE_STROKE = "https://www.figma.com/api/mcp/asset/14abefaf-aaf3-40cd-b11a-bc78f73a2f97";

function DiamondNode({ stateKey }: { stateKey: StateKey }) {
  const colors = COLORS[stateKey];
  const isActiveState = stateKey === "hover" || stateKey === "pressed";
  const decorationSrc = FIGMA_DECORATION_SRC[stateKey];
  const iconSrc =
    stateKey === "hover" ? imgIconHover : stateKey === "pressed" ? imgIconPressed : imgIconDefault;

  // Sun icon position: centered at (50%-0.1px, 50%+0.01px) size 26.259
  const sunSize = 26.259;
  const sunL = FRAME_SIZE / 2 - sunSize / 2 - 0.1;
  const sunT = FRAME_SIZE / 2 - sunSize / 2 + 0.01;

  return (
    <div
      className="relative shrink-0"
      style={{ width: W, height: H }}
    >
      {/* Overlap badge — centered at top, sticking out above diamond */}
      {stateKey === "overlap" && (
        <div
          className="absolute z-10"
          style={{
            width: 17.478,
            left: "calc(50% + 0.28px)",
            transform: "translateX(-50%)",
            top: "-5.75%",
            bottom: "85.65%",
            overflow: "clip",
          }}
        >
          <div className="absolute" style={{ inset: "11.12% 8.34% 16.68% 8.34%" }}>
            <img alt="" src={OVERLAP_VECTOR} className="absolute block max-w-none size-full" draggable={false} />
          </div>
          <div className="absolute" style={{ inset: "8.15% 4.2% 12.58% 4.48%" }}>
            <img alt="" src={OVERLAP_VECTOR_STROKE_A} className="absolute block max-w-none size-full" draggable={false} />
          </div>
          <div className="absolute flex items-center justify-center" style={{ inset: "8.15% 4.49% 12.58% 4.2%" }}>
            <div style={{ width: 15.96, height: 13.855, transform: "rotate(180deg) scaleY(-1)", flex: "none" }}>
              <div className="relative size-full">
                <img alt="" src={OVERLAP_VECTOR_STROKE_B} className="absolute block max-w-none size-full" draggable={false} />
              </div>
            </div>
          </div>
          <div className="absolute" style={{ inset: "37.5% 45.83% 45.83% 45.83%" }}>
            <img alt="" src={OVERLAP_VECTOR_STROKE_C} className="absolute block max-w-none size-full" draggable={false} />
          </div>
          <div className="absolute" style={{ inset: "59% 43.23% 29.71% 45.2%" }}>
            <img alt="" src={OVERLAP_ELLIPSE_STROKE} className="absolute block max-w-none size-full" draggable={false} />
          </div>
        </div>
      )}

      {/* Inner frame — hosts all diamond layers */}
      <div
        className="absolute"
        style={{ left: FRAME_L, top: FRAME_T, width: FRAME_SIZE, height: FRAME_SIZE, isolation: "isolate" }}
      >
        {/* Base diamond */}
        <div className="absolute flex items-center justify-center" style={{ inset: 0 }}>
          <div style={{ transform: "rotate(45deg)", flex: "none" }}>
            <div
              style={{
                width: BASE_SIZE,
                height: BASE_SIZE,
                border: `0.493px solid ${colors.baseStroke}`,
                opacity: 0.8,
                boxSizing: "border-box",
                boxShadow: isActiveState ? colors.boxShadow : undefined,
                position: "relative",
                backgroundColor: "#2f281d",
              }}
            >
              {isActiveState && (
                <>
                  <div aria-hidden="true" className="absolute inset-0 bg-[#2f281d]" />
                  <div className="absolute inset-0 rounded-[inherit]" style={{ boxShadow: colors.insetShadow }} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Effect texture overlay */}
        <div className="absolute flex items-center justify-center" style={{ inset: 0 }}>
          <div style={{ transform: "rotate(45deg)", flex: "none" }}>
            <div
              style={{
                width: BASE_SIZE,
                height: BASE_SIZE,
                opacity: 0.8,
                position: "relative",
              }}
            >
              <img
                src={imgEffect}
                alt=""
                className="absolute inset-0 max-w-none object-cover size-full"
                style={{ mixBlendMode: "luminosity", opacity: 0.4 }}
                draggable={false}
              />
              {isActiveState && (
                <div
                  className="absolute inset-0 rounded-[inherit]"
                  style={{ boxShadow: colors.insetShadow }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Inner outline diamond */}
        <div
          className="absolute flex items-center justify-center"
          style={{ left: OUTLINE_L, top: OUTLINE_T, width: OUTLINE_WRAPPER, height: OUTLINE_WRAPPER }}
        >
          <div style={{ transform: "rotate(45deg)", flex: "none" }}>
            <div
              style={{
                width: OUTLINE_SIZE,
                height: OUTLINE_SIZE,
                border: `0.493px solid ${colors.outlineStroke}`,
                opacity: 0.8,
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Decoration image — rotated 90deg, inset ~15-17% */}
        <div
          className="absolute flex items-center justify-center"
          style={
            stateKey === "pressed"
              ? {
                  left: "50%",
                  top: "50%",
                  width: 59.29,
                  height: 59.29,
                  transform: "translate(calc(-50% - 0.1px), calc(-50% - 0.83px))",
                }
              : { left: DECORATION_L, top: DECORATION_T, width: DECORATION_SIZE, height: DECORATION_SIZE }
          }
        >
          <div style={{ transform: "rotate(90deg)", flex: "none", width: "100%", height: "100%" }}>
            <div className="relative size-full">
              <img src={decorationSrc} alt="" className="absolute block max-w-none size-full" draggable={false} />
            </div>
          </div>
        </div>

        {/* Sun icon */}
        <div
          className="absolute"
          style={{ left: sunL, top: sunT, width: sunSize, height: sunSize }}
        >
          {stateKey === "hover" ? (
            // Hover: icon wrapped in slightly larger container, rotated -15deg
            <div
              className="flex items-center justify-center"
              style={{ width: 32.16, height: 32.16, marginLeft: (sunSize - 32.16) / 2, marginTop: (sunSize - 32.16) / 2 }}
            >
              <div style={{ transform: "rotate(-15deg)", flex: "none" }}>
                <div className="relative" style={{ width: sunSize, height: sunSize }}>
                  <img src={iconSrc} alt="" className="absolute block max-w-none size-full" draggable={false} />
                </div>
              </div>
            </div>
          ) : (
            <img src={iconSrc} alt="" className="absolute block max-w-none size-full" draggable={false} />
          )}
        </div>
      </div>
    </div>
  );
}

function NodeLabel({ label }: { label: string }) {
  return (
    <div
      className="flex items-center justify-center overflow-hidden shrink-0"
      style={{
        width: "100%",
        height: 20,
        marginTop: -20,
        background:
          "linear-gradient(90deg, rgba(53,54,56,0) 0%, #5e5f62 50.5%, rgba(53,54,56,0) 100%)",
        paddingLeft: 4.626,
        paddingRight: 4.626,
        boxSizing: "border-box",
      }}
    >
      <span
        className="block truncate text-center text-white whitespace-nowrap"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          lineHeight: "20px",
          maxWidth: 88,
        }}
        title={label}
      >
        {label}
      </span>
    </div>
  );
}

export function SkillNode({
  id,
  label,
  state: controlledState = "default",
  onClick,
  interactive = true,
}: SkillNodeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const effectiveState: SkillNodeState =
    controlledState === "default" && isHovered ? "hover" : controlledState;

  const stateKey = toStateKey(effectiveState);
  const handleClick = useCallback(() => { onClick?.(); }, [onClick]);

  const commonProps = {
    "data-skill-id": id,
    "data-state": effectiveState,
    className: "relative flex flex-col items-center border-none bg-transparent p-0 outline-none",
    style: { width: stateKey === "overlap" ? OVERLAP_W : W, paddingBottom: 20 },
  };

  const content = (
    <>
      <DiamondNode stateKey={stateKey} />
      <NodeLabel label={label} />
    </>
  );

  if (!interactive) {
    return <div {...commonProps}>{content}</div>;
  }

  return (
    <button
      {...commonProps}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${commonProps.className} cursor-pointer transition-transform duration-150 hover:scale-[1.03] active:scale-100 focus-visible:outline-2 focus-visible:outline-[#DCB773] focus-visible:outline-offset-4`}
      title={label}
    >
      {content}
    </button>
  );
}
