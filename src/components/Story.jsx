import { useEffect, useRef, useState, useCallback } from "react";
import weddingImg from '/images/wedding1.png'
import engagementImg from '/images/engagement.jpeg'
import familyImg from '/images/family.jpeg'
import perthImg from '/images/perth.jpeg'
import firstmet from '/images/firstmet.jpeg'

// ── Story milestones 
const MILESTONES = [
  {
    id: 1,
    date: "October 2017",
    emoji: "✨",
    tag: "The Beginning",
    headline: "Two Worlds Collided",
    body: "It was a warm afternoon in October 2017 when we first met. What seemed like an ordinary moment quickly turned into something special, easy conversations, shared laughter, and a feeling we couldn’t ignore. Looking back, that simple day became the beginning of our beautiful story together.",
    side: "left",
    photo: firstmet,          
    photoCaption: "The night we met · October 2017",
    color: "#e8c87a",
  },
  {
    id: 2,
    date: "2020",
    emoji: "🏡",
    tag: "Family Matters",
    headline: "Officially approved by families",
    body: "Three years of stolen glances, long late-night calls, and knowing smiles later - we were ready to make it official to the people who matter most. Telling our parents was equal parts nerve wracking and beautiful. Their blessings meant the world, and in that moment, our little love story became a family story too.",
    side: "right",
    photo: familyImg,          
    photoCaption: "With our families · 2020",
    color: "#d4a86a",
  },
  {
    id: 3,
    date: "January 20, 2023",
    emoji: "💍",
    tag: "She Said Yes",
    headline: "We got Engaged",
    body: "January 20th, 2023. A date forever etched into our hearts. Through happy tears and a resounding memories, we became engaged - two people choosing each other, not just for now, but for always.",
    side: "left",
    photo: engagementImg,         
    photoCaption: "Engaged! · January 20, 2023",
    color: "#c69a5a",
  },
  {
    id: 4,
    date: "July 20, 2023",
    emoji: "🌏",
    tag: "New Horizons",
    headline: "Hello, Perth!",
    body: "Adventure called, and we answered, together. We packed our lives into luggages, said our heartfelt goodbyes, and boarded a flight to the other side of the world. A new city, a new chapter, and the same two people falling deeper in love with every sunrise.",
    side: "right",
    photo: perthImg,         
    photoCaption: "Arriving in Perth · July 2023",
    color: "#b88c4a",
  },
  {
    id: 5,
    date: "2026",
    emoji: "💒",
    tag: "Forever Starts Here",
    headline: "Our Wedding Day",
    body: "And now, here we are. Everything - every laugh, every mile, every moment has led us to this. We are ready to stand before the people we love most, look each other in the eyes, and say the words we have always meant. Not an ending, but the most beautiful beginning of all.",
    side: "left",
    photo: weddingImg,          
    photoCaption: "Our wedding day · 2026 ♥",
    color: "#a07838",
  },
];

// ── Gallery items ─────────────────────────────────────────────────────────────
const GALLERY = [
  { id: 1, label: "When We First Met",    caption: "October 2017 · The night everything changed",  aspect: "portrait"  },
  { id: 2, label: "Our Engagement",       caption: "January 2023 · She said yes!",                  aspect: "landscape" },
  { id: 3, label: "Sunsets Together",     caption: "Chasing golden skies, always",                  aspect: "portrait"  },
  { id: 4, label: "Perth Adventures",     caption: "July 2023 · Our new home, down under",          aspect: "landscape" },
  { id: 5, label: "Lazy Sunday Mornings", caption: "The quiet moments we treasure most",            aspect: "portrait"  },
  { id: 6, label: "Us, Always",           caption: "2026 · Our forever begins",                     aspect: "portrait"  },
];

