import splashLogo from "../../assets/splash-logo.png";
import bgImage from "../../assets/claude-skill-tree-bg.png";

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
          width: 9px;
          height: 7px;
          border-radius: 50%;
          background: linear-gradient(to bottom, rgb(255,255,255), rgb(136,73,0));
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
          left: "50%",
          transform: "translateX(-50%)",
          width: "58.9%",
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(212,153,44,0.4) 20%, rgba(212,153,44,0.4) 80%, transparent)",
        }} />

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
            <div className="splash-dot" />
            <div className="splash-dot" />
            <div className="splash-dot" />
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
          left: "50%",
          transform: "translateX(-50%)",
          width: "93.3%",
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(212,153,44,0.4) 10%, rgba(212,153,44,0.4) 90%, transparent)",
        }} />
      </div>
    </>
  );
}
