import { useState, useEffect, useRef } from "react";

// ── Icons (inline SVGs, no dependency needed) ────────────────────────────────
const Icons = {
  Story: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.4"
        strokeLinecap="round" strokeLinejoin="round">

      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
              a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23
              l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Timeline: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Map: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/>
      <line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  ),
  RSVP: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="7" x2="21" y2="7"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="17" x2="21" y2="17"/>
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

const NAV_ITEMS = [
  { id: "timeline", label: "Timeline",       short: "Agenda", Icon: Icons.Timeline },
  { id: "map",      label: "map",    short: "Map",      Icon: Icons.Map      },
  { id: "our-story",      label: "Story",    short: "Our Story",      Icon: Icons.Story      },
  { id: "rsvp",     label: "RSVP",           short: "RSVP",     Icon: Icons.RSVP     },
];

export default function WeddingNavbar({ activeSection, onNavigate }) {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inkStyle, setInkStyle]     = useState({ left: 0, width: 0, opacity: 0 });
  const navRefs   = useRef({});
  const navBarRef = useRef();

  // ── Scroll-aware glass effect ──────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Sliding ink underline ──────────────────────────────────────────────────
  useEffect(() => {
    const el = navRefs.current[activeSection];
    const bar = navBarRef.current;
    if (!el || !bar) return;
    const elRect  = el.getBoundingClientRect();
    const barRect = bar.getBoundingClientRect();
    setInkStyle({
      left:    elRect.left - barRect.left + el.offsetLeft - el.offsetLeft + (el.offsetLeft),
      width:   elRect.width,
      opacity: 1,
    });
  }, [activeSection]);

  // Recalculate ink on resize
  useEffect(() => {
    const recalc = () => {
      const el  = navRefs.current[activeSection];
      const bar = navBarRef.current;
      if (!el || !bar) return;
      const elRect  = el.getBoundingClientRect();
      const barRect = bar.getBoundingClientRect();
      setInkStyle({ left: elRect.left - barRect.left, width: elRect.width, opacity: 1 });
    };
    window.addEventListener("resize", recalc);
    // Initial calculation after mount
    setTimeout(recalc, 50);
    return () => window.removeEventListener("resize", recalc);
  }, [activeSection]);

  const handleNav = (id) => {
    onNavigate?.(id);
    setMobileOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap');

        :root {
          --gold:        #b8922a;
          --gold-light:  #d4aa50;
          --gold-pale:   #f0e0b0;
          --cream:       #faf6f0;
          --ink:         #1a1208;
          --ink-muted:   #5a4a2a;
          --glass-bg:    rgba(250, 246, 240, 0.82);
          --glass-solid: rgba(250, 246, 240, 0.98);
          --shadow:      0 4px 32px rgba(100, 70, 10, 0.10);
        }

        .wnav-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          transition: all 0.4s ease;
          font-family: 'Cinzel', serif;
        }

        /* ── Frosted glass on scroll ── */
        .wnav-root.scrolled {
          backdrop-filter: blur(16px) saturate(1.4);
          -webkit-backdrop-filter: blur(16px) saturate(1.4);
          background: var(--glass-bg);
          box-shadow: var(--shadow);
          border-bottom: 1px solid rgba(184,146,42,0.18);
        }
        .wnav-root.top {
          background: transparent;
        }

        /* ── Inner layout ── */
        .wnav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 28px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        /* ── Monogram / logo ── */
        .wnav-mono {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1;
          text-decoration: none;
          cursor: pointer;
          user-select: none;
        }
        .wnav-mono-initials {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.45rem;
          font-weight: 300;
          color: var(--ink);
          letter-spacing: 0.12em;
          line-height: 1;
        }
        .wnav-mono-amp {
          color: var(--gold);
          font-style: normal;
          margin: 0 3px;
        }
        .wnav-mono-date {
          font-family: 'Cinzel', serif;
          font-size: 0.42rem;
          letter-spacing: 0.28em;
          color: var(--gold);
          margin-top: 3px;
          text-transform: uppercase;
        }
        .wnav-mono-rule {
          width: 32px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          margin: 3px auto 0;
        }

        /* ── Desktop links ── */
        .wnav-links {
          display: flex;
          align-items: center;
          gap: 0;
          position: relative;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        /* Sliding ink underline */
        .wnav-ink {
          position: absolute;
          bottom: -2px;
          height: 1.5px;
          background: linear-gradient(90deg, transparent 0%, var(--gold) 30%, var(--gold-light) 70%, transparent 100%);
          transition: left 0.45s cubic-bezier(0.4, 0, 0.2, 1),
                      width 0.45s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.3s ease;
          pointer-events: none;
        }

        .wnav-link {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding: 10px 22px;
          cursor: pointer;
          border: none;
          background: none;
          color: var(--ink-muted);
          font-family: 'Cinzel', serif;
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          transition: color 0.3s ease;
          white-space: nowrap;
        }
        .wnav-link:hover {
          color: var(--gold);
        }
        .wnav-link.active {
          color: var(--ink);
        }
        .wnav-link-icon {
          opacity: 0.6;
          transition: opacity 0.3s, transform 0.3s;
        }
        .wnav-link:hover .wnav-link-icon,
        .wnav-link.active .wnav-link-icon {
          opacity: 1;
          transform: translateY(-1px);
        }
        .wnav-link.active .wnav-link-icon {
          color: var(--gold);
        }

        /* ── RSVP pill button ── */
        .wnav-rsvp-pill {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding: 8px 22px;
          cursor: pointer;
          border: 1px solid var(--gold);
          background: transparent;
          color: var(--gold);
          font-family: 'Cinzel', serif;
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          transition: all 0.35s ease;
          margin-left: 8px;
          overflow: hidden;
        }
        .wnav-rsvp-pill::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          transform: translateY(100%);
          transition: transform 0.35s ease;
        }
        .wnav-rsvp-pill:hover::before,
        .wnav-rsvp-pill.active::before {
          transform: translateY(0);
        }
        .wnav-rsvp-pill:hover,
        .wnav-rsvp-pill.active {
          color: #fff;
          box-shadow: 0 4px 20px rgba(184,146,42,0.35);
        }
        .wnav-rsvp-pill > * {
          position: relative;
          z-index: 1;
        }

        /* ── Divider dots ── */
        .wnav-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(184,146,42,0.3);
          flex-shrink: 0;
          margin: 0 2px;
        }

        /* ── Mobile hamburger ── */
        .wnav-hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--ink);
          padding: 6px;
          transition: color 0.2s;
        }
        .wnav-hamburger:hover { color: var(--gold); }

        /* ── Mobile drawer ── */
        .wnav-drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(300px, 80vw);
          background: var(--glass-solid);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-left: 1px solid rgba(184,146,42,0.2);
          z-index: 200;
          display: flex;
          flex-direction: column;
          padding: 0;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: -8px 0 40px rgba(100,70,10,0.12);
        }
        .wnav-drawer.open {
          transform: translateX(0);
        }

        .wnav-drawer-header {
          padding: 28px 28px 20px;
          border-bottom: 1px solid rgba(184,146,42,0.15);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .wnav-drawer-close {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--ink-muted);
          padding: 4px;
          transition: color 0.2s;
        }
        .wnav-drawer-close:hover { color: var(--gold); }

        .wnav-drawer-items {
          flex: 1;
          padding: 24px 0;
          display: flex;
          flex-direction: column;
        }

        .wnav-drawer-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 28px;
          cursor: pointer;
          border: none;
          background: none;
          text-align: left;
          font-family: 'Cinzel', serif;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-muted);
          transition: all 0.25s ease;
          border-left: 2px solid transparent;
          position: relative;
        }
        .wnav-drawer-item:hover {
          color: var(--gold);
          background: rgba(184,146,42,0.04);
          border-left-color: rgba(184,146,42,0.3);
          padding-left: 34px;
        }
        .wnav-drawer-item.active {
          color: var(--ink);
          background: rgba(184,146,42,0.06);
          border-left-color: var(--gold);
          padding-left: 34px;
        }
        .wnav-drawer-item.active .wnav-drawer-icon {
          color: var(--gold);
        }
        .wnav-drawer-icon {
          flex-shrink: 0;
          transition: color 0.25s;
        }

        .wnav-drawer-footer {
          padding: 20px 28px 32px;
          border-top: 1px solid rgba(184,146,42,0.15);
        }
        .wnav-drawer-footer-text {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 0.85rem;
          color: var(--ink-muted);
          text-align: center;
          letter-spacing: 0.05em;
        }
        .wnav-drawer-footer-rule {
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          margin: 10px auto 0;
        }

        /* ── Overlay ── */
        .wnav-overlay {
          position: fixed;
          inset: 0;
          background: rgba(26,18,8,0.3);
          z-index: 150;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease;
          backdrop-filter: blur(2px);
        }
        .wnav-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          .wnav-links     { display: none; }
          .wnav-hamburger { display: flex; }
          .wnav-inner     { height: 60px; }
        }
      `}</style>

      {/* ── Overlay ── */}
      <div
        className={`wnav-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Navbar ── */}
      <nav
        ref={navBarRef}
        className={`wnav-root ${scrolled ? "scrolled" : "top"}`}
        role="navigation"
        aria-label="Wedding invitation navigation"
      >
        <div className="wnav-inner">

          {/* Monogram */}
          <div className="wnav-mono" onClick={() => handleNav("details")} role="button" tabIndex={0} aria-label="Go to top">
            <span className="wnav-mono-initials">
              T <span className="wnav-mono-amp">&</span> D
            </span>
            <div className="wnav-mono-rule" />
            <span className="wnav-mono-date">Our · Wedding</span>
          </div>

          {/* Desktop links */}
          <ul className="wnav-links" role="list">
            {/* Sliding ink underline */}
            <div
              className="wnav-ink"
              style={{
                left:    inkStyle.left,
                width:   inkStyle.width,
                opacity: inkStyle.opacity,
              }}
            />

            {NAV_ITEMS.map((item, i) => {
              const isRSVP   = item.id === "rsvp";
              const isActive = activeSection === item.id;

              if (isRSVP) return (
                <li key={item.id} style={{ listStyle: "none", display: "flex", alignItems: "center" }}>
                  <div className="wnav-dot" />
                  <button
                    ref={el => navRefs.current[item.id] = el}
                    className={`wnav-rsvp-pill ${isActive ? "active" : ""}`}
                    onClick={() => handleNav(item.id)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="wnav-link-icon"><item.Icon /></span>
                    <span>{item.short}</span>
                  </button>
                </li>
              );

              return (
                <li key={item.id} style={{ listStyle: "none", display: "flex", alignItems: "center" }}>
                  {i > 0 && <div className="wnav-dot" />}
                  <button
                    ref={el => navRefs.current[item.id] = el}
                    className={`wnav-link ${isActive ? "active" : ""}`}
                    onClick={() => handleNav(item.id)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="wnav-link-icon"><item.Icon /></span>
                    <span>{item.short}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="wnav-hamburger"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <Icons.Close /> : <Icons.Menu />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div className={`wnav-drawer ${mobileOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div className="wnav-drawer-header">
          <div className="wnav-mono">
            <span className="wnav-mono-initials">
              T <span className="wnav-mono-amp">&</span> D
            </span>
            <div className="wnav-mono-rule" />
            <span className="wnav-mono-date">Our · Wedding</span>
          </div>
          <button className="wnav-drawer-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <Icons.Close />
          </button>
        </div>

        <div className="wnav-drawer-items">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`wnav-drawer-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => handleNav(item.id)}
              aria-current={activeSection === item.id ? "page" : undefined}
            >
              <span className="wnav-drawer-icon"><item.Icon /></span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="wnav-drawer-footer">
          <p className="wnav-drawer-footer-text">Together forever begins here</p>
          <div className="wnav-drawer-footer-rule" />
        </div>
      </div>
    </>
  );
}