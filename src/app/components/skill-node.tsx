import { useState, useCallback, type ReactNode } from "react";
import svgPaths from "../../imports/svg-x0e8ml4dfy";
import * as LucideIcons from "lucide-react";
import { skillIconMap, FALLBACK_ICON } from "./skill-node-icon-map";
import { AlertTriangle } from "lucide-react";

export type SkillNodeState = "default" | "hover" | "selected" | "conflict";

export interface SkillNodeProps {
  id: string;
  label: string;
  iconKey?: string;
  iconOverride?: ReactNode;
  state?: SkillNodeState;
  onClick?: () => void;
  interactive?: boolean;
}

interface StateColors {
  outerFill: string;
  outerOpacity: number;
  secondaryFill: string;
  secondaryOpacity: number;
  innerFill: string;
  innerOpacity: number;
  innerStroke: string;
  innerStrokeWidth: number;
  iconColor: string;
  labelColor: string;
  glowColor: string;
  glowOpacity: number;
  glowBlur: number;
}

const STATE_COLORS: Record<SkillNodeState, StateColors> = {
  default: {
    outerFill: "#F0F1F3",
    outerOpacity: 1,
    secondaryFill: "#F0F1F3",
    secondaryOpacity: 0.46,
    innerFill: "#515E59",
    innerOpacity: 0.48,
    innerStroke: "#F0F1F3",
    innerStrokeWidth: 0.16,
    iconColor: "rgba(255,255,255,0.85)",
    labelColor: "#ffffff",
    glowColor: "transparent",
    glowOpacity: 0,
    glowBlur: 0,
  },
  hover: {
    outerFill: "#DCB773",
    outerOpacity: 1,
    secondaryFill: "#DCB773",
    secondaryOpacity: 0.38,
    innerFill: "#515E59",
    innerOpacity: 0.56,
    innerStroke: "#DCB773",
    innerStrokeWidth: 0.24,
    iconColor: "rgba(255,255,255,0.92)",
    labelColor: "#ffffff",
    glowColor: "#DCB773",
    glowOpacity: 0.12,
    glowBlur: 12,
  },
  selected: {
    outerFill: "#DCB773",
    outerOpacity: 1,
    secondaryFill: "#DCB773",
    secondaryOpacity: 0.46,
    innerFill: "#5A5A47",
    innerOpacity: 0.6,
    innerStroke: "#DCB773",
    innerStrokeWidth: 0.28,
    iconColor: "#ffffff",
    labelColor: "#ffffff",
    glowColor: "#DCB773",
    glowOpacity: 0.18,
    glowBlur: 18,
  },
  conflict: {
    outerFill: "#6B3A3A",
    outerOpacity: 1,
    secondaryFill: "#6B3A3A",
    secondaryOpacity: 0.4,
    innerFill: "#765555",
    innerOpacity: 0.48,
    innerStroke: "#6B3A3A",
    innerStrokeWidth: 0.22,
    iconColor: "rgba(255,255,255,0.82)",
    labelColor: "#ffffff",
    glowColor: "transparent",
    glowOpacity: 0,
    glowBlur: 0,
  },
};

function resolveIcon(iconKey?: string): ReactNode {
  const name = iconKey ? skillIconMap[iconKey] ?? FALLBACK_ICON : FALLBACK_ICON;
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<LucideIcons.LucideProps>>)[name];
  if (!IconComponent) {
    const Fallback = (LucideIcons as Record<string, React.ComponentType<LucideIcons.LucideProps>>)[FALLBACK_ICON];
    return Fallback ? <Fallback size={36} strokeWidth={1.5} /> : null;
  }
  return <IconComponent size={36} strokeWidth={1.5} />;
}

const HEX_SIZE = 94;

