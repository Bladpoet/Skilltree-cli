/**
 * FigmaArrow — the right-edge scroll arrow from the Figma frames.
 * Used in both Desktop16 and ClaudeSkillTreeSideDrawer reference files.
 */
import svgPaths from "../../imports/svg-tfxbcoju7v";

export function FigmaArrow() {
  return (
    <div
      className="-translate-y-1/2 absolute h-[39.971px] right-[13.63px] top-[calc(50%-31.95px)] w-[42.368px]"
    >
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42.3679 39.971">
        <path d={svgPaths.p12c9ff00} fill="white" fillOpacity="0.19" />
        <path d={svgPaths.p3a213b00} fill="url(#paint0_linear_arrow)" />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_arrow" x1="16.1542" x2="26.2499" y1="20.2001" y2="20.2001">
            <stop stopColor="#EAE1C8" />
            <stop offset="1" stopColor="#C5B7A2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
