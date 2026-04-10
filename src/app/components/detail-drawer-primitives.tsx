import type { CSSProperties } from "react";

import drawerEdge from "../../assets/drawer-edge-brush.svg";
import categoryTagStroke from "../../assets/drawer-category-tag-stroke.svg";
import sectionSeparator from "../../assets/drawer-section-separator.svg";
import triggerBrush from "../../assets/drawer-trigger-brush.svg";

import closeIcon from "../../assets/close-icon.svg";
import copyIconSrc from "../../assets/copy-icon.svg";
import checkIcon from "../../assets/check-icon.svg";
import hoverDecoration from "../../assets/hover-decoration.svg";

interface TextProps {
  label: string;
}

interface MaskIconProps {
  src: string;
  color: string;
  className?: string;
  style?: CSSProperties;
}

function MaskIcon({ src, color, className, style }: MaskIconProps) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        ...style,
      }}
    />
  );
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
        className="absolute inset-1 transition-opacity duration-200"
        style={{ opacity: isHovered ? 1 : 0 }}
        draggable={false}
      />
      <MaskIcon src={closeIcon} color={iconColor} className="absolute inset-0 h-full w-full" />
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
    <div className="relative h-8 w-8 shrink-0">
      <img
        src={hoverDecoration}
        alt=""
        className="absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: isHovered ? 1 : 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
        }}
        draggable={false}
      />
      <MaskIcon
        src={copied ? checkIcon : copyIconSrc}
        color={iconColor}
        className="absolute h-4 w-4"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      />
    </div>
  );
}

export function DetailDrawerCategoryPill({ label }: TextProps) {
  return (
    <div className="relative isolate inline-flex max-w-full items-center justify-center px-4 py-[6px]">
      <img
        src={categoryTagStroke}
        alt=""
        className="pointer-events-none absolute inset-x-0 bottom-[-2px] h-8 w-full max-w-none object-fill"
        draggable={false}
      />
      <span
        className="relative z-10 whitespace-nowrap"
        style={{
          fontFamily: "'Albertus Nova', serif",
          fontSize: "12px",
          fontWeight: 700,
          color: "#0A0601",
          lineHeight: "16px",
          letterSpacing: "0.72px",
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
          fontWeight: 300,
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