function HexFrame({ colors, children }: { colors: StateColors; children?: ReactNode }) {
  return (
    <div className="relative shrink-0" style={{ width: HEX_SIZE, height: HEX_SIZE }}>
      {colors.glowOpacity > 0 && (
        <div
          className="absolute inset-[-10px] rounded-full pointer-events-none"
          style={{
            background: colors.glowColor,
            opacity: colors.glowOpacity,
            filter: `blur(${colors.glowBlur}px)`,
          }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex-none rotate-90" style={{ width: HEX_SIZE, height: HEX_SIZE }}>
          <div className="relative size-full">
            <div className="absolute inset-[0.13%_5.68%_-0.71%_5.72%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 114.296 129.751">
                <path d={svgPaths.p340c7e00} fill={colors.outerFill} opacity={colors.outerOpacity} />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex items-center justify-center" style={{ left: -17.19, top: -17.19, width: 128.329, height: 128.329 }}>
        <div className="flex-none rotate-150" style={{ width: HEX_SIZE, height: HEX_SIZE }}>
          <div className="relative size-full">
            <div className="absolute inset-[0.13%_5.68%_-0.71%_5.72%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 114.296 129.751">
                <path d={svgPaths.p340c7e00} fill={colors.secondaryFill} opacity={colors.secondaryOpacity} />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex items-center justify-center" style={{ left: 5.4, top: 5.4, width: 83.145, height: 83.145 }}>
        <div className="flex-none rotate-90" style={{ width: 83.145, height: 83.145 }}>
          <div className="relative size-full">
            <div className="absolute inset-[0.18%_6.61%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 99.0762 113.754">
                <path
                  d={svgPaths.p3c008800}
                  fill={colors.innerFill}
                  opacity={colors.innerOpacity}
                  stroke={colors.innerStroke}
                  strokeWidth={colors.innerStrokeWidth}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {children && <div className="absolute inset-0 z-[1] flex items-center justify-center">{children}</div>}
    </div>
  );
}

function ConflictBadge() {
  return (
    <div className="absolute -right-[2px] -top-[2px] z-[2]">
      <div className="flex size-[22px] items-center justify-center rounded-full border border-[#6B3A3A] bg-[#2A1A1A]">
        <AlertTriangle size={12} className="text-[#FF8A80]" strokeWidth={2.5} />
      </div>
    </div>
  );
}

function SkillNodeContents({
  effectiveState,
  colors,
  icon,
  label,
}: {
  effectiveState: SkillNodeState;
  colors: StateColors;
  icon: ReactNode;
  label: string;
}) {
  return (
    <>
      <div className="relative">
        <HexFrame colors={colors}>
          <div style={{ color: colors.iconColor }} className="transition-colors duration-200">
            <div className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">{icon}</div>
          </div>
        </HexFrame>
        {effectiveState === "conflict" && <ConflictBadge />}
      </div>
      <span
        className="block min-w-full overflow-hidden text-ellipsis whitespace-nowrap text-center"
        style={{
          fontFamily: "'Marcellus SC', serif",
          fontSize: "10.2px",
          color: colors.labelColor,
          maxWidth: HEX_SIZE,
          textShadow: "0 1px 1px rgba(0,0,0,0.35)",
        }}
        title={label}
      >
        {label}
      </span>
    </>
  );
}

export function SkillNode({
  id,
  label,
  iconKey,
  iconOverride,
  state: controlledState = "default",
  onClick,
  interactive = true,
}: SkillNodeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const effectiveState: SkillNodeState =
    controlledState === "default" && isHovered ? "hover" : controlledState;

  const colors = STATE_COLORS[effectiveState];
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);
  const icon = iconOverride ?? resolveIcon(iconKey);

  const commonProps = {
    "data-skill-id": id,
    "data-state": effectiveState,
    className:
      "relative flex flex-col items-center gap-[3px] rounded border-none bg-transparent p-0 outline-none",
    style: { width: HEX_SIZE },
  };

  if (!interactive) {
    return (
      <div {...commonProps}>
        <SkillNodeContents effectiveState={effectiveState} colors={colors} icon={icon} label={label} />
      </div>
    );
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
      <SkillNodeContents effectiveState={effectiveState} colors={colors} icon={icon} label={label} />
    </button>
  );
}
