import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Timeline events ───────────────────────────────────────────────────────────
const TIMELINE = [
  {
    time:  "6:15 PM",
    title: "Poruwa Ceremony",
    note:  "Guests are kindly requested to be seated by 6:00 PM",
    icon:  "rings",
    side:  "right",
  },
  {
    time:  "7:00 PM",
    title: "Celebration Commencement",
    note:  "The evening festivities officially begin",
    icon:  "sparkle",
    side:  "left",
  },
  {
    time:  "8:30 PM",
    title: "Dinner Buffet",
    note:  "A curated spread of flavours awaits",
    icon:  "dinner",
    side:  "right",
  },
  {
    time:  "8:45 PM",
    title: "Dance Floor Opens",
    note:  "Join us on the floor for the night's first dance",
    icon:  "music",
    side:  "left",
  },
  {
    time:  "11:30 PM",
    title: "Farewell",
    note:  "Thank you for sharing this moment with us",
    icon:  "close",
    side:  "right",
  },
];

const DETAILS = [
  { label: "Date",     value: "Thursday, 30 July 2026" },
  { label: "RSVP by", value: "01 July 2026" },
];

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const ICONS = {
  rings: (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
      <circle cx="11" cy="16" r="7"  stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="21" cy="16" r="7"  stroke="currentColor" strokeWidth="1.8"/>
      <path d="M14.5 13 Q16 10.5 17.5 13" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  sparkle: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L13.5 9 L20 10.5 L13.5 12 L12 19 L10.5 12 L4 10.5 L10.5 9 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  dinner: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>
  ),
  music: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
};

// ── Card content ──────────────────────────────────────────────────────────────
function CardInner({ item }) {
  return (
    <>
      <div className="tl-card-top-line" />
      {/* Time shown inside card on mobile only */}
      <div className="tl-mobile-time">
        <span className="tl-time">{item.time}</span>
      </div>
      <span className="tl-card-venue">{item.venue}</span>
      <h4 className="tl-card-title">{item.title}</h4>
      <div className="tl-card-divider" />
      <p className="tl-card-note">{item.note}</p>
    </>
  );
}

