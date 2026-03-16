import svgPaths from "../../imports/svg-tfxbcoju7v";
import imgTab from "../../assets/662ddf28ad8ff478932c11a0018d9a8fba6d077d.png";

interface FigmaCategoryTabProps {
  name: string;
}

export function FigmaCategoryTab({ name }: FigmaCategoryTabProps) {
  return (
    <div className="relative flex h-[36px] w-[132px] shrink-0 items-center justify-center overflow-hidden px-[10px] py-[10px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 14%, rgba(255,255,255,0.1) 56.57%, rgba(255,255,255,0.31) 100%)",
            opacity: 0.51,
          }}
        />
        <img
          alt=""
          className="absolute size-full object-cover mix-blend-screen opacity-[0.30]"
          src={imgTab}
        />
      </div>
      <p
        className="relative whitespace-nowrap text-[14px] text-white"
        style={{
          fontFamily: "'Marcellus', serif",
          lineHeight: "16px",
          textShadow: "0 1px 1px rgba(0,0,0,0.35)",
        }}
      >
        {name}
      </p>
      <div className="absolute bottom-0 left-0 h-[8px] w-[10px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 8">
          <path d={svgPaths.p247bba00} fill="white" opacity="0.5" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-[5.95%] right-[5.95%] h-[5px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 116.286 5">
          <path d={svgPaths.p9f54400} fill="white" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 flex h-[8px] w-[10px] items-center justify-center">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="relative h-[8px] w-[10px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 8">
              <path d={svgPaths.p185e3700} fill="white" opacity="0.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
