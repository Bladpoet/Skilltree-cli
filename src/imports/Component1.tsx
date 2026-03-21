import type { CSSProperties } from "react";
import svgPaths from "./svg-x0e8ml4dfy";
import React from "react";

function Group() {
  return (
    <div className="absolute inset-[8.12%_5.83%_7.43%_6.34%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46.8846 45.0779">
        <g id="Group">
          <path d={svgPaths.p1c003a00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Palette() {
  return (
    <div className="absolute left-[34.1px] opacity-85 overflow-clip size-[53.379px] top-[38.55px]" data-name="palette 1">
      <Group />
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[129px]">
      <div className="absolute flex items-center justify-center left-0 size-[129px] top-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="relative size-[129px]">
            <div className="absolute inset-[0.13%_5.68%_-0.71%_5.72%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 114.296 129.751">
                <path d={svgPaths.p340c7e00} fill="var(--stroke-0, #F0F1F3)" id="Polygon 1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex items-center justify-center left-[-23.61px] size-[176.217px] top-[-23.61px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as CSSProperties}>
        <div className="flex-none rotate-150">
          <div className="relative size-[129px]">
            <div className="absolute inset-[0.13%_5.68%_-0.71%_5.72%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 114.296 129.751">
                <path d={svgPaths.p340c7e00} fill="var(--stroke-0, #F0F1F3)" id="Polygon 3" opacity="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex items-center justify-center left-[7.41px] size-[114.172px] top-[7.41px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="relative size-[114.172px]">
            <div className="absolute inset-[0.18%_6.61%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 99.0762 113.754">
                <path d={svgPaths.p3c008800} fill="var(--fill-0, #515E59)" id="Polygon 2" opacity="0.5" stroke="var(--stroke-0, #F0F1F3)" strokeWidth="0.2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Palette />
    </div>
  );
}

export default function Component() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative size-full" data-name="Component 1">
      <Frame />
      <p className="font-['Marcellus_SC:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[14px] text-center text-white w-[min-content]">Frontend skill</p>
    </div>
  );
}
