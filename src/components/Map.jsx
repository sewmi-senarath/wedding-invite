import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Venue data ────────────────────────────────────────────────────────────────
const VENUE = {
  name:      "Hilton Colombo - Grand Ballroom",
  address:   "2 Sir Chittampalam A Gardiner Mawatha",
  city:      "Colombo, Sri Lanka",
  phone:     "+94 778 399 990",
  lat:       6.9325497,
  lng:       79.8447402,
  googleMapsUrl: "https://maps.google.com/?q=Hilton+Colombo,+2+Sir+Chittampalam+A+Gardiner+Mawatha,+Colombo",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Hilton+Colombo+Sri+Lanka",
};

const EVENT = {
  title: "Thiloka & Devin Wedding",
  start: "20260730T183000", // YYYYMMDDTHHMMSS
  end:   "20260730T233000",
  location: "Hilton Colombo, Sri Lanka",
};

// ── Info pill ─────────────────────────────────────────────────────────────────
function InfoPill({ icon, label, value, href }) {
  const inner = (
    <div className="map-pill">
      <span className="map-pill-icon">{icon}</span>
      <div className="map-pill-text">
        <span className="map-pill-label">{label}</span>
        <span className="map-pill-value">{value}</span>
      </div>
    </div>
  );
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" className="map-pill-link">{inner}</a>
    : inner;
}

// ── Star rating ───────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <div className="map-stars" aria-label={`Rated ${rating} out of 5`}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "#9a7b3a" : "none"}
          stroke="#9a7b3a" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span className="map-rating-num">{rating}</span>
    </div>
  );
}

