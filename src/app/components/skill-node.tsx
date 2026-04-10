import { useState, useCallback } from "react";
import imgEffect from "../../assets/node-effect.png";
import overlapIconBg from "../../assets/overlap-icon-bg.svg";
import overlapIconBrush from "../../assets/overlap-icon-brush.svg";
import nodeDecorationDefault from "../../assets/node-decoration-default.svg";
import nodeDecorationPressed from "../../assets/node-decoration-pressed.svg";
import { useSoundEffects } from "../hooks/use-sound-effects";

export type SkillNodeState = "default" | "hover" | "selected" | "conflict";

export interface SkillNodeProps {
  id: string;
  label: string;
  iconKey?: string;
  iconPath?: string;
  iconName?: string;
  showOverlapBadge?: boolean;
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

interface HighlightToken {
  visible: boolean;
  size: number;
  blur: number;
  opacity: number;
  color: string;
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

const HIGHLIGHT_TOKENS: Record<StateKey, HighlightToken> = {
  default: {
    visible: true,
    size: 18,
    blur: 9,
    opacity: 0.42,
    color: "#F9C93D",
  },
  hover: {
    visible: true,
    size: 22,
    blur: 12,
    opacity: 0.62,
    color: "#F9C93D",
  },
  pressed: {
    visible: false,
    size: 0,
    blur: 0,
    opacity: 0,
    color: "#F9C93D",
  },
  overlap: {
    visible: true,
    size: 18,
    blur: 9,
    opacity: 0.42,
    color: "#F9C93D",
  },
};

function toStateKey(state: SkillNodeState): StateKey {
  if (state === "selected") return "pressed";
  if (state === "conflict") return "overlap";
  return state as StateKey;
}

const DECORATION_SRC: Record<StateKey, string> = {
  default: nodeDecorationDefault,
  hover: nodeDecorationDefault,
  pressed: nodeDecorationPressed,
  overlap: nodeDecorationDefault,
};


const DEFAULT_ICON_PATH = "/skill-icons/default.svg";

function iconFilterForState(stateKey: StateKey): string {
  if (stateKey === "hover") {
    return "brightness(0) saturate(100%) invert(93%) sepia(63%) saturate(526%) hue-rotate(333deg) brightness(101%) contrast(97%)";
  }

  if (stateKey === "pressed") {
    return "brightness(0) saturate(100%) invert(24%) sepia(30%) saturate(1240%) hue-rotate(11deg) brightness(94%) contrast(90%)";
  }

  return "brightness(0) saturate(100%) invert(84%) sepia(22%) saturate(349%) hue-rotate(355deg) brightness(93%) contrast(89%)";
}

function IconGlyph({
  stateKey,
  iconPath,
  iconName,
}: {
  stateKey: StateKey;
  iconPath?: string;
  iconName?: string;
}) {
  const resolvedIconSrc = iconPath && iconPath.trim().length > 0 ? iconPath : DEFAULT_ICON_PATH;
  const rotation = stateKey === "hover" ? -15 : 0;
  const scale = stateKey === "pressed" ? 0.96 : 1;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <img
        src={resolvedIconSrc}
        alt={iconName ? `${iconName} icon` : ""}
        className="block max-w-none size-full"
        style={{
          filter: iconFilterForState(stateKey),
          transform: `scale(${scale})`,
          transition:
            "filter 220ms cubic-bezier(0.22, 1, 0.36, 1), transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        draggable={false}
      />
    </div>
  );
}

function IconHighlight({ stateKey }: { stateKey: StateKey }) {
  const token = HIGHLIGHT_TOKENS[stateKey];

  return (
    <div
      aria-hidden
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `calc(50% - ${token.size / 2}px)`,
        top: `calc(50% - ${token.size / 2}px)`,
        width: token.size,
        height: token.size,
        background: token.color,
        opacity: token.visible ? token.opacity : 0,
        filter: `blur(${token.blur}px)`,
        transition:
          "opacity 220ms cubic-bezier(0.22, 1, 0.36, 1), width 220ms cubic-bezier(0.22, 1, 0.36, 1), height 220ms cubic-bezier(0.22, 1, 0.36, 1), left 220ms cubic-bezier(0.22, 1, 0.36, 1), top 220ms cubic-bezier(0.22, 1, 0.36, 1), filter 220ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    />
  );
}

function DiamondNode({
  stateKey,
  showOverlapBadge,
  iconPath,
  iconName,
}: {
  stateKey: StateKey;
  showOverlapBadge?: boolean;
  iconPath?: string;
  iconName?: string;
}) {
  const colors = COLORS[stateKey];
  const isActiveState = stateKey === "hover" || stateKey === "pressed";
  const decorationSrc = DECORATION_SRC[stateKey];

  // Sun icon position: centered at (50%-0.1px, 50%+0.01px) size 26.259
  const sunSize = 32;
  const sunL = FRAME_SIZE / 2 - sunSize / 2 - 0.1;
  const sunT = FRAME_SIZE / 2 - sunSize / 2 + 0.01;

  return (
    <div
      className="relative shrink-0"
      style={{ width: W, height: H }}
    >
      {/* Overlap badge — two stacked SVGs (brown bg + golden caution) centered at top */}
      {showOverlapBadge && (
        <div
          className="absolute z-10"
          style={{
            width: 22,
            height: 19,
            left: "50%",
            transform: "translateX(-50%)",
            top: "-10px",
          }}
        >
          <div className="relative w-full h-full">
            <img src={overlapIconBg} alt="" className="absolute inset-0 w-full h-full" draggable={false} />
            <img src={overlapIconBrush} alt="overlapping skill" className="absolute inset-0 w-full h-full" draggable={false} />
          </div>
        </div>
      )}

      {/* Inner frame — hosts all diamond layers */}
      <div
        className="absolute"
        style={{ left: FRAME_L, top: FRAME_T, width: FRAME_SIZE, height: FRAME_SIZE }}
      >
        {/* Base diamond with texture - combined to allow proper blending */}
        <div className="absolute flex items-center justify-center" style={{ inset: 0 }}>
          <div style={{ transform: "rotate(45deg)", flex: "none", isolation: "isolate" }}>
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
                transition:
                  "border-color 220ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {/* Effect texture overlay - must be INSIDE the base diamond for blend mode to work */}
              <img
                src={imgEffect}
                alt=""
                className="absolute inset-0 max-w-none object-cover size-full"
                style={{ 
                  mixBlendMode: "luminosity", 
                  opacity: 0.3,
                  filter: "grayscale(0.5) sepia(0.2)" 
                }}
                draggable={false}
              />
              {isActiveState && (
                <div className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{ boxShadow: colors.insetShadow }} />
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
                  transition:
                    "border-color 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms cubic-bezier(0.22, 1, 0.36, 1)",
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
                  transition: "all 220ms cubic-bezier(0.22, 1, 0.36, 1)",
                }
              : {
                  left: DECORATION_L,
                  top: DECORATION_T,
                  width: DECORATION_SIZE,
                  height: DECORATION_SIZE,
                  transition: "all 220ms cubic-bezier(0.22, 1, 0.36, 1)",
                }
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
          <IconHighlight stateKey={stateKey} />
          {stateKey === "hover" ? (
            <IconGlyph stateKey={stateKey} iconPath={iconPath} iconName={iconName} />
          ) : (
            <IconGlyph stateKey={stateKey} iconPath={iconPath} iconName={iconName} />
          )}
        </div>
      </div>
    </div>
  );
}

function NodeLabel({ label }: { label: string }) {
  return (
    <div
      className="relative z-10 flex items-center justify-center overflow-hidden shrink-0"
      style={{
        width: "150%",
        height: 20,
        marginTop: -20,
        background:
          "linear-gradient(90deg, transparent 0%, #28160A 50.5%, transparent 100%)",
        paddingLeft: 4.626,
        paddingRight: 4.626,
        boxSizing: "border-box",
      }}
    >
      <span
        className="block truncate text-center whitespace-nowrap"
        style={{
          fontFamily: "'Albertus Nova', serif",
          fontSize: "12px",
          fontWeight: 300,
          lineHeight: "150%",
          maxWidth: 110,
          color: "#F1E7DC",
          letterSpacing: "0.72px",
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
  iconPath,
  iconName,
  showOverlapBadge: forceOverlapBadge,
  state: controlledState = "default",
  onClick,
  interactive = true,
}: SkillNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { playHover, playClick } = useSoundEffects();

  const showOverlapBadge = forceOverlapBadge ?? controlledState === "conflict";
  
  // For visual state, overlap can still be hover/pressed
  let effectiveState: SkillNodeState = controlledState;
  if (controlledState === "conflict") {
    effectiveState = isHovered ? "hover" : "default";
  } else if (controlledState === "default" && isHovered) {
    effectiveState = "hover";
  }

  const stateKey = toStateKey(effectiveState);
  const handleClick = useCallback(() => { playClick(); onClick?.(); }, [onClick, playClick]);

  const commonProps = {
    "data-skill-id": id,
    "data-state": effectiveState,
    className: "relative flex flex-col items-center border-none bg-transparent p-0 outline-none",
    style: { width: showOverlapBadge ? OVERLAP_W : W, paddingBottom: 20 },
  };

  const content = (
    <>
      <DiamondNode stateKey={stateKey} showOverlapBadge={showOverlapBadge} iconPath={iconPath} iconName={iconName} />
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
      onMouseEnter={() => { setIsHovered(true); playHover(); }}
      onMouseLeave={() => setIsHovered(false)}
      className={`${commonProps.className} cursor-pointer transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-[#DCB773] focus-visible:outline-offset-4`}
      title={label}
    >
      {content}
    </button>
  );
}
