import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// - Countdown hook 
function useCountdown(targetDate) {
  const calc = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

// - Wedding date — change this
const WEDDING_DATE = "2026-07-30T18:00:00";
const WEDDING_DATE_DISPLAY = {
  day:     "30th",
  month:   "July",
  year:    "2026",
  weekday: "Thursday",
  time:    "6:00 PM",
};

// - Particle field 
function Particles() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {[...Array(28)].map((_, i) => {
        const size   = 1.5 + Math.random() * 3;
        const left   = Math.random() * 100;
        const delay  = Math.random() * 12;
        const dur    = 10 + Math.random() * 14;
        const drift  = (Math.random() - 0.5) * 60;
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${left}%`,
            bottom: "-10px",
            width:  size,
            height: size,
            borderRadius: "50%",
            background: i % 3 === 0
              ? "rgba(154,123,58,0.4)"
              : i % 3 === 1
              ? "rgba(122,92,30,0.25)"
              : "rgba(184,146,42,0.3)",
            animation: `std-float ${dur}s ${delay}s linear infinite`,
            "--drift": `${drift}px`,
          }} />
        );
      })}
    </div>
  );
}

// - Countdown unit 
function CountUnit({ value, label, delay }) {
  const ref = useRef();
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value && ref.current) {
      gsap.fromTo(ref.current,
        { y: -14, opacity: 0 },
        { y: 0,   opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
    prev.current = value;
  }, [value]);

  const padded = String(value).padStart(2, "0");

  return (
    <div className="std-unit" style={{ animationDelay: `${delay}s` }}>
      <div className="std-unit-box">
        <span className="std-unit-num" ref={ref}>{padded}</span>
      </div>
      <span className="std-unit-label">{label}</span>
    </div>
  );
}

// - Main component ─
export default function SaveTheDate({ visible = true }) {
  const sectionRef = useRef();
  const hasAnimated = useRef(false);
  const time = useCountdown(WEDDING_DATE);

  useEffect(() => {
    if (!visible || hasAnimated.current) return;
    hasAnimated.current = true;

    const tl = gsap.timeline({ delay: 0.1 });

    // Heart loader: pulse a few times, then fade the whole curtain out
    tl.to(".std-heart-svg", {
      scale: 1.12,
      duration: 0.4,
      ease: "power1.inOut",
      yoyo: true,
      repeat: 3,
    });

    tl.to(".std-curtain", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        const el = document.querySelector(".std-curtain");
        if (el) el.style.display = "none";
      },
    }, "+=0.2");

    // Ornament lines draw in
    tl.fromTo(".std-line-left",
      { scaleX: 0 },
      { scaleX: 1, duration: 0.9, ease: "power3.out", transformOrigin: "left" },
      "-=0.3"
    );
    tl.fromTo(".std-line-right",
      { scaleX: 0 },
      { scaleX: 1, duration: 0.9, ease: "power3.out", transformOrigin: "right" },
      "<"
    );

    tl.fromTo(".std-eyebrow",
      { opacity: 0, letterSpacing: "0.6em" },
      { opacity: 1, letterSpacing: "0.35em", duration: 1.0, ease: "power2.out" },
      "-=0.5"
    );
    tl.fromTo(".std-names",
      { opacity: 0, y: 40, filter: "blur(6px)" },
      { opacity: 1, y: 0,  filter: "blur(0px)", duration: 1.1, ease: "expo.out" },
      "-=0.5"
    );
    tl.fromTo(".std-date-pill",
      { opacity: 0, scale: 0.88 },
      { opacity: 1, scale: 1,    duration: 0.9, ease: "back.out(1.6)" },
      "-=0.4"
    );
    tl.fromTo(".std-details",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0,  duration: 0.8, ease: "power2.out" },
      "-=0.3"
    );
    tl.fromTo(".std-divider",
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.out", transformOrigin: "center" },
      "-=0.2"
    );
    tl.fromTo(".std-unit",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.4)", stagger: 0.1 },
      "-=0.2"
    );
    tl.fromTo(".std-flourish",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      "-=0.2"
    );

  }, [visible]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Cinzel:wght@400;500;600&family=EB+Garamond:ital,wght@1,400&display=swap');

        @keyframes std-float {
          0%   { transform: translateY(0)      translateX(0)          rotate(0deg);   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 0.6; }
          100% { transform: translateY(-105vh) translateX(var(--drift)) rotate(360deg); opacity: 0; }
        }

        @keyframes std-shimmer {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1;   }
        }

        @keyframes std-pulse-ring {
          0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.9); opacity: 0;   }
        }

        /* - Heart loader animations - */
        @keyframes heartTraceDraw {
          0%   { stroke-dashoffset: 340; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes heartFadeIn {
          0%, 70% { fill-opacity: 0; }
          100%    { fill-opacity: 1; }
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1);    }
          14%       { transform: scale(1.12); }
          28%       { transform: scale(1);    }
          42%       { transform: scale(1.07); }
          70%       { transform: scale(1);    }
        }
        @keyframes heartGlowPulse {
          0%, 100% { opacity: 0.25; r: 38; }
          50%       { opacity: 0.55; r: 48; }
        }
        @keyframes dotWave {
          0%, 100% { transform: scaleY(0.4); opacity: 0.35; }
          50%       { transform: scaleY(1);   opacity: 1;    }
        }
        @keyframes loaderTextFade {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1;   }
        }

        /* - Curtain overlay with heart loader - */
        .std-curtain {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, #f7efe2 0%, #fdf7ee 45%, #f2e8d5 100%);
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .std-heart-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
        }

        /* Soft radial glow behind heart */
        .std-heart-halo {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(198,167,105,0.28) 0%, transparent 70%);
          animation: heartGlowPulse 1.8s ease-in-out infinite;
        }

        .std-heart-svg {
          position: relative;
          z-index: 1;
          animation: heartBeat 1.8s ease-in-out infinite;
          transform-origin: center 55%;
          overflow: visible;
        }

        /* Stroke draw path */
        .std-heart-outline {
          fill: none;
          stroke: url(#heartGold);
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 340;
          stroke-dashoffset: 340;
          animation: heartTraceDraw 1.6s ease-out forwards;
        }

        /* Fill that appears after draw */
        .std-heart-fill {
          fill: url(#heartFill);
          fill-opacity: 0;
          animation: heartFadeIn 2s ease-out forwards;
        }

        /* Wave equalizer dots */
        .std-loader-dots {
          display: flex;
          align-items: center;
          gap: 5px;
          height: 20px;
        }
        .std-loader-bar {
          width: 3px;
          border-radius: 2px;
          background: linear-gradient(to top, #9a7b3a, #e8c870);
          transform-origin: bottom;
          animation: dotWave 1s ease-in-out infinite;
        }
        .std-loader-bar:nth-child(1) { height: 8px;  animation-delay: 0s;    }
        .std-loader-bar:nth-child(2) { height: 14px; animation-delay: 0.12s; }
        .std-loader-bar:nth-child(3) { height: 18px; animation-delay: 0.24s; }
        .std-loader-bar:nth-child(4) { height: 14px; animation-delay: 0.36s; }
        .std-loader-bar:nth-child(5) { height: 8px;  animation-delay: 0.48s; }

        .std-loader-label {
          font-family: 'Cinzel', serif;
          font-size: 0.54rem;
          letter-spacing: 0.3em;
          color: #9a7b3a;
          text-transform: uppercase;
          animation: loaderTextFade 1.8s ease-in-out infinite;
        }

        .std-root {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #fdf6ec;
          font-family: 'Cinzel', serif;
        }

        .std-bg-base {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 50% 30%, #f5ede0 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 20% 80%, #f0e6d3 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 70%, #f5ede0 0%, transparent 65%),
            #fdf6ec;
        }

        .std-bg-grain {
          position: absolute;
          inset: 0;
          opacity: 0.045;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        .std-bg-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 55% 55% at 50% 48%, rgba(198,147,42,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .std-corner {
          position: absolute;
          opacity: 0.28;
        }

        .std-line-left, .std-line-right {
          flex: 1;
          height: 1px;
          max-width: 90px;
          background: linear-gradient(90deg, transparent, rgba(198,167,105,0.6));
        }
        .std-line-right {
          background: linear-gradient(90deg, rgba(198,167,105,0.6), transparent);
        }

        .std-eyebrow {
          font-family: 'Cinzel', serif;
          font-size: clamp(0.66rem, 1.2vw, 0.68rem);
          font-weight: 600;
          letter-spacing: 0.2em;
          color: #c6a769;
          text-transform: uppercase;
          opacity: 0;
        }

        .std-names {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(3rem, 9vw, 6.5rem);
          letter-spacing: 0.04em;
          line-height: 1.05;
          text-align: center;
          opacity: 0;

          /* 🔥 GOLD GRADIENT TEXT */
          background: linear-gradient(
            120deg,
            #5a3a08 0%,
            #9a7b3a 15%,
            #e8c870 35%,
            #c6a769 50%,
            #e8c870 65%,
            #9a7b3a 85%,
            #5a3a08 100%
          );
          background-size: 200% auto;

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;

          /* 🔥 GOLD BORDER (KEY PART) */
          -webkit-text-stroke: 0.6px rgba(154,123,58,0.7);

          /* 🔥 DEPTH + GLOW */
          text-shadow:
            0 2px 4px rgba(0,0,0,0.15),
            0 4px 12px rgba(198,167,105,0.25),
            0 0 30px rgba(198,167,105,0.15);

          /* 🔥 SHIMMER ANIMATION */
          animation: std-gold-shimmer 5s linear infinite;
        }
        .std-names-amp {
          background: linear-gradient(135deg, #7a5010, #e8c870, #9a7b3a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 400;

          text-shadow:
            0 0 10px rgba(198,167,105,0.4);
        }

        .std-date-pill {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          border: 1px solid rgba(154,123,58,0.35);
          padding: 18px 44px;
          position: relative;
          opacity: 0;
          background: rgba(198,147,42,0.06);
          backdrop-filter: blur(4px);
        }
        .std-date-pill::before,
        .std-date-pill::after {
          content: '';
          position: absolute;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #9a7b3a;
          opacity: 0.6;
        }
        .std-date-pill::before { top: -3px; left: -3px; }
        .std-date-pill::after  { bottom: -3px; right: -3px; }

        .std-date-day {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
          font-size: clamp(3.5rem, 10vw, 6rem);
          color: #9a7b3a;
          line-height: 1;
          letter-spacing: -0.01em;
          animation: std-shimmer 3s ease-in-out infinite;
          text-shadow:
            0 0 40px rgba(198,167,105,0.3),
            0 2px 0 rgba(198,167,105,0.15);
        }
        .std-date-month {
          font-family: 'Cinzel', serif;
          font-size: clamp(0.65rem, 1.5vw, 0.85rem);
          letter-spacing: 0.18em;
          color: #7a5c1e;
          text-transform: uppercase;
          margin-top: -4px;
        }
        .std-date-year {
          font-family: 'Cinzel', serif;
          font-size: clamp(0.55rem, 1.2vw, 0.7rem);
          letter-spacing: 0.22em;
          color: #4a3010;
          margin-top: 2px;
        }

        .std-pulse-ring {
          position: absolute;
          top: 50%; left: 50%;
          width: 120px; height: 120px;
          border-radius: 50%;
          border: 1px solid rgba(154,123,58,0.25);
          animation: std-pulse-ring 2.8s ease-out infinite;
          pointer-events: none;
        }
        .std-pulse-ring:nth-child(2) { animation-delay: 1.4s; }

        .std-details {
          display: flex;
          align-items: center;
          gap: 16px;
          opacity: 0;
        }
        .std-detail-text {
          font-family: 'Cinzel', serif;
          font-size: clamp(0.66rem, 1.1vw, 0.65rem);
          letter-spacing: 0.25em;
          color: #7a5c1e;
          text-transform: uppercase;
        }
        .std-detail-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(154,123,58,0.4);
          flex-shrink: 0;
        }

        .std-divider {
          width: 180px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(154,123,58,0.5), transparent);
          opacity: 0;
          transform-origin: center;
          position: relative;
        }
        .std-divider::before {
          content: '◆';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-size: 6px;
          color: #9a7b3a;
          background: #fdf6ec;
          padding: 0 6px;
          letter-spacing: 0;
        }

        .std-countdown {
          display: flex;
          align-items: flex-start;
          gap: clamp(12px, 3vw, 28px);
        }

        .std-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
        }

        .std-unit-box {
          position: relative;
          width: clamp(64px, 12vw, 88px);
          height: clamp(64px, 12vw, 88px);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(154,123,58,0.25);
          background: rgba(198,167,105,0.07);
          backdrop-filter: blur(8px);
        }
        .std-unit-box::before,
        .std-unit-box::after {
          content: '';
          position: absolute;
          width: 8px; height: 8px;
          border-color: rgba(154,123,58,0.45);
          border-style: solid;
        }
        .std-unit-box::before {
          top: -1px; left: -1px;
          border-width: 1px 0 0 1px;
        }
        .std-unit-box::after {
          bottom: -1px; right: -1px;
          border-width: 0 1px 1px 0;
        }

        .std-unit-num {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          color: #1c140a;
          letter-spacing: 0.02em;
          line-height: 1;
          display: block;
        }

        .std-unit-label {
          font-family: 'Cinzel', serif;
          font-size: clamp(0.62rem, 0.9vw, 0.52rem);
          letter-spacing: 0.16em;
          color: #4a3010;
          text-transform: uppercase;
        }

        .std-colon {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          color: #7a5820;
          margin-top: clamp(14px, 3vw, 20px);
          line-height: 1;
          animation: std-shimmer 1s ease-in-out infinite;
        }

        .std-flourish {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(0.75rem, 1.6vw, 0.95rem);
          color: #5a3e14;
          letter-spacing: 0.12em;
          opacity: 0;
        }

        .std-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(20px, 3.5vh, 32px);
          padding: clamp(48px, 8vw, 80px) clamp(20px, 5vw, 60px);
          max-width: 760px;
          width: 100%;
          text-align: center;
        }

        .std-eyebrow-row {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          justify-content: center;
        }
      `}</style>

      <section className="std-root" ref={sectionRef} id="save-the-date">

        {/* - Heart loader curtain - */}
        <div className="std-curtain">
          {/* SVG gradient defs */}
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
              <linearGradient id="heartGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#9a7b3a" />
                <stop offset="40%"  stopColor="#e8c870" />
                <stop offset="70%"  stopColor="#c6a769" />
                <stop offset="100%" stopColor="#7a5c1e" />
              </linearGradient>
              <linearGradient id="heartFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#f0d078" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#c6a769" stopOpacity="0.12" />
              </linearGradient>
            </defs>
          </svg>

          <div className="std-heart-wrap">
            <div className="std-heart-halo" />
            {/* Heart SVG — standard heart path scaled to 80×80 viewBox */}
            <svg
              className="std-heart-svg"
              width="90"
              height="90"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Fill layer (fades in after draw) */}
              <path
                className="std-heart-fill"
                d="M50 85 C50 85 10 58 10 33 C10 18 22 8 35 8 C42 8 48 12 50 16 C52 12 58 8 65 8 C78 8 90 18 90 33 C90 58 50 85 50 85 Z"
              />
              {/* Outline draw layer */}
              <path
                className="std-heart-outline"
                d="M50 85 C50 85 10 58 10 33 C10 18 22 8 35 8 C42 8 48 12 50 16 C52 12 58 8 65 8 C78 8 90 18 90 33 C90 58 50 85 50 85 Z"
              />
            </svg>
          </div>

          {/* Wave bars */}
          <div className="std-loader-dots">
            <div className="std-loader-bar" />
            <div className="std-loader-bar" />
            <div className="std-loader-bar" />
            <div className="std-loader-bar" />
            <div className="std-loader-bar" />
          </div>

          <p className="std-loader-label">Loading</p>
        </div>

        {/* Background layers */}
        <div className="std-bg-base" />
        <div className="std-bg-grain" />
        <div className="std-bg-glow" />

        {/* Floating particles */}
        <Particles />

        {/* Corner ornaments */}
        {[
          // { top: 28, left: 28 },
          // { top: 28, right: 28, transform: "scaleX(-1)" },
          { bottom: 28, left: 28, transform: "scaleY(-1)" },
          { bottom: 28, right: 28, transform: "scale(-1,-1)" },
        ].map((s, i) => (
          <svg key={i} className="std-corner" width="48" height="48" viewBox="0 0 48 48" style={s}>
            <path d="M2 46 L2 2 L46 2" fill="none" stroke="#c6a769" strokeWidth="1" />
            <circle cx="2" cy="2" r="2" fill="#c6a769" />
            <circle cx="46" cy="2" r="1.5" fill="none" stroke="#c6a769" strokeWidth="1" />
          </svg>
        ))}

        {/* - Content - */}
        <div className="std-content">

          <div className="std-eyebrow-row">
            <div className="std-line-left" />
            <span className="std-eyebrow">Save the Date</span>
            <div className="std-line-right" />
          </div>

          <h1 className="std-names">
            Thiloka <br /><span className="std-names-amp">&amp;</span> <br /> Devin
          </h1>

          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <div className="std-pulse-ring" />
            <div className="std-pulse-ring" />
            <div className="std-date-pill">
              <span className="std-date-day">{WEDDING_DATE_DISPLAY.day}</span>
              <span className="std-date-month">{WEDDING_DATE_DISPLAY.month}</span>
              <span className="std-date-year">{WEDDING_DATE_DISPLAY.year}</span>
            </div>
          </div>

          <div className="std-details">
            <span className="std-detail-text">{WEDDING_DATE_DISPLAY.weekday}</span>
            <div className="std-detail-dot" />
            <span className="std-detail-text">{WEDDING_DATE_DISPLAY.time}</span>
          </div>

          <div className="std-divider" />

          <div className="std-countdown">
            <CountUnit value={time.days}    label="Days"    delay={0}   />
            <span className="std-colon">:</span>
            <CountUnit value={time.hours}   label="Hours"   delay={0.1} />
            <span className="std-colon">:</span>
            <CountUnit value={time.minutes} label="Minutes" delay={0.2} />
            <span className="std-colon">:</span>
            <CountUnit value={time.seconds} label="Seconds" delay={0.3} />
          </div>

          <p className="std-flourish">Together forever begins here</p>

        </div>
      </section>
    </>
  );
}