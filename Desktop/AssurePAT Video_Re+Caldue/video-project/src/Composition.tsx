import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
  Img,
  Sequence,
  interpolate,
  spring,
} from "remotion";
import { SCENES, VIDEO_CONFIG, SceneConfig } from "./config";

// ═══════════════════════════════════════════════════════════════
// Background — Discover (blue) + Diners (grey) cards, low opacity, moving
// ═══════════════════════════════════════════════════════════════
const BackgroundCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const drift = (frame / durationInFrames) * 200;
  const sway = Math.sin(frame * 0.003) * 15;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #0A0F1A 0%, #101825 40%, #141B2D 100%)",
        }}
      />

      {/* Discover card — blue/teal */}
      <div
        style={{
          position: "absolute",
          right: -80 + sway,
          top: -40 - drift * 0.15,
          width: 520,
          height: 330,
          borderRadius: 20,
          background: "linear-gradient(135deg, #00A4C7 0%, #0088A8 40%, #006680 100%)",
          opacity: 0.06,
          transform: `rotate(-12deg) translateY(${sway * 0.5}px)`,
          boxShadow: "0 0 80px rgba(0,164,199,0.08)",
        }}
      >
        <div style={{ position: "absolute", top: 70, left: 50, width: 48, height: 36, borderRadius: 6, background: "rgba(255,255,255,0.15)" }} />
        <div style={{ position: "absolute", bottom: 40, right: 40, fontSize: 28, fontWeight: 800, color: "rgba(255,255,255,0.2)", letterSpacing: 3 }}>
          DISCOVER
        </div>
        <div style={{ position: "absolute", bottom: 90, left: 50, display: "flex", gap: 16 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ width: 50, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.12)" }} />
          ))}
        </div>
      </div>

      {/* Diners card — grey */}
      <div
        style={{
          position: "absolute",
          left: -100 - sway,
          bottom: -60 + drift * 0.12,
          width: 480,
          height: 300,
          borderRadius: 20,
          background: "linear-gradient(135deg, #4A4A5A 0%, #3A3A48 40%, #2A2A36 100%)",
          opacity: 0.05,
          transform: `rotate(8deg) translateY(${-sway * 0.3}px)`,
          boxShadow: "0 0 80px rgba(74,74,90,0.06)",
        }}
      >
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex" }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)" }} />
          <div style={{ width: 70, height: 70, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)", marginLeft: -30 }} />
        </div>
        <div style={{ position: "absolute", bottom: 30, left: 40, fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.15)", letterSpacing: 2 }}>
          DINERS CLUB
        </div>
      </div>

      {/* Third card echo */}
      <div
        style={{
          position: "absolute",
          left: "40%",
          top: "60%",
          width: 400,
          height: 250,
          borderRadius: 18,
          background: "linear-gradient(135deg, #00A4C7, #006680)",
          opacity: 0.025,
          transform: `rotate(${3 + sway * 0.1}deg)`,
        }}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Scene Image — Screenshot with Ken Burns zoom + offset based on text side
// ═══════════════════════════════════════════════════════════════
const SceneImage: React.FC<{ scene: SceneConfig }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  if (!scene.image) return null;

  const { x, y, startScale, endScale } = scene.zoom;

  const scale = interpolate(frame, [0, durationInFrames], [startScale, endScale], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const entrance = spring({ frame, fps, config: { damping: 200, mass: 1.2 } });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideY = interpolate(entrance, [0, 1], [15, 0]);

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const originX = x * 100;
  const originY = y * 100;
  const isMobile = scene.platform === "mobile";

  // Offset image away from text side
  let imageOffset = 0;
  if (scene.textSide === "left") imageOffset = 120; // shift image right
  if (scene.textSide === "right") imageOffset = -120; // shift image left

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        opacity: opacity * exitOpacity,
        transform: `translateY(${slideY}px) translateX(${imageOffset}px)`,
      }}
    >
      <div
        style={{
          width: isMobile ? 380 : 1340,
          height: isMobile ? 680 : 740,
          borderRadius: isMobile ? 24 : 12,
          overflow: "hidden",
          boxShadow: isMobile
            ? "none"
            : "0 20px 80px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)",
          border: isMobile ? "none" : "1px solid rgba(255,255,255,0.06)",
          position: "relative",
        }}
      >
        <Img
          src={staticFile(`screens/${scene.image}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: isMobile ? "cover" : "contain",
            transform: `scale(${scale})`,
            transformOrigin: `${originX}% ${originY}%`,
          }}
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Intro/Closing Scene — Logo + word-by-word overlay
// ═══════════════════════════════════════════════════════════════
const BrandScene: React.FC<{ scene: SceneConfig }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const isIntro = scene.id === "intro";
  const words = scene.overlayWords || [];

  // Logo entrance
  const logoSpring = spring({ frame, fps, config: { damping: 200, mass: 1 } });
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);
  const logoScale = interpolate(logoSpring, [0, 1], [0.8, 1]);

  // Title entrance
  const titleSpring = spring({ frame: frame - 8, fps, config: { damping: 200, mass: 0.8 } });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleY = interpolate(titleSpring, [0, 1], [15, 0]);

  // Accent line
  const lineWidth = interpolate(titleSpring, [0, 1], [0, 160]);

  // Subtitle
  const subSpring = spring({ frame: frame - 15, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subSpring, [0, 1], [0, 1]);

  // Word-by-word overlay: stagger each word (start at frame 30, 20 frames apart)
  const wordStartOffset = 30;
  const wordGap = 20;

  // Exit fade
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5,
        opacity: exitOpacity,
      }}
    >
      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 20,
        }}
      >
        <Img
          src={staticFile("Assure-pat-logo/assure-logo.png")}
          style={{ width: 80, height: 80, objectFit: "contain" }}
        />
      </div>

      {/* Title: "Assure" + "ssure" styling */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 800,
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: 3,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          display: "flex",
          alignItems: "baseline",
          gap: 6,
        }}
      >
        <span style={{ color: "#FF6B35" }}>A</span>
        <span>ssure</span>
        <span style={{ marginLeft: 12, color: "rgba(255,255,255,0.5)", fontSize: 28, fontWeight: 400, letterSpacing: 2 }}>
          {isIntro ? "Payment Acceptance Testing" : "PAT"}
        </span>
      </div>

      {/* Accent line */}
      <div
        style={{
          width: lineWidth,
          height: 3,
          background: "linear-gradient(90deg, #FF6B35, #00A4C7)",
          marginTop: 14,
          marginBottom: 24,
          borderRadius: 2,
        }}
      />

      {/* Word-by-word overlay */}
      <div style={{ display: "flex", gap: 30, marginTop: 10 }}>
        {words.map((word, i) => {
          const wordStart = wordStartOffset + wordGap * i;
          const wordSpring = spring({
            frame: frame - wordStart,
            fps,
            config: { damping: 14, mass: 0.8, stiffness: 120 },
          });
          const wordOpacity = interpolate(wordSpring, [0, 1], [0, 1]);
          const wordY = interpolate(wordSpring, [0, 1], [20, 0]);

          return (
            <div
              key={word}
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#FFFFFF",
                letterSpacing: 2,
                opacity: wordOpacity,
                transform: `translateY(${wordY}px)`,
                padding: "8px 20px",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 6,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              {word}
            </div>
          );
        })}
      </div>

      {/* Subtitle for closing */}
      {!isIntro && (
        <div
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.5)",
            fontWeight: 300,
            letterSpacing: 1.5,
            opacity: subOpacity,
            marginTop: 30,
          }}
        >
          Move Faster — With Confidence
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Text Overlay — Headline + Subline on left/right side
// ═══════════════════════════════════════════════════════════════
const TextOverlay: React.FC<{ scene: SceneConfig }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 200, mass: 0.8 },
  });
  const headlineOpacity = interpolate(headlineSpring, [0, 1], [0, 1]);
  const headlineY = interpolate(headlineSpring, [0, 1], [12, 0]);

  const sublineSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 200 },
  });
  const sublineOpacity = interpolate(sublineSpring, [0, 1], [0, 1]);

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const isRight = scene.textSide === "right";
  const slideX = interpolate(headlineSpring, [0, 1], [isRight ? 30 : -30, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        [isRight ? "right" : "left"]: 0,
        width: 420,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 50px",
        zIndex: 5,
        opacity: exitOpacity,
      }}
    >
      {/* Dark scrim */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isRight
            ? "linear-gradient(to left, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)"
            : "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)",
          zIndex: -1,
        }}
      />

      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
          opacity: headlineOpacity,
          transform: `translateX(${slideX}px) translateY(${headlineY}px)`,
          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          textAlign: isRight ? "right" : "left",
        }}
      >
        {scene.headline}
      </div>

      <div
        style={{
          width: interpolate(headlineSpring, [0, 1], [0, 80]),
          height: 2,
          background: "linear-gradient(90deg, #FF6B35, #00A4C7)",
          marginTop: 10,
          marginBottom: 10,
          borderRadius: 1,
          alignSelf: isRight ? "flex-end" : "flex-start",
        }}
      />

      <div
        style={{
          fontSize: 16,
          color: "rgba(255,255,255,0.7)",
          fontWeight: 400,
          letterSpacing: 1,
          opacity: sublineOpacity,
          textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          textAlign: isRight ? "right" : "left",
        }}
      >
        {scene.subline}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Individual Scene — routes to brand scene or image+text scene
// ═══════════════════════════════════════════════════════════════
const Scene: React.FC<{ scene: SceneConfig }> = ({ scene }) => {
  const isBrand = scene.id === "intro" || scene.id === "closing";

  if (isBrand) {
    return (
      <div style={{ position: "absolute", inset: 0 }}>
        <BrandScene scene={scene} />
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <SceneImage scene={scene} />
      <TextOverlay scene={scene} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Main Composition
// ═══════════════════════════════════════════════════════════════
export const AssurePATWalkthrough: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <div
      style={{
        width: VIDEO_CONFIG.width,
        height: VIDEO_CONFIG.height,
        position: "relative",
        overflow: "hidden",
        background: "#0A0F1A",
      }}
    >
      {/* Background cards layer */}
      <BackgroundCards />

      {/* Each scene at its exact start frame */}
      {SCENES.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
        >
          <Scene scene={scene} />
        </Sequence>
      ))}

      {/* Voiceover — Liam voice */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/Liam_voiceover.mp3")} volume={1} />
      </Sequence>

      {/* Background music — looped (29s track repeated across 157s video) */}
      <Sequence from={0}>
        <Audio
          src={staticFile("audio/new_bgm.mp3")}
          loop
          volume={(f) =>
            interpolate(
              f,
              [0, 60, durationInFrames - 90, durationInFrames],
              [0, 0.08, 0.08, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          }
        />
      </Sequence>

      {/* Bottom progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 3,
          width: `${(frame / durationInFrames) * 100}%`,
          background: "linear-gradient(90deg, #FF6B35, #00A4C7)",
          boxShadow: "0 0 12px rgba(255,107,53,0.3)",
          zIndex: 100,
        }}
      />
    </div>
  );
};