// ── Single timeline row ───────────────────────────────────────────────────────
function TimelineItem({ item, index }) {
  const cardRef = useRef();
  const isRight = item.side === "right";

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(card,
      { opacity: 0, x: isRight ? 36 : -36, filter: "blur(3px)" },
      {
        opacity: 1, x: 0, filter: "blur(0px)",
        duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 87%" },
      }
    );
    gsap.fromTo(`.tl-dot-${index}`,
      { scale: 0, opacity: 0 },
      {
        scale: 1, opacity: 1,
        duration: 0.5, ease: "back.out(2.2)",
        scrollTrigger: { trigger: card, start: "top 87%" },
      }
    );
  }, []);

  return (
    <div className={`tl-row ${isRight ? "tl-row--right" : "tl-row--left"}`}>

      {/* ── Left column: time (if card is right) OR card (if card is left) ── */}
      <div className="tl-col tl-col--left">
        {isRight ? (
          <div className="tl-timestamp tl-timestamp--left">
            <span className="tl-time">{item.time}</span>
            <div className="tl-time-dash" />
          </div>
        ) : (
          <div className="tl-card tl-card--left" ref={cardRef}>
            <CardInner item={item} />
          </div>
        )}
      </div>

      {/* ── Centre dot ── */}
      <div className="tl-centre">
        <div className={`tl-dot tl-dot-${index}`}>
          <div className="tl-dot-ring" />
          <span className="tl-dot-icon">{ICONS[item.icon]}</span>
        </div>
      </div>

      {/* ── Right column: card (if card is right) OR time (if card is left) ── */}
      <div className="tl-col tl-col--right">
        {isRight ? (
          <div className="tl-card tl-card--right" ref={cardRef}>
            <CardInner item={item} />
          </div>
        ) : (
          <div className="tl-timestamp tl-timestamp--right">
            <div className="tl-time-dash" />
            <span className="tl-time">{item.time}</span>
          </div>
        )}
      </div>

    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function EventDetails() {

  useEffect(() => {
    gsap.fromTo(".ed-eyebrow-row",
      { opacity: 0 },
      { opacity: 1, duration: 1.0, ease: "power2.out",
        scrollTrigger: { trigger: ".ed-eyebrow-row", start: "top 88%" } }
    );
    gsap.fromTo(".ed-section-title",
      { opacity: 0, y: 28, filter: "blur(5px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: ".ed-section-title", start: "top 88%" } }
    );
    gsap.fromTo(".ed-section-sub",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
        scrollTrigger: { trigger: ".ed-section-sub", start: "top 90%" } }
    );
    // Spine draws down as you scroll
    gsap.fromTo(".tl-spine-fill",
      { scaleY: 0 },
      {
        scaleY: 1, ease: "none", transformOrigin: "top",
        scrollTrigger: {
          trigger: ".tl-container",
          start: "top 75%",
          end: "bottom 60%",
          scrub: 0.6,
        },
      }
    );
    gsap.fromTo(".ed-facts-strip",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
        scrollTrigger: { trigger: ".ed-facts-strip", start: "top 100%", once: true } }
    );
    gsap.fromTo(".ed-fact",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.12,
        scrollTrigger: { trigger: ".ed-facts-strip", start: "top 100%", once: true } }
    );
    gsap.fromTo(".ed-bottom-flourish",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: ".ed-bottom-flourish", start: "top 100%", once: true } }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,300;1,400;1,600&family=Cinzel:wght@400;600;700&display=swap');

        /* ─── Section root ─── */
        .ed-root {
          position: relative;
          width: 100%;
          padding: clamp(72px, 12vh, 120px) clamp(20px, 6vw, 80px);
          background: #fdf6ec;
          font-family: 'Cinzel', serif;
          overflow: hidden;
        }
        .ed-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 50% at 50% 0%,   #f5ede0 0%, transparent 65%),
            radial-gradient(ellipse 50% 60% at 10% 100%, #f0e6d3 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 90% 60%,  #f5ede0 0%, transparent 55%),
            #fdf6ec;
        }
        .ed-bg-grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }
        .ed-corner-svg { position: absolute; opacity: 0.2; }

        /* ─── Header ─── */
        .ed-header { text-align: center; margin-bottom: clamp(52px, 9vh, 80px); }
        .ed-eyebrow-row {
          display: flex; align-items: center; justify-content: center;
          gap: 14px; margin-bottom: 18px; opacity: 0;
        }
        .ed-eyebrow-line { height: 1px; width: 70px; flex-shrink: 0; }
        .ed-eyebrow-line--left  { background: linear-gradient(90deg, transparent, rgba(154,123,58,0.55)); z-index:50; }
        .ed-eyebrow-line--right { background: linear-gradient(90deg, rgba(154,123,58,0.55), transparent); z-index:50; }
        .ed-eyebrow-text {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em;
          color: #7a5820; text-transform: uppercase; white-space: nowrap;
          z-index:50;
        }
        .ed-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-weight: 300;
          font-size: clamp(2.4rem, 6vw, 4rem);
          color: #0d0905; letter-spacing: 0.04em;
          line-height: 1.1; margin: 0 0 12px; opacity: 0;
        }
        .ed-section-sub {
          font-size: 0.65rem; font-weight: 600; letter-spacing: 0.18em;
          color: #5a3e14; text-transform: uppercase; opacity: 0;
        }

        /* ════════════════════
           TIMELINE
        ════════════════════ */
        .tl-container {
          position: relative;
          max-width: 880px;
          margin: 0 auto clamp(52px, 9vh, 80px);
        }

        /* Vertical spine */
        .tl-spine {
          position: absolute;
          left: 50%; top: 0; bottom: 0;
          transform: translateX(-50%);
          width: 1px;
          pointer-events: none;
          overflow: hidden;
        }
        .tl-spine-fill {
          width: 100%; height: 100%;
          background: linear-gradient(to bottom,
            transparent 0%,
            rgba(154,123,58,0.28) 6%,
            rgba(154,123,58,0.42) 50%,
            rgba(154,123,58,0.28) 94%,
            transparent 100%);
        }

        /* ─── Row ─── */
        .tl-row {
          display: grid;
          grid-template-columns: 1fr 56px 1fr;
          align-items: center;
          margin-bottom: clamp(28px, 5.5vh, 50px);
        }
        .tl-row:last-child { margin-bottom: 0; }

        /* ─── Columns ─── */
        .tl-col { min-width: 0; }
        .tl-col--left  { padding-right: clamp(14px, 2.5vw, 30px); }
        .tl-col--right { padding-left:  clamp(14px, 2.5vw, 30px); }

        /* ─── Time stamp ─── */
        .tl-timestamp {
          display: flex; align-items: center; gap: 10px;
        }
        .tl-timestamp--left  { justify-content: flex-end; }
        .tl-timestamp--right { justify-content: flex-start; }

        .tl-time {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(1.05rem, 2.3vw, 1.45rem);
          font-weight: 600;
          color: #9a7b3a;
          letter-spacing: 0.04em;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .tl-time-dash {
          flex: 1; max-width: 40px; height: 1px;
          background: linear-gradient(90deg, rgba(154,123,58,0.35), transparent);
        }
        .tl-timestamp--right .tl-time-dash {
          background: linear-gradient(90deg, transparent, rgba(154,123,58,0.35));
        }

        /* ─── Centre dot ─── */
        .tl-centre {
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 5;
        }
        .tl-dot {
          width: 50px; height: 50px; border-radius: 50%;
          background: #fdf6ec;
          border: 1px solid rgba(154,123,58,0.25);
          display: flex; align-items: center; justify-content: center;
          position: relative;
          color: #9a7b3a;
          box-shadow:
            0 0 0 6px #fdf6ec,
            0 0 0 7px rgba(154,123,58,0.15),
            0 4px 20px rgba(154,123,58,0.1);
          transition: box-shadow 0.35s ease, color 0.35s ease;
        }
        .tl-dot:hover {
          color: #7a5820;
          box-shadow:
            0 0 0 6px #fdf6ec,
            0 0 0 7px rgba(154,123,58,0.38),
            0 6px 28px rgba(154,123,58,0.18);
        }
        /* Pulse ring on hover */
        .tl-dot-ring {
          position: absolute; inset: -8px; border-radius: 50%;
          border: 1px solid rgba(154,123,58,0);
          transition: border-color 0.35s ease;
          pointer-events: none;
        }
        .tl-dot:hover .tl-dot-ring {
          border-color: rgba(154,123,58,0.2);
        }
        .tl-dot-icon {
          display: flex; align-items: center; justify-content: center;
          line-height: 0;
        }

        /* ─── Card ─── */
        .tl-card {
          position: relative;
          background: rgba(255,255,255,0.62);
          border: 1px solid rgba(154,123,58,0.2);
          padding: clamp(18px, 2.5vw, 26px) clamp(16px, 2vw, 22px);
          opacity: 0;
          box-shadow:
            0 4px 24px rgba(154,123,58,0.07),
            0 1px  6px rgba(154,123,58,0.04);
          transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
        }
        .tl-card:hover {
          border-color: rgba(154,123,58,0.38);
          box-shadow: 0 8px 32px rgba(154,123,58,0.12), 0 2px 8px rgba(154,123,58,0.07);
          transform: translateY(-2px);
        }

        /* Top accent */
        .tl-card-top-line {
          position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
          background: linear-gradient(90deg, transparent, #9a7b3a 35%, #c6a769 50%, #9a7b3a 65%, transparent);
        }

        /* Pointer arrow toward spine */
        .tl-card--right::before {
          content: '';
          position: absolute;
          left: -7px; top: 50%; transform: translateY(-50%);
          border-style: solid;
          border-width: 6px 7px 6px 0;
          border-color: transparent rgba(154,123,58,0.22) transparent transparent;
        }
        .tl-card--left::before {
          content: '';
          position: absolute;
          right: -7px; top: 50%; transform: translateY(-50%);
          border-style: solid;
          border-width: 6px 0 6px 7px;
          border-color: transparent transparent transparent rgba(154,123,58,0.22);
        }

        .tl-card-venue {
          display: block;
          font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.18em; color: #7a5820;
          text-transform: uppercase; margin-bottom: 6px;
        }
        .tl-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
          font-size: clamp(1rem, 2.1vw, 1.22rem);
          color: #1c140a; letter-spacing: 0.02em;
          line-height: 1.25; margin: 0 0 10px;
        }
        .tl-card-divider {
          height: 1px; margin-bottom: 10px;
          background: linear-gradient(90deg, rgba(154,123,58,0.25), transparent);
        }
        .tl-card--left .tl-card-divider {
          background: linear-gradient(90deg, transparent, rgba(154,123,58,0.25));
        }
        .tl-card-note {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(0.82rem, 1.6vw, 0.95rem);
          color: #3d2a08; letter-spacing: 0.03em;
          line-height: 1.6; margin: 0;
        }

        /* ─── Facts strip ─── */
        .ed-facts-strip {
          max-width: 560px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(2, 1fr);
          border: 1px solid rgba(154,123,58,0.2);
          background: rgba(255,255,255,0.4);
          position: relative;
          box-shadow: 0 2px 16px rgba(154,123,58,0.05);
          /* Never permanently hidden — GSAP will animate from 0 to 1 */
        }
        .ed-facts-strip::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 1.5px;
          background: linear-gradient(90deg, transparent, #9a7b3a 20%, #c6a769 50%, #9a7b3a 80%, transparent);
        }
        .ed-fact {
          display: flex; flex-direction: column;
          align-items: center; gap: 7px;
          padding: clamp(20px, 3vw, 30px) 20px;
          border-right: 1px solid rgba(154,123,58,0.12);
          text-align: center;
          transition: background 0.3s ease;
        }
        .ed-fact:last-child { border-right: none; }
        .ed-fact:hover { background: rgba(198,167,105,0.05); }
        .ed-fact-label {
          font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.16em; color: #7a5820; text-transform: uppercase;
        }
        .ed-fact-diamond { font-size: 6px; color: rgba(154,123,58,0.45); }
        .ed-fact-value {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: clamp(0.9rem, 1.8vw, 1.05rem);
          color: #1c140a; letter-spacing: 0.04em; line-height: 1.4;
        }

        /* ─── Flourish ─── */
        .ed-bottom-flourish {
          text-align: center; margin-top: clamp(48px, 8vh, 64px);
          display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .ed-bottom-rule {
          width: 160px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(154,123,58,0.4), transparent);
        }
        .ed-diamonds { font-size: 7px; color: #8a6a2a; letter-spacing: 10px; }
        .ed-bottom-text {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: clamp(0.82rem, 1.5vw, 0.95rem);
          color: #5a3e14; letter-spacing: 0.1em;
        }

        /* ─── Mobile ─── */
        @media (max-width: 580px) {

          /* Spine moves to left edge */
          .tl-container { padding-left: 8px; }
          .tl-spine { left: 23px; transform: none; }

          /* Two-col layout: [dot] [content] */
          .tl-row {
            grid-template-columns: 46px 1fr !important;
            align-items: flex-start;
            margin-bottom: clamp(20px, 4vh, 36px);
          }

          /* Dot always in first column */
          .tl-centre { justify-content: center; padding-top: 12px; }

          /* For right-side rows: left col (timestamp) hidden, right col (card) shown */
          .tl-row--right .tl-col--left { display: none; }
          .tl-row--right .tl-col--right { padding-left: 14px; padding-right: 0; }

          /* For left-side rows: right col (timestamp) hidden, left col (card) shown
             — but left col is first in DOM so we swap it to appear after dot */
          .tl-row--left {
            grid-template-areas: "dot card";
          }
          .tl-row--left .tl-col--left {
            grid-area: card;
            display: block;
            padding-left: 14px;
            padding-right: 0;
          }
          .tl-row--left .tl-col--right { display: none; }

          /* Remove side arrows on mobile */
          .tl-card--right::before,
          .tl-card--left::before { display: none; }

          /* Show the time inside each card on mobile */
          .tl-mobile-time { display: flex; align-items: center; margin-bottom: 8px; }
          .tl-mobile-time .tl-time { font-size: clamp(0.95rem, 4vw, 1.15rem); }
        }

        /* Hide mobile-time on desktop */
        .tl-mobile-time { display: none; }
      `}</style>

      <section className="ed-root" id="details">
        <div className="ed-bg" />
        <div className="ed-bg-grain" />

        {[
          { top: 28, left: 28 },
          { top: 28, right: 28, transform: "scaleX(-1)" },
          { bottom: 28, left: 28, transform: "scaleY(-1)" },
          { bottom: 28, right: 28, transform: "scale(-1,-1)" },
        ].map((s, i) => (
          <svg key={i} className="ed-corner-svg" width="44" height="44" viewBox="0 0 48 48" style={s}>
            <path d="M2 46 L2 2 L46 2" fill="none" stroke="#c6a769" strokeWidth="1"/>
            <circle cx="2" cy="2" r="2" fill="#c6a769"/>
            <circle cx="46" cy="2" r="1.5" fill="none" stroke="#c6a769" strokeWidth="1"/>
          </svg>
        ))}

        {/* Header */}
        <header className="ed-header">
          <div className="ed-eyebrow-row">
            <div className="ed-eyebrow-line ed-eyebrow-line--left" />
            <span className="ed-eyebrow-text">Event Details</span>
            <div className="ed-eyebrow-line ed-eyebrow-line--right" />
          </div>
          <h2 className="ed-section-title">The Celebration</h2>
          <p className="ed-section-sub">30 · July · 2026 &nbsp;·&nbsp; Hilton Colombo</p>
        </header>

        {/* Timeline */}
        <div className="tl-container">
          <div className="tl-spine">
            <div className="tl-spine-fill" />
          </div>
          {TIMELINE.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} />
          ))}
        </div>

        {/* Facts */}
        <div className="ed-facts-strip">
          {DETAILS.map((d, i) => (
            <div key={i} className="ed-fact">
              <span className="ed-fact-label">{d.label}</span>
              <span className="ed-fact-diamond">◆</span>
              <span className="ed-fact-value">{d.value}</span>
            </div>
          ))}
        </div>

        {/* Flourish */}
        <div className="ed-bottom-flourish">
          <div className="ed-bottom-rule" />
          <p className="ed-diamonds">◆ ◆ ◆</p>
          <p className="ed-bottom-text">We look forward to celebrating with you</p>
        </div>
      </section>
    </>
  );
}