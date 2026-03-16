import svgPaths from "../../imports/svg-tfxbcoju7v";
import imgBase from "../../assets/4968c43466d24a5da390463c990fca254fc6804d.png";
import { ReactNode, useId } from "react";

const DECORATION_PATHS = [
  svgPaths.p20831000,
  svgPaths.p10fe6680,
  svgPaths.p259cf50,
  svgPaths.p33d9f000,
  svgPaths.p51f3880,
];

interface OrnateFrameProps {
  size?: number;
  children?: ReactNode;
}

export function OrnateFrame({ size = 64, children }: OrnateFrameProps) {
  const filterId = useId();

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-[7%] rounded-full bg-[#1f1b16]" />
      <img
        alt=""
        className="absolute inset-0 block size-full mix-blend-screen opacity-[0.72]"
        src={imgBase}
      />
      <svg
        className="absolute block"
        style={{ inset: "2.27%" }}
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 60.7694 60.7694"
      >
        <path d={svgPaths.p1053f300} fill="#9B8E75" />
      </svg>
      <svg
        className="absolute block"
        style={{ inset: "4.55%" }}
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 57.8756 57.8756"
      >
        <g opacity="0.88">
          <g filter={`url(#${filterId})`}>
            <path d={svgPaths.p13c14900} fill="#2F281D" />
          </g>
          <path d={svgPaths.p21709100} stroke="#DCB773" strokeWidth="0.25" />
        </g>
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="57.8756"
            height="57.8756"
          >
            <feFlood floodOpacity="0" result="bg" />
            <feBlend in="SourceGraphic" in2="bg" result="shape" />
            <feColorMatrix
              in="SourceAlpha"
              result="ha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="0.752" />
            <feComposite in2="ha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.753 0 0 0 0 0.643 0 0 0 0 0.424 0 0 0 1 0"
            />
            <feBlend in2="shape" result="glow" />
          </filter>
        </defs>
      </svg>
      <svg
        className="absolute block"
        style={{ inset: "4.55%" }}
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 57.8756 57.8756"
      >
        <g opacity="0.3">
          {DECORATION_PATHS.map((d, i) => (
            <path key={i} d={d} fill="#9B8E75" />
          ))}
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
