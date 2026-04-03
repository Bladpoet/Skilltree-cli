import closeBrush from "../../assets/drawer-close-brush.svg";
import copyIcon from "../../assets/drawer-copy-icon.svg";
import drawerEdge from "../../assets/drawer-edge-brush.svg";
import sectionSeparator from "../../assets/drawer-section-separator.svg";
import sourceGlyph from "../../assets/pencil-exported/9L2EO.png";
import triggerBrush from "../../assets/drawer-trigger-brush.svg";

interface TextProps {
  label: string;
}

export function DetailDrawerDecorativeEdge() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-[-48px] z-0 w-[118px]"
      style={{
        background: "rgb(255,247,227)",
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

export function DetailDrawerCloseButton() {
  return <img src={closeBrush} alt="" className="h-8 w-8 shrink-0" draggable={false} />;
}

export function DetailDrawerCopyIcon() {
  return <img src={copyIcon} alt="" className="h-4 w-4 shrink-0" draggable={false} />;
}

export function DetailDrawerSourceIcon() {
  return <img src={sourceGlyph} alt="" className="h-4 w-4 shrink-0" draggable={false} />;
}

export function DetailDrawerCategoryPill({ label }: TextProps) {
  return (
    <div
      className="relative isolate inline-flex items-center justify-center overflow-hidden px-3"
      style={{ width: 92, height: 28 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, rgba(130,110,34,0) 0%, rgba(102,76,1,0.2) 50%, rgba(102,76,1,0.6) 100%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "rgb(229,169,71)", opacity: 0.7 }} />
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "rgb(229,169,71)", opacity: 0.7 }} />
      <div
        className="absolute left-1.5 top-1/2 -translate-y-1/2"
        style={{ width: 4, height: 4, borderRadius: "50%", background: "rgb(229,169,71)" }}
      />
      <span
        className="relative z-10 truncate"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          color: "rgb(10,6,1)",
          lineHeight: "1",
          paddingLeft: 8,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function DetailDrawerSectionHeading({ label }: TextProps) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <h3
        className="w-full text-left"
        style={{
          fontFamily: "'Marcellus SC', serif",
          fontSize: "14px",
          lineHeight: "1.2",
          color: "rgb(109,115,126)",
        }}
      >
        {label}
      </h3>
      <div className="h-[0.922px] w-full overflow-hidden">
        <img
          src={sectionSeparator}
          alt=""
          className="block h-full max-w-none object-fill"
          style={{
            marginLeft: "-80px",
            width: "calc(100% + 80px)",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}

export function DetailDrawerTriggerTag({ label }: TextProps) {
  return (
    <div className="relative isolate inline-flex h-[43px] w-full max-w-full items-center overflow-hidden">
      <img
        src={triggerBrush}
        alt=""
        className="absolute left-0 top-0 h-[43px] w-[352px] max-w-none object-fill"
        draggable={false}
      />
      <span
        className="relative z-10 max-w-[calc(100%-24px)] truncate whitespace-nowrap text-[14px] text-white"
        style={{
          fontFamily: "'Marcellus', serif",
          lineHeight: "normal",
          marginLeft: 16,
          marginRight: 16,
          textShadow: "0px 0px 2px rgba(0,0,0,0.8)",
        }}
      >
        {label}
      </span>
    </div>
  );
}
