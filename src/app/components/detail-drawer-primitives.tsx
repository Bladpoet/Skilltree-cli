import drawerEdge from "../../assets/drawer-edge-brush.svg";
import sectionSeparator from "../../assets/drawer-section-separator.svg";
import sourceGlyph from "../../assets/pencil-exported/9L2EO.png";
import triggerBrush from "../../assets/drawer-trigger-brush.svg";

import closeIcon from "../../assets/close-icon.svg";
import copyIconSrc from "../../assets/copy-icon.svg";
import checkIcon from "../../assets/check-icon.svg";
import hoverDecoration from "../../assets/hover-decoration.svg";

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

interface CloseButtonProps {
  isHovered: boolean;
}

interface CopyIconProps {
  isHovered: boolean;
  copied: boolean;
}

export function DetailDrawerCloseButton({ isHovered }: CloseButtonProps) {
  const iconColor = isHovered ? "#282521" : "#635949";
  return (
    <div className="relative h-8 w-8 shrink-0">
      <img
        src={hoverDecoration}
        alt=""
        className="absolute inset-0 transition-opacity duration-200"
        style={{ opacity: isHovered ? 1 : 0 }}
        draggable={false}
      />
      <img
        src={closeIcon}
        alt=""
        className="absolute inset-0 h-full w-full"
        style={{ color: iconColor }}
        draggable={false}
      />
    </div>
  );
}

export function DetailDrawerCopyIcon({ isHovered, copied }: CopyIconProps) {
  let iconColor = "#7E766D";
  if (copied) {
    iconColor = "#494542";
  } else if (isHovered) {
    iconColor = "#282521";
  }

  return (
    <div className="relative h-4 w-4 shrink-0">
      <img
        src={hoverDecoration}
        alt=""
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
        style={{ 
          opacity: isHovered ? 1 : 0,
          width: 16,
          height: "auto"
        }}
        draggable={false}
      />
      <img
        src={copied ? checkIcon : copyIconSrc}
        alt=""
        className="absolute inset-0 h-full w-full"
        style={{ color: iconColor }}
        draggable={false}
      />
    </div>
  );
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
          fontFamily: "'Albertus Nova', serif",
          fontSize: "12px",
          fontWeight: 700,
          color: "#0A0601",
          lineHeight: "1",
          letterSpacing: "0.72px", /* 6% of 12px */
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
          fontFamily: "'Albertus Nova', serif",
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "1.2",
          color: "#7E766D",
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
    <div className="relative isolate inline-flex h-[43px] w-[304px] max-w-full items-center overflow-hidden">
      <img
        src={triggerBrush}
        alt=""
        className="absolute left-[-24px] top-0 h-[43px] w-[352px] max-w-none object-fill"
        draggable={false}
      />
      <span
        className="relative z-10 max-w-[calc(100%-24px)] truncate whitespace-nowrap text-[14px] text-white"
        style={{
          fontFamily: "'Albertus Nova', serif",
          fontWeight: 400,
          lineHeight: "normal",
          marginLeft: 16,
          marginRight: 16,
          filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.5))",
        }}
      >
        {label}
      </span>
    </div>
  );
}