// ── IntersectionObserver hook ─────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef();
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Photo slot with 3-D tilt effect ──────────────────────────────────────────
function PhotoSlot({ m }) {
  const [rot, setRot] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - r.top)  / r.height - 0.5) * 12;
    const y = ((e.clientX - r.left) / r.width  - 0.5) * -12;
    setRot({ x, y });
  };
  const handleLeave = () => setRot({ x: 0, y: 0 });

  return (
    <div
      className="os-photo-wrap"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform: `perspective(700px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}
    >
      {m.photo ? (
        <img src={m.photo} alt={m.photoCaption} className="os-photo-img" />
      ) : (
        <div className="os-photo-placeholder" style={{ "--accent": m.color }}>
          <span className="os-photo-emoji-big">{m.emoji}</span>
          <p className="os-photo-ph-label">Add Photo</p>
          <p className="os-photo-ph-hint">Set <code>photo</code> in MILESTONES</p>
        </div>
      )}
      <div className="os-photo-caption">{m.photoCaption}</div>
      <div className="os-photo-shine" />
    </div>
  );
}

// ── Milestone row ─────────────────────────────────────────────────────────────
function MilestoneCard({ m, index, activeId, onActivate }) {
  const [ref, inView] = useInView(0.08);
  const isLeft   = m.side === "left";
  const isActive = activeId === m.id;

  return (
    <div
      ref={ref}
      className={`os-row ${isLeft ? "os-row-left" : "os-row-right"} ${inView ? "os-row-visible" : ""} ${isActive ? "os-row-active" : ""}`}
      style={{ "--delay": `${index * 0.1}s`, "--accent": m.color }}
    >
      {/* TEXT CARD */}
      <div className="os-card" onClick={() => onActivate(m.id)}>
        <div className="os-card-tag-row">
          <span className="os-card-emoji">{m.emoji}</span>
          <span className="os-card-tag">{m.tag}</span>
        </div>
        <p className="os-card-date">{m.date}</p>
        <h3 className="os-card-headline">{m.headline}</h3>
        <p className={`os-card-body ${isActive ? "os-body-open" : ""}`}>{m.body}</p>
        <button
          className="os-card-toggle"
          onClick={(e) => { e.stopPropagation(); onActivate(isActive ? null : m.id); }}
        >
          {isActive ? "Close ↑" : "Read more ↓"}
        </button>
        <div className="os-card-bar" />
      </div>

      {/* SPINE NODE */}
      <div className="os-node-col">
        <div className={`os-node ${isActive ? "os-node-lit" : ""}`}>
          <div className="os-node-ring" />
          <div className="os-node-ring os-node-ring2" />
          <div className="os-node-core" />
          <span className="os-node-num">{index + 1}</span>
        </div>
      </div>

      {/* PHOTO */}
      <div className="os-photo-col">
        <PhotoSlot m={m} />
      </div>
    </div>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ items, idx, onClose, onPrev, onNext }) {
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowLeft")   onPrev();
      if (e.key === "ArrowRight")  onNext();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, onPrev, onNext]);

  const item = items[idx];

  return (
    <div className="os-lb-backdrop" onClick={onClose}>
      <button className="os-lb-close" onClick={onClose}>✕</button>
      <button className="os-lb-arrow os-lb-prev" onClick={(e) => { e.stopPropagation(); onPrev(); }}>‹</button>

      <div className="os-lb-box" onClick={(e) => e.stopPropagation()}>
        <div className="os-lb-img-area">
          {/* Swap this div for <img src={item.src} className="os-lb-img" /> */}
          <div className="os-lb-placeholder">
            <span style={{ fontSize: "2.8rem", opacity: 0.4 }}>📷</span>
            <p className="os-lb-ph-text">Add photo to GALLERY array</p>
          </div>
        </div>
        <div className="os-lb-meta">
          <p className="os-lb-label">{item.label}</p>
          <p className="os-lb-caption">{item.caption}</p>
          <p className="os-lb-counter">{idx + 1} / {items.length}</p>
        </div>
      </div>

      <button className="os-lb-arrow os-lb-next" onClick={(e) => { e.stopPropagation(); onNext(); }}>›</button>
    </div>
  );
}

// ── Gallery card ──────────────────────────────────────────────────────────────
function GalleryCard({ item, index, onOpen }) {
  const [ref, inView] = useInView(0.08);
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      className={`os-gal-card ${item.aspect} ${inView ? "os-gal-in" : ""} ${hov ? "os-gal-hov" : ""}`}
      style={{ "--delay": `${index * 0.09}s` }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(index)}
    >
      <div className="os-gal-img-area">
        <div className="os-gal-placeholder">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="6" width="28" height="20" rx="2" stroke="rgba(154,123,58,0.35)" strokeWidth="1.2" fill="none"/>
            <circle cx="11" cy="13" r="2.5" stroke="rgba(154,123,58,0.35)" strokeWidth="1.2" fill="none"/>
            <path d="M2 22 L9 16 L15 21 L21 15 L30 22" stroke="rgba(154,123,58,0.35)" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="os-gal-overlay">
        <p className="os-gal-label">{item.label}</p>
        <p className="os-gal-caption">{item.caption}</p>
        <div className="os-gal-zoom">⊕</div>
      </div>
      <div className="os-gal-corner-tl" />
      <div className="os-gal-corner-br" />
    </div>
  );
}

// ── Gallery section ───────────────────────────────────────────────────────────
function GallerySection() {
  const [ref, inView] = useInView(0.1);
  const [lbIdx, setLbIdx] = useState(null);
  const open  = useCallback((i) => setLbIdx(i), []);
  const close = useCallback(() => setLbIdx(null), []);
  const prev  = useCallback(() => setLbIdx((i) => (i - 1 + GALLERY.length) % GALLERY.length), []);
  const next  = useCallback(() => setLbIdx((i) => (i + 1) % GALLERY.length), []);

  return (
    <div className="os-gal-section">
      <div ref={ref} className={`os-gal-head ${inView ? "os-gal-head-in" : ""}`}>
        <span className="os-gal-eyebrow">Captured Moments</span>
        <h3 className="os-gal-title">Us, in Pictures</h3>
        <div className="os-gal-divider">
          <div className="os-gal-line" /><div className="os-gal-gem" /><div className="os-gal-line os-gal-liner" />
        </div>
        <p className="os-gal-sub">Click any photo to open ✦</p>
      </div>

      <div className="os-gal-grid">
        {GALLERY.map((item, i) => (
          <GalleryCard key={item.id} item={item} index={i} onOpen={open} />
        ))}
      </div>

      {lbIdx !== null && (
        <Lightbox items={GALLERY} idx={lbIdx} onClose={close} onPrev={prev} onNext={next} />
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function OurStory() {
  const [headerRef, headerInView] = useInView(0.15);
  const [activeId, setActiveId]   = useState(null);
  const handleActivate = (id) => setActiveId((prev) => (prev === id ? null : id));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Cinzel:wght@400;500&family=Lato:wght@300;400&display=swap');

        :root {
          --os-cream: #fdf6ec; --os-ink: #1c140a;
          --os-gold: #c6a769; --os-gold-d: #9a7b3a;
          --os-gold-p: #f0d888; --os-muted: #5a4020;
        }

        /* ROOT */
        .os-root {
          position: relative; width: 100%;
          background: linear-gradient(180deg, #fdf6ec 0%, #f5ede0 50%, #fdf6ec 100%);
          overflow: hidden; padding: 80px 0 0;
          font-family: 'Lato', sans-serif;
        }
        .os-root::before {
          content: ''; position: absolute; inset: 0; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px; pointer-events: none;
        }

        /* HEADER */
        .os-header {
          text-align: center; padding: 0 24px 64px;
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .os-header.os-h-in { opacity: 1; transform: translateY(0); }
        .os-header-eyebrow {
          font-family: 'Cinzel', serif; font-size: 0.58rem;
          letter-spacing: 0.38em; color: var(--os-gold-d);
          text-transform: uppercase; display: block; margin-bottom: 14px;
        }
        .os-header-title {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-weight: 300; font-size: clamp(2.8rem,7vw,5rem);
          color: var(--os-ink); line-height: 1.1; margin-bottom: 18px;
        }
        .os-header-div {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin: 0 auto 20px; max-width: 260px;
        }
        .os-h-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(154,123,58,0.4)); }
        .os-h-line:last-child { background: linear-gradient(90deg,rgba(154,123,58,0.4),transparent); }
        .os-h-gem { width:6px;height:6px;background:var(--os-gold);transform:rotate(45deg);box-shadow:0 0 6px rgba(198,167,105,.5); }
        .os-header-sub {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: clamp(1rem,2vw,1.15rem); color: var(--os-muted);
          letter-spacing: 0.05em; max-width: 480px; margin: 0 auto; line-height: 1.75;
        }

        /* TIMELINE */
        .os-timeline {
          position: relative; max-width: 1060px;
          margin: 0 auto; padding: 0 24px 80px;
        }
        .os-spine {
          position: absolute; left: 50%; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(154,123,58,0.3) 6%, rgba(154,123,58,0.3) 94%, transparent);
          transform: translateX(-50%);
        }

        /* ROW: 3-col grid [card | node | photo] */
        .os-row {
          display: grid;
          grid-template-columns: 1fr 64px 1fr;
          align-items: center;
          margin-bottom: 56px;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.7s ease var(--delay), transform 0.7s ease var(--delay);
        }
        .os-row-left  { transform: translateX(-28px); }
        .os-row-right { transform: translateX(28px); }
        .os-row-visible { opacity: 1; transform: translateX(0) !important; }

        /* col placement */
        .os-row-left  .os-card      { grid-column:1; grid-row:1; }
        .os-row-left  .os-node-col  { grid-column:2; grid-row:1; }
        .os-row-left  .os-photo-col { grid-column:3; grid-row:1; }
        .os-row-right .os-photo-col { grid-column:1; grid-row:1; }
        .os-row-right .os-node-col  { grid-column:2; grid-row:1; }
        .os-row-right .os-card      { grid-column:3; grid-row:1; }

        /* CARD */
        .os-card {
          position: relative; overflow: hidden;
          background: rgba(255,252,245,0.9);
          border: 1px solid rgba(154,123,58,0.16);
          padding: 26px 28px 22px;
          transition: box-shadow 0.35s, transform 0.35s, border-color 0.35s;
        }
        .os-row:hover .os-card, .os-row-active .os-card {
          box-shadow: 0 10px 48px rgba(154,123,58,0.14);
          transform: translateY(-2px);
          border-color: rgba(154,123,58,0.32);
        }
        .os-card::before, .os-card::after {
          content:''; position:absolute;
          width:10px;height:10px;
          border-color:rgba(154,123,58,0.28); border-style:solid;
          transition: border-color 0.3s;
        }
        .os-card::before { top:-1px;left:-1px;border-width:1.5px 0 0 1.5px; }
        .os-card::after  { bottom:-1px;right:-1px;border-width:0 1.5px 1.5px 0; }
        .os-row-active .os-card::before,
        .os-row-active .os-card::after { border-color: var(--accent); }

        /* animated accent bar */
        .os-card-bar {
          position:absolute; bottom:0;left:0;right:0; height:2px;
          background: linear-gradient(90deg, transparent, var(--accent,#c6a769), transparent);
          transform: scaleX(0); transform-origin: center;
          transition: transform 0.4s ease;
        }
        .os-row-active .os-card-bar { transform: scaleX(1); }

        .os-card-tag-row { display:flex;align-items:center;gap:7px;margin-bottom:8px; }
        .os-card-emoji { font-size:1rem;line-height:1; }
        .os-card-tag {
          font-family:'Cinzel',serif; font-size:0.52rem;
          letter-spacing:0.22em; color:var(--os-gold-d); text-transform:uppercase;
        }
        .os-card-date {
          font-family:'Cormorant Garamond',serif; font-style:italic;
          font-size:0.88rem; color:var(--os-gold); letter-spacing:0.08em; margin-bottom:6px;
        }
        .os-card-headline {
          font-family:'Cormorant Garamond',serif; font-weight:600;
          font-size:clamp(1.15rem,2.4vw,1.5rem); color:var(--os-ink);
          margin-bottom:10px; line-height:1.25;
        }
        .os-card-body {
          font-size:0.86rem; color:#4a3820; line-height:1.8; font-weight:300;
          max-height:0; overflow:hidden; opacity:0; margin-bottom:0;
          transition: max-height 0.5s ease, opacity 0.4s ease, margin 0.3s ease;
        }
        .os-body-open { max-height:280px; opacity:1; margin-bottom:14px; }
        .os-card-toggle {
          font-family:'Cinzel',serif; font-size:0.5rem;
          letter-spacing:0.2em; color:var(--os-gold-d);
          text-transform:uppercase; background:none; border:none;
          cursor:pointer; padding:0; transition:color 0.2s;
        }
        .os-card-toggle:hover { color:var(--os-ink); }

        /* NODE */
        .os-node-col { display:flex;align-items:center;justify-content:center;position:relative;z-index:2; }
        .os-node { position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center; }
        .os-node-ring {
          position:absolute;inset:0;border-radius:50%;
          border:1px solid rgba(154,123,58,0.3);
          animation:os-pulse 3s ease-out infinite;
        }
        .os-node-ring2 { animation-delay:1.5s; }
        @keyframes os-pulse {
          0%   { transform:scale(1);opacity:0.5; }
          100% { transform:scale(2.4);opacity:0; }
        }
        .os-node-core {
          position:relative;z-index:1;width:14px;height:14px;border-radius:50%;
          background:linear-gradient(135deg, var(--os-gold-p), var(--os-gold));
          box-shadow:0 0 10px rgba(198,167,105,0.6);
          transition:transform 0.3s,box-shadow 0.3s;
        }
        .os-node-lit .os-node-core {
          transform:scale(1.45);
          box-shadow:0 0 20px rgba(198,167,105,0.95);
        }
        .os-node-num {
          position:absolute;top:-18px;left:50%;transform:translateX(-50%);
          font-family:'Cinzel',serif;font-size:0.46rem;
          letter-spacing:0.1em;color:rgba(154,123,58,0.55);
        }

        /* PHOTO */
        .os-photo-col { padding: 0 14px; }
        .os-photo-wrap {
          position:relative; overflow:hidden;
          transition:transform 0.12s ease;
          transform-style:preserve-3d;
        }
        .os-photo-img {
          width:100%;height:220px;object-fit:cover;display:block;
          transition:transform 0.5s;
        }
        .os-photo-wrap:hover .os-photo-img { transform:scale(1.05); }

        .os-photo-placeholder {
          width:100%;height:220px;
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;
          background:linear-gradient(135deg,rgba(245,237,224,0.95),rgba(225,205,165,0.65),rgba(245,237,224,0.95));
          border:1px dashed rgba(154,123,58,0.22);
          position:relative;overflow:hidden;transition:transform 0.5s;
        }
        .os-photo-wrap:hover .os-photo-placeholder { transform:scale(1.02); }
        /* sweep highlight */
        .os-photo-placeholder::before {
          content:'';position:absolute;
          top:-40%;left:-10%;width:28%;height:200%;
          background:linear-gradient(90deg,transparent,rgba(240,216,136,0.12),transparent);
          transform:rotate(15deg);transition:left 0.6s ease;
        }
        .os-photo-wrap:hover .os-photo-placeholder::before { left:110%; }

        .os-photo-emoji-big { font-size:2.2rem;opacity:0.45; }
        .os-photo-ph-label {
          font-family:'Cinzel',serif;font-size:0.5rem;
          letter-spacing:0.22em;color:rgba(154,123,58,0.42);text-transform:uppercase;
        }
        .os-photo-ph-hint { font-size:0.6rem;color:rgba(90,64,32,0.32); }
        .os-photo-ph-hint code {
          background:rgba(154,123,58,0.08);padding:1px 4px;
          border-radius:2px;font-size:0.58rem;
        }

        .os-photo-caption {
          position:absolute;bottom:0;left:0;right:0;
          padding:10px 14px;
          background:linear-gradient(to top, rgba(18,10,2,0.58),transparent);
          font-family:'Cormorant Garamond',serif;font-style:italic;
          font-size:0.82rem;color:rgba(255,245,218,0.88);letter-spacing:0.05em;
          opacity:0;transition:opacity 0.3s;
        }
        .os-photo-wrap:hover .os-photo-caption { opacity:1; }
        .os-photo-shine {
          position:absolute;inset:0;pointer-events:none;
          background:linear-gradient(135deg,rgba(255,245,200,0.14) 0%,transparent 50%);
          opacity:0;transition:opacity 0.3s;
        }
        .os-photo-wrap:hover .os-photo-shine { opacity:1; }

        /* MOBILE */
        @media (max-width:680px) {
          .os-spine { left:20px; }
          .os-row { grid-template-columns:40px 1fr; grid-template-rows:auto auto; }
          .os-row-left  .os-card,
          .os-row-right .os-card    { grid-column:2;grid-row:1; }
          .os-row-left  .os-node-col,
          .os-row-right .os-node-col { grid-column:1;grid-row:1; }
          .os-row-left  .os-photo-col,
          .os-row-right .os-photo-col { grid-column:2;grid-row:2;padding:10px 0 0; }
        }

        /* ══ GALLERY ══ */
        .os-gal-section {
          background:linear-gradient(180deg,#f5ede0 0%,#ede0c8 100%);
          padding:72px 28px 88px;text-align:center;
        }
        .os-gal-head {
          margin-bottom:48px;opacity:0;transform:translateY(20px);
          transition:opacity 0.8s,transform 0.8s;
        }
        .os-gal-head.os-gal-head-in { opacity:1;transform:translateY(0); }
        .os-gal-eyebrow {
          font-family:'Cinzel',serif;font-size:0.57rem;
          letter-spacing:0.36em;color:var(--os-gold-d);
          text-transform:uppercase;display:block;margin-bottom:12px;
        }
        .os-gal-title {
          font-family:'Cormorant Garamond',serif;font-style:italic;
          font-weight:300;font-size:clamp(2rem,5vw,3.2rem);color:var(--os-ink);
        }
        .os-gal-divider {
          display:flex;align-items:center;justify-content:center;
          gap:10px;max-width:220px;margin:14px auto 12px;
        }
        .os-gal-line { flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(154,123,58,0.4)); }
        .os-gal-liner { background:linear-gradient(90deg,rgba(154,123,58,0.4),transparent); }
        .os-gal-gem { width:5px;height:5px;background:var(--os-gold);transform:rotate(45deg); }
        .os-gal-sub {
          font-family:'Cormorant Garamond',serif;font-style:italic;
          font-size:0.88rem;color:var(--os-muted);letter-spacing:0.05em;opacity:0.75;
        }
        .os-gal-grid {
          display:grid;grid-template-columns:repeat(3,1fr);
          grid-auto-rows:200px;gap:14px;max-width:920px;margin:0 auto;
        }
        @media(max-width:640px) {
          .os-gal-grid { grid-template-columns:repeat(2,1fr);grid-auto-rows:155px; }
        }

        .os-gal-card {
          position:relative;overflow:hidden;
          background:linear-gradient(135deg,#f5ede0,#ede0c8);
          border:1px solid rgba(154,123,58,0.14);cursor:pointer;
          opacity:0;transform:scale(0.93) translateY(14px);
          transition:opacity 0.6s ease var(--delay),transform 0.6s ease var(--delay),box-shadow 0.3s;
        }
        .os-gal-card.landscape { grid-column:span 2; }
        .os-gal-card.os-gal-in { opacity:1;transform:scale(1) translateY(0); }
        .os-gal-card.os-gal-hov { box-shadow:0 14px 48px rgba(154,123,58,0.2);z-index:2; }
        .os-gal-card.os-gal-hov .os-gal-img-area { transform:scale(1.06); }
        .os-gal-card.os-gal-hov .os-gal-overlay { opacity:1; }
        .os-gal-card.os-gal-hov .os-gal-corner-tl,
        .os-gal-card.os-gal-hov .os-gal-corner-br { opacity:1; }

        .os-gal-img-area {
          width:100%;height:100%;
          display:flex;align-items:center;justify-content:center;
          transition:transform 0.5s;
        }
        .os-gal-placeholder {
          width:100%;height:100%;
          display:flex;align-items:center;justify-content:center;
          background:linear-gradient(135deg,#f5ede0,#ede0c8,#f5ede0);
        }
        .os-gal-overlay {
          position:absolute;inset:0;
          background:linear-gradient(to top,rgba(20,12,3,0.72) 0%,rgba(20,12,3,0.1) 55%,transparent 100%);
          display:flex;flex-direction:column;align-items:flex-start;
          justify-content:flex-end;padding:16px 18px;
          opacity:0;transition:opacity 0.35s;
        }
        .os-gal-label {
          font-family:'Cormorant Garamond',serif;font-style:italic;
          font-size:1rem;color:rgba(255,248,220,0.95);letter-spacing:0.04em;line-height:1.25;
        }
        .os-gal-caption {
          font-family:'Cinzel',serif;font-size:0.47rem;
          letter-spacing:0.18em;color:rgba(240,210,140,0.78);
          text-transform:uppercase;margin-top:4px;
        }
        .os-gal-zoom {
          position:absolute;top:14px;right:14px;
          width:28px;height:28px;border-radius:50%;
          background:rgba(255,248,220,0.14);
          border:1px solid rgba(255,248,220,0.32);
          display:flex;align-items:center;justify-content:center;
          font-size:1rem;color:rgba(255,248,220,0.85);
        }
        .os-gal-corner-tl,.os-gal-corner-br {
          position:absolute;width:12px;height:12px;
          border-color:rgba(198,167,105,0.65);border-style:solid;
          opacity:0;transition:opacity 0.3s;
        }
        .os-gal-corner-tl { top:0;left:0;border-width:1.5px 0 0 1.5px; }
        .os-gal-corner-br { bottom:0;right:0;border-width:0 1.5px 1.5px 0; }

        /* ══ LIGHTBOX ══ */
        .os-lb-backdrop {
          position:fixed;inset:0;z-index:300;
          background:rgba(8,4,1,0.9);backdrop-filter:blur(10px);
          display:flex;align-items:center;justify-content:center;
          animation:lb-in 0.28s ease;
        }
        @keyframes lb-in { from{opacity:0} to{opacity:1} }
        .os-lb-close {
          position:absolute;top:22px;right:26px;
          background:none;border:1px solid rgba(198,167,105,0.3);
          color:rgba(240,210,140,0.75);width:38px;height:38px;
          border-radius:50%;cursor:pointer;font-size:0.9rem;
          display:flex;align-items:center;justify-content:center;
          transition:background 0.2s,color 0.2s;
        }
        .os-lb-close:hover { background:rgba(198,167,105,0.15);color:#fff; }
        .os-lb-arrow {
          position:absolute;top:50%;transform:translateY(-50%);
          background:none;border:1px solid rgba(198,167,105,0.28);
          color:rgba(240,210,140,0.7);width:46px;height:46px;
          border-radius:50%;cursor:pointer;font-size:1.8rem;line-height:1;
          display:flex;align-items:center;justify-content:center;
          transition:background 0.2s,color 0.2s;
        }
        .os-lb-arrow:hover { background:rgba(198,167,105,0.15);color:#fff; }
        .os-lb-prev { left:22px; }
        .os-lb-next { right:22px; }
        .os-lb-box {
          display:flex;flex-direction:column;align-items:center;
          max-width:680px;width:88%;gap:20px;
          animation:lb-slide 0.32s ease;
        }
        @keyframes lb-slide {
          from { opacity:0;transform:scale(0.95) translateY(10px); }
          to   { opacity:1;transform:scale(1) translateY(0); }
        }
        .os-lb-img-area { width:100%; }
        .os-lb-img { width:100%;max-height:60vh;object-fit:contain;display:block; }
        .os-lb-placeholder {
          width:100%;height:320px;
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
          background:linear-gradient(135deg,#251808,#130c04,#251808);
          border:1px dashed rgba(154,123,58,0.22);
        }
        .os-lb-ph-text {
          font-family:'Cinzel',serif;font-size:0.52rem;
          letter-spacing:0.22em;color:rgba(154,123,58,0.4);text-transform:uppercase;
        }
        .os-lb-meta { text-align:center; }
        .os-lb-label {
          font-family:'Cormorant Garamond',serif;font-style:italic;
          font-size:1.3rem;color:rgba(255,245,218,0.92);letter-spacing:0.04em;margin-bottom:6px;
        }
        .os-lb-caption {
          font-family:'Cinzel',serif;font-size:0.5rem;
          letter-spacing:0.22em;color:rgba(198,167,105,0.65);text-transform:uppercase;margin-bottom:8px;
        }
        .os-lb-counter {
          font-family:'Cinzel',serif;font-size:0.46rem;
          letter-spacing:0.2em;color:rgba(198,167,105,0.38);
        }
        
      `}</style>

      <section id="our-story" className="os-root">

        {/* Header */}
        <div ref={headerRef} className={`os-header ${headerInView ? "os-h-in" : ""}`}>
          <span className="os-header-eyebrow">A Love Story</span>
          <h2 className="os-header-title">Our Story</h2>
          <div className="os-header-div">
            <div className="os-h-line" /><div className="os-h-gem" /><div className="os-h-line" />
          </div>
          <p className="os-header-sub">
            Life has a way of leading two people
            through all the right moments until they finally find each other. Here is ours.
          </p>
        </div>

        {/* Timeline */}
        <div className="os-timeline">
          <div className="os-spine" />
          {MILESTONES.map((m, i) => (
            <MilestoneCard key={m.id} m={m} index={i} activeId={activeId} onActivate={handleActivate} />
          ))}
        </div>

        {/* Gallery */}
        <GallerySection />

      </section>
    </>
  );
}