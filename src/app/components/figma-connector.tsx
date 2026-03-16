/**
 * FigmaConnector — decorative connector lines between hex nodes.
 * These are purely visual/decorative and carry no interaction.
 */
import svgPaths from "../../imports/svg-tfxbcoju7v";

/** V-shaped connector used in tree-style (orientation 1) clusters */
export function FigmaTreeConnector({ className }: { className?: string }) {
  return (
    <div className={className} style={{ width: 118.303, height: 23.304 }}>
      <div className="absolute inset-[0_0_-1.23%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 118.303 23.5912">
          <path d={svgPaths.p3f5a05f0} fill="white" />
          <path d={svgPaths.p5362200} fill="white" />
        </svg>
      </div>
    </div>
  );
}

/** Diagonal line used in diamond/grid clusters */
export function FigmaDiagonalLine({
  rotation,
  length = 32.956,
  className,
}: {
  rotation: number;
  length?: number;
  className?: string;
}) {
  const flip = rotation === 45 || rotation === -45;
  return (
    <div className={`flex items-center justify-center size-[23.304px] ${className ?? ""}`}>
      <div className={`flex-none ${flip ? "-scale-y-100" : ""}`} style={{ transform: `rotate(${rotation}deg)` }}>
        <div className="h-0 relative" style={{ width: length }}>
          <div className="absolute inset-[-0.73px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={`0 0 ${length} 0.728243`}>
              <path d={length > 30 ? svgPaths.p11f3ac00 : svgPaths.p892ee00} fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
