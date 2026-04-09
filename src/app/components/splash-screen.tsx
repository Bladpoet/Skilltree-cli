import splashLogo from "../../assets/splash-logo.png";
import bgImage from "../../assets/claude-skill-tree-bg.png";
import railDividerBrush from "../../assets/category-rail-divider-brush.svg";
import loadingDotBrush from "../../assets/loading-dot-brush.svg";

interface SplashScreenProps {
  contentVisible: boolean;
}

export function SplashScreen({ contentVisible }: SplashScreenProps) {
  return (
    <>
      <style>{`
        @keyframes splashDotPulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
        .splash-dot {
          width: 14px;
          height: 12px;
          animation: splashDotPulse 1.4s ease-in-out infinite;
        }
        .splash-dot:nth-child(2) { animation-delay: 0.2s; }
        .splash-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      {/* Background — stays mounted until parent unmounts this whole component */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 998 }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, #0a0500, #0e0900)",
        }} />
        <img
          src={bgImage}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Content — fades out independently */}
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        opacity: contentVisible ? 1 : 0,
        transition: "opacity 0.3s ease",
        pointerEvents: "none",
      }}>
        {/* Top border line */}
        <div style={{
          position: "absolute",
          top: "7.8%",
          left: 48,
          right: 48,
          height: "6px",
          overflow: "hidden",
          pointerEvents: "none",
        }}>
          <img src={railDividerBrush} alt="" style={{ display: "block", height: "100%", width: "100%", objectFit: "fill", opacity: 0.6 }} draggable={false} />
        </div>

        {/* Center content */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "-4%",
        }}>
          <img
            src={splashLogo}
            alt="Skill Tree Logo"
            style={{ width: 93, height: 140, objectFit: "contain" }}
          />
          <div style={{
            fontFamily: "'Albertus Nova', serif",
            fontWeight: 300,
            fontSize: 24,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            background: "linear-gradient(to bottom, rgb(194,137,21), rgb(136,73,0))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginTop: 16,
          }}>
            Skill Tree
          </div>
          <div style={{ display: "flex", gap: 11, marginTop: 24 }}>
            <img src={loadingDotBrush} alt="" className="splash-dot" draggable={false} />
            <img src={loadingDotBrush} alt="" className="splash-dot" draggable={false} />
            <img src={loadingDotBrush} alt="" className="splash-dot" draggable={false} />
          </div>
        </div>

        {/* Tagline */}
        <div style={{
          position: "absolute",
          bottom: "9.6%",
          width: "100%",
          textAlign: "center",
          fontFamily: "'Albertus Nova', serif",
          fontWeight: 300,
          fontSize: 16,
          color: "rgb(130,112,97)",
          letterSpacing: "0.02em",
        }}>
          All of your installed skills in one place
        </div>

        {/* Bottom border line */}
        <div style={{
          position: "absolute",
          bottom: "7%",
          left: 48,
          right: 48,
          height: "6px",
          overflow: "hidden",
          pointerEvents: "none",
        }}>
          <img src={railDividerBrush} alt="" style={{ display: "block", height: "100%", width: "100%", objectFit: "fill", opacity: 0.6 }} draggable={false} />
        </div>
      </div>
    </>
  );
}
