import categoryTextureBase from "../../assets/Trigger pill 2.png";
import categoryTextureStripes from "../../assets/Trigger piill.png";
import categoryTextureOverlay from "../../assets/134baca7923b388c22b2e710106f8aebf7eef9ac.png";
import drawerEdge from "../../assets/pencil-exported/Frame 1841.svg";
import triggerTileReference from "../../assets/pencil-exported/GZlq3.png";
import closeGlyph from "../../assets/pencil-exported/92UtD.png";
import sourceGlyph from "../../assets/pencil-exported/9L2EO.png";
import conflictGlyph from "../../assets/pencil-exported/v8gMI.png";

interface TextProps {
  label: string;
}

export function DetailDrawerDecorativeEdge() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-[-48px] z-0 w-[118px]"
      style={{
        background: "#191A1C",
        WebkitMaskImage: `url(${drawerEdge})`,
        maskImage: `url(${drawerEdge})`,
        WebkitMaskRepeat: "stretch",
        maskRepeat: "stretch",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskPosition: "left top",
        maskPosition: "left top",
      }}
    />
  );
}

export function DetailDrawerCloseIcon() {
  return <img src={closeGlyph} alt="" className="h-6 w-6" draggable={false} />;
}

export function DetailDrawerSourceIcon() {
  return <img src={sourceGlyph} alt="" className="h-4 w-4 shrink-0" draggable={false} />;
}

export function DetailDrawerConflictIcon() {
  return <img src={conflictGlyph} alt="" className="h-6 w-6 shrink-0" draggable={false} />;
}

export function DetailDrawerCategoryPill({ label }: TextProps) {
  return (
    <div className="relative isolate inline-flex min-h-9 max-w-full items-center justify-center overflow-hidden border border-[#5f946a] px-5 py-2">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#1d3923_0%,#5f946a_100%)]" />
      <img
        src={categoryTextureBase}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        draggable={false}
      />
      <img
        src={categoryTextureStripes}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-multiply"
        draggable={false}
      />
      <img
        src={categoryTextureOverlay}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-overlay"
        draggable={false}
      />
      <span
        className="relative z-10 max-w-full truncate text-[12px] text-white"
        style={{
          fontFamily: "'Marcellus', serif",
          lineHeight: "0.66",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function DetailDrawerSectionHeading({ label }: TextProps) {
  return (
    <h3
      className="text-[16px] text-[#b79962]"
      style={{
        fontFamily: "'Marcellus SC', serif",
        lineHeight: "1.2",
      }}
    >
      {label}
    </h3>
  );
}

export function DetailDrawerTriggerTag({ label }: TextProps) {
  return (
    <div className="relative isolate inline-flex min-h-8 max-w-full items-center justify-center overflow-hidden px-2 py-1">
      <img
        src={triggerTileReference}
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-fill opacity-75 blur-[0.8px]"
        draggable={false}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(146,117,114,0.82)_0%,rgba(69,44,45,0.9)_38%,rgba(85,48,45,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_46%,rgba(255,255,255,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.07),transparent_55%)] mix-blend-screen opacity-55" />
      <span
        className="relative z-10 max-w-full whitespace-nowrap text-[14px] text-white"
        style={{
          fontFamily: "'Marcellus', serif",
          lineHeight: "1",
          textShadow: "0 0 3.5px rgba(0,0,0,0.8)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function DetailDrawerConflictPill() {
  return (
    <div className="flex w-fit items-center gap-[5px] rounded-l-[80px] bg-[linear-gradient(90deg,rgba(129,24,0,0.21)_0%,rgba(129,24,0,0)_100%)] pr-10">
      <DetailDrawerConflictIcon />
      <span
        className="text-[10px] text-white"
        style={{
          fontFamily: "'Marcellus', serif",
          lineHeight: "1.4",
        }}
      >
        Conflict
      </span>
    </div>
  );
}
