/**
 * FigmaHexFrame — the hex node shape from Figma.
 * 3 stacked polygon SVG layers + centered icon slot.
 * Used in Desktop16 reference, ClaudeSkillTreeSideDrawer reference,
 * and will be the base for the live HexNode component.
 */
import { ReactNode } from "react";
import svgPaths from "../../imports/svg-tfxbcoju7v";

interface FigmaHexFrameProps {
  /** Content rendered centered inside the hex (e.g. icon) */
  children?: ReactNode;
  /** Overall size in px (default 93.943 from Figma) */
  size?: number;
}

export function FigmaHexFrame({ children, size = 93.943 }: FigmaHexFrameProps) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {/* Layer 1: outer hex outline (rotated 90°) */}
      <div
        className="absolute flex items-center justify-center inset-0"
      >
        <div className="flex-none rotate-90" style={{ width: size, height: size }}>
          <div className="relative size-full">
            <div className="absolute inset-[0.13%_5.68%_-0.71%_5.72%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 83.2351 94.4903">
                <path d={svgPaths.p27d95b00} fill="#F0F1F3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* Layer 2: secondary hex (rotated 150°, half opacity) */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: -17.19,
          top: -17.19,
          width: 128.329,
          height: 128.329,
        }}
      >
        <div className="flex-none rotate-150" style={{ width: size, height: size }}>
          <div className="relative size-full">
            <div className="absolute inset-[0.13%_5.68%_-0.71%_5.72%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 83.2351 94.4903">
                <path d={svgPaths.p27d95b00} fill="#F0F1F3" opacity="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* Layer 3: inner filled hex (rotated 90°) */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 5.4, top: 5.4, width: 83.145, height: 83.145 }}
      >
        <div className="flex-none rotate-90" style={{ width: 83.145, height: 83.145 }}>
          <div className="relative size-full">
            <div className="absolute inset-[0.18%_6.61%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 72.1515 82.8402">
                <path
                  d={svgPaths.p1fa1ee80}
                  fill="#515E59"
                  opacity="0.5"
                  stroke="#F0F1F3"
                  strokeWidth="0.145649"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* Centered children (icon overlay) */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Default palette icon overlay used in the Figma reference frames.
 * Wraps the palette SVG path at the standard position/size.
 */
export function FigmaPaletteIcon() {
  return (
    <div className="absolute left-[24.84px] opacity-85 overflow-clip size-[38.873px] top-[28.08px]">
      <div className="absolute inset-[8.12%_5.83%_7.43%_6.34%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.1433 32.8276">
          <path d={svgPaths.p31af0e00} fill="white" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Convenience: a hex frame with the default palette icon already inside.
 */
export function FigmaHexNode({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-[2.913px] items-center w-[93.943px]">
      <FigmaHexFrame>
        <FigmaPaletteIcon />
      </FigmaHexFrame>
      <p
        className="min-w-full overflow-hidden text-[10.2px] text-center text-ellipsis text-white whitespace-nowrap w-[min-content]"
        style={{ fontFamily: "'Marcellus SC', serif" }}
      >
        {label}
      </p>
    </div>
  );
}