// ── Main component 
export default function Map() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const getGoogleCalendarUrl = () => {
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT.title)}&dates=${EVENT.start}/${EVENT.end}&location=${encodeURIComponent(EVENT.location)}`;
  };

  // ── Scroll-triggered entrance animations 
  useEffect(() => {
    gsap.fromTo(".map-eyebrow-row",
      { opacity: 0 },
      { opacity: 1, duration: 1.0, ease: "power2.out",
        scrollTrigger: { trigger: ".map-eyebrow-row", start: "top 86%" } }
    );
    gsap.fromTo(".map-section-title",
      { opacity: 0, y: 30, filter: "blur(5px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: ".map-section-title", start: "top 86%" } }
    );
    gsap.fromTo(".map-section-sub",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
        scrollTrigger: { trigger: ".map-section-sub", start: "top 88%" } }
    );
    gsap.fromTo(".map-frame-wrap",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ".map-frame-wrap", start: "top 84%" } }
    );
    gsap.fromTo(".map-card",
      { opacity: 0, x: -32 },
      { opacity: 1, x: 0, duration: 1.0, ease: "power3.out",
        scrollTrigger: { trigger: ".map-card", start: "top 84%" } }
    );
    gsap.fromTo(".map-pill",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".map-pills-grid", start: "top 86%" } }
    );
    gsap.fromTo(".map-actions",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: ".map-actions", start: "top 90%" } }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  // Seeded warm map style via URL params (OpenStreetMap tiles styled via iframe)
  const iframeSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=Hilton+Colombo,Sri+Lanka&zoom=15&maptype=roadmap`;

  // Fallback: OpenStreetMap embed (no API key needed)
  const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=79.8397402%2C6.9275497%2C79.8497402%2C6.9375497&layer=mapnik&marker=6.9325497%2C79.8447402`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500;600&display=swap');

        /* ── Root ── */
        .map-root {
          position: relative;
          width: 100%;
          padding: clamp(72px, 12vh, 120px) clamp(20px, 6vw, 80px);
          background: #f5ede0;
          font-family: 'Cinzel', serif;
          overflow: hidden;
        }

        /* ── Subtle background texture ── */
        .map-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 50% at 50% 100%, #fdf6ec 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 0%   40%, #f0e6d3 0%, transparent 60%),
            #f5ede0;
        }
        .map-bg-grain {
          position: absolute; inset: 0; pointer-events: none;
          opacity: 0.042;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        /* ── Corner ornaments ── */
        .map-corner-svg { position: absolute; opacity: 0.2; }

        /* ── Header ── */
        .map-header {
          text-align: center;
          margin-bottom: clamp(40px, 7vh, 64px);
        }
        .map-eyebrow-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 18px;
          opacity: 0;
        }
        .map-eyebrow-line {
          height: 1px; width: 70px; flex-shrink: 0;
        }
        .map-eyebrow-line--left  { background: linear-gradient(90deg, transparent, rgba(154,123,58,0.5)); z-index: 50;}
        .map-eyebrow-line--right { background: linear-gradient(90deg, rgba(154,123,58,0.5), transparent); z-index: 50;}
        .map-eyebrow-text {
          font-size: clamp(0.65rem, 1.1vw, 0.62rem);
          font-weight: 600;
          letter-spacing: 0.2em;
          color: #9a7b3a;
          text-transform: uppercase;
          white-space: nowrap;
          z-index: 50;
        }
        .map-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(2.2rem, 5.5vw, 3.6rem);
          color: #0d0905;
          letter-spacing: 0.04em;
          line-height: 1.1;
          margin: 0 0 12px;
          opacity: 0;
        }
        .map-section-sub {
          font-size: clamp(0.62rem, 1vw, 0.58rem);
          letter-spacing: 0.18em;
          color: #5a3e14;
          text-transform: uppercase;
          opacity: 0;
        }

        /* ── Main layout: map left, card right ── */
        .map-body {
          max-width: 1060px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 340px;
          grid-template-rows: auto;
          gap: clamp(20px, 3vw, 32px);
          align-items: stretch;
        }
        @media (max-width: 760px) {
          .map-body {
            grid-template-columns: 1fr;
          }
        }

        /* ── Map iframe wrapper ── */
        .map-frame-wrap {
          position: relative;
          border: 1px solid rgba(154,123,58,0.22);
          overflow: hidden;
          aspect-ratio: 4/3;
          min-height: 360px;
          opacity: 0;
          box-shadow:
            0 8px 40px rgba(154,123,58,0.10),
            0 2px  8px rgba(154,123,58,0.06);
        }
        /* Top accent line */
        .map-frame-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #9a7b3a 30%, #c6a769 50%, #9a7b3a 70%, transparent);
          z-index: 10;
          pointer-events: none;
        }
        /* Overlay vignette on map edges */
        .map-frame-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 40px rgba(245,237,224,0.25);
          pointer-events: none;
          z-index: 5;
        }

        .map-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
          filter: sepia(18%) saturate(0.9) brightness(1.02);
          transition: filter 0.4s ease;
        }
        .map-frame-wrap:hover .map-iframe {
          filter: sepia(8%) saturate(1.0) brightness(1.04);
        }

        /* Map loading shimmer */
        .map-loading {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #f5ede0, #f0e6d3, #f5ede0);
          background-size: 200% 200%;
          animation: map-shimmer 1.8s ease-in-out infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
          transition: opacity 0.6s ease;
        }
        .map-loading.hidden { opacity: 0; pointer-events: none; }
        @keyframes map-shimmer {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
        .map-loading-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .map-loading-text {
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          color: #5a3e14;
          text-transform: uppercase;
        }
        @keyframes map-spin {
          to { transform: rotate(360deg); }
        }
        .map-loading-spinner {
          width: 28px; height: 28px;
          border: 1.5px solid rgba(154,123,58,0.2);
          border-top-color: #9a7b3a;
          border-radius: 50%;
          animation: map-spin 0.9s linear infinite;
        }

        /* ── Info card ── */
        .map-card {
          background: rgba(253,246,236,0.9);
          border: 1px solid rgba(154,123,58,0.2);
          display: flex;
          flex-direction: column;
          padding: clamp(24px, 3vw, 36px) clamp(20px, 2.5vw, 30px);
          gap: 20px;
          opacity: 0;
          position: relative;
          box-shadow:
            0 8px 40px rgba(154,123,58,0.08),
            0 2px  8px rgba(154,123,58,0.05);
        }
        /* Top accent */
        .map-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #9a7b3a 30%, #c6a769 50%, #9a7b3a 70%, transparent);
        }
        /* Corner ticks */
        .map-card::after {
          content: '';
          position: absolute;
          bottom: -1px; right: -1px;
          width: 12px; height: 12px;
          border-bottom: 1px solid rgba(154,123,58,0.3);
          border-right:  1px solid rgba(154,123,58,0.3);
        }
        .map-card-corner-tl {
          position: absolute;
          top: -1px; left: -1px;
          width: 12px; height: 12px;
          border-top:  1px solid rgba(154,123,58,0.3);
          border-left: 1px solid rgba(154,123,58,0.3);
        }

        /* Venue name & label */
        .map-card-eyebrow {
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          color: #5a3e14;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }
        .map-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 600;
          font-size: clamp(1.5rem, 3vw, 2rem);
          color: #0d0905;
          letter-spacing: 0.04em;
          line-height: 1.15;
          margin: 0;
        }
        .map-card-rule {
          height: 1px;
          background: linear-gradient(90deg, rgba(154,123,58,0.3), transparent);
        }

        /* Pills grid */
        .map-pills-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .map-pill-link {
          text-decoration: none;
          display: block;
        }
        .map-pill-link:hover .map-pill {
          border-color: #6b4a1a;
          background: rgba(198,167,105,0.08);
        }
        .map-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border: 1px solid rgba(154,123,58,0.16);
          background: rgba(255,255,255,0.45);
          transition: all 0.25s ease;
          opacity: 0;
        }
        .map-pill-icon {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: #9a7b3a;
        }
        .map-pill-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }
        .map-pill-label {
          font-size: 0.62rem;
          letter-spacing: 0.16em;
          color: #5a3e14;
          text-transform: uppercase;
        }
        .map-pill-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.82rem, 1.5vw, 0.95rem);
          color: #1c140a;
          letter-spacing: 0.03em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Stars */
        .map-stars {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .map-rating-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.85rem;
          color: #9a7b3a;
          margin-left: 4px;
          letter-spacing: 0.04em;
        }

        /* ── Action buttons ── */
        .map-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          opacity: 0;
          margin-top: auto;
        }
        .map-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          border: none;
          transition: all 0.35s ease;
          position: relative;
          overflow: hidden;
        }
        .map-btn--primary {
          background: #9a7b3a;
          color: #fdf6ec;
          box-shadow: 0 4px 16px rgba(154,123,58,0.25);
        }
        .map-btn--primary:hover {
          background: #7a5c1e;
          box-shadow: 0 6px 24px rgba(154,123,58,0.35);
          transform: translateY(-1px);
        }
        .map-btn--secondary {
          background: transparent;
          color: #1c140a;
          border: 1px solid rgba(154,123,58,0.3);
        }
        .map-btn--secondary:hover {
          border-color: #4a3010;
          background: rgba(198,167,105,0.07);
        }

        /* ── Bottom flourish ── */
        .map-flourish {
          text-align: center;
          margin-top: clamp(40px, 6vh, 60px);
          max-width: 1060px;
          margin-left: auto;
          margin-right: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .map-flourish-rule {
          width: 160px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(154,123,58,0.35), transparent);
          z-index: 50;
        }
        .map-flourish-text {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(0.78rem, 1.5vw, 0.9rem);
          color: #6b4a1a;
          letter-spacing: 0.1em;
          z-index: 50;
        }
        .map-flourish-diamonds {
          font-size: 6px;
          color: #8a6a2a;
          letter-spacing: 10px;
          z-index: 50;
        }
      `}</style>

      <section className="map-root" id="map">
        {/* Backgrounds */}
        <div className="map-bg" />
        <div className="map-bg-grain" />

        {/* Corner ornaments */}
        {[
          { top: 28, left: 28 },
          { top: 28, right: 28, transform: "scaleX(-1)" },
          { bottom: 28, left: 28, transform: "scaleY(-1)" },
          { bottom: 28, right: 28, transform: "scale(-1,-1)" },
        ].map((s, i) => (
          <svg key={i} className="map-corner-svg" width="44" height="44" viewBox="0 0 48 48" style={s}>
            <path d="M2 46 L2 2 L46 2" fill="none" stroke="#c6a769" strokeWidth="1"/>
            <circle cx="2" cy="2" r="2" fill="#c6a769"/>
            <circle cx="46" cy="2" r="1.5" fill="none" stroke="#c6a769" strokeWidth="1"/>
          </svg>
        ))}

        {/* ── Section header ── */}
        <header className="map-header">
          <div className="map-eyebrow-row">
            <div className="map-eyebrow-line map-eyebrow-line--left" />
            <span className="map-eyebrow-text">Venue & Location</span>
            <div className="map-eyebrow-line map-eyebrow-line--right" />
          </div>
          <h2 className="map-section-title">Find Us Here</h2>
          <p className="map-section-sub">Colombo · Sri Lanka</p>
        </header>

        {/* ── Body: map + card ── */}
        <div className="map-body">

          {/* Map iframe */}
          <div className="map-frame-wrap">
            {/* Loading shimmer */}
            <div className={`map-loading ${mapLoaded ? "hidden" : ""}`}>
              <div className="map-loading-icon">
                <div className="map-loading-spinner" />
                <span className="map-loading-text">Loading map</span>
              </div>
            </div>

            <iframe
              className="map-iframe"
              title="Hilton Colombo Location"
              src={osmSrc}
              onLoad={() => setMapLoaded(true)}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info card */}
          <div className="map-card">
            <div className="map-card-corner-tl" />

            {/* Name block */}
            <div>
              <span className="map-card-eyebrow">Wedding Venue</span>
              <h3 className="map-card-name">{VENUE.name}</h3>
              <div style={{ marginTop: 10 }}>
                <Stars rating={VENUE.rating} />
              </div>
            </div>

            <div className="map-card-rule" />

            {/* Info pills */}
            <div className="map-pills-grid">

              {/* Address */}
              <InfoPill
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8"  y1="2" x2="8"  y2="6"/>
                    <line x1="3"  y1="10" x2="21" y2="10"/>
                  </svg>
                }
                label="Event Date"
                value="Thursday, 30th July 2026"
                href={getGoogleCalendarUrl()}
              />

              {/* City */}
              <InfoPill
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="10" width="18" height="11" rx="1"/>
                    <path d="M7 10V6a5 5 0 0 1 10 0v4"/>
                  </svg>
                }
                label="City"
                value={VENUE.city}
              />

              {/* Phone */}
              <InfoPill
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1 3.18 2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                }
                label="Phone"
                value={VENUE.phone}
                href={`tel:${VENUE.phone}`}
              />

            </div>

            <div className="map-card-rule" />

            {/* Action buttons */}
            <div className="map-actions">
              <a
                className="map-btn map-btn--primary"
                href={VENUE.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
                Get Directions
              </a>
              <a
                className="map-btn map-btn--secondary"
                href={VENUE.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                View on Google Maps
              </a>
            </div>

          </div>
        </div>

        {/* ── Bottom flourish ── */}
        <div className="map-flourish">
          <div className="map-flourish-rule" />
          <p className="map-flourish-diamonds">◆ ◆ ◆</p>
          <p className="map-flourish-text">We can't wait to celebrate with you</p>
        </div>

      </section>
    </>
  );
}