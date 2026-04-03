import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Floating label input ──────────────────────────────────────────────────────
function FloatingField({ label, required, children, hint }) {
  return (
    <div className="rf-field">
      <div className="rf-field-label">
        <span className="rf-label">{label}{required && <span className="rf-req"> *</span>}</span>
        {hint && <span className="rf-hint">{hint}</span>}
      </div>
      {children}
      <div className="rf-field-line" />
    </div>
  );
}

// ── Animated attendance card ──────────────────────────────────────────────────
function AttendCard({ value, selected, onChange, icon, title, sub }) {
  return (
    <label className={`rf-attend-card ${selected ? "rf-attend-card--selected" : ""}`}>
      <input
        type="radio"
        name="attending"
        value={value}
        checked={selected}
        onChange={onChange}
        className="rf-attend-radio"
        required
      />
      <span className="rf-attend-icon">{icon}</span>
      <span className="rf-attend-title">{title}</span>
      <span className="rf-attend-sub">{sub}</span>
      <div className="rf-attend-check">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
    </label>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function RSVPForm() {
  const [formData, setFormData] = useState({
    name: "", attending: "",
    guests: "1", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedAttending, setSubmittedAttending] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmittedAttending(formData.attending); // capture before reset
        setSubmitted(true);

        // Reset form
        setFormData({
          name: "",
          attending: "",
          guests: "1",
          message: "",
        });
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server not reachable");
    }

    setSubmitting(false);
  };

  // ── Scroll animations ─────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".rf-eyebrow-row",
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out",
          scrollTrigger: { trigger: ".rf-eyebrow-row", start: "top 88%", once: true } }
      );
      gsap.fromTo(".rf-title",
        { opacity: 0, y: 32, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "expo.out",
          scrollTrigger: { trigger: ".rf-title", start: "top 88%", once: true } }
      );
      gsap.fromTo(".rf-subtitle",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: ".rf-subtitle", start: "top 90%", once: true } }
      );
      gsap.fromTo(".rf-form-wrap",
        { opacity: 0, y: 44 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: ".rf-form-wrap", start: "top 88%", once: true } }
      );
      // Stagger each field in
      gsap.fromTo(".rf-field",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.1,
          scrollTrigger: { trigger: ".rf-form-wrap", start: "top 82%", once: true } }
      );
      // Petals drift up
      gsap.to(".rf-petal", {
        y: "-110vh", rotation: "random(-180,180)",
        duration: "random(12,20)",
        ease: "none", repeat: -1, stagger: { each: 1.5, from: "random" },
        scrollTrigger: { trigger: ".rsvp-root", start: "top 80%", once: true },
      });
    });
    return () => { ctx.revert(); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const isAttending = formData.attending === "yes";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Cinzel:wght@400;600;700&display=swap');

        /* ── Root ── */
        .rsvp-root {
          position: relative;
          width: 100%;
          padding: clamp(72px,12vh,120px) clamp(20px,6vw,80px) clamp(80px,14vh,140px);
          background: #fdf6ec;
          font-family: 'Cinzel', serif;
          overflow: hidden;
        }
        .rsvp-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 50% at 50% 0%,   #f5ede0 0%, transparent 65%),
            radial-gradient(ellipse 50% 60% at 10% 100%, #f0e6d3 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 90% 60%,  #f5ede0 0%, transparent 55%),
            #fdf6ec;
        }
        .rsvp-bg-grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }
        .rsvp-corner-svg { position: absolute; opacity: 0.2; }

        /* ── Floating petals ── */
        @keyframes rf-sway {
          0%,100% { margin-left: 0; }
          50%      { margin-left: 18px; }
        }
        .rf-petal {
          position: absolute;
          border-radius: 50% 0 50% 0;
          pointer-events: none;
          opacity: 0.55;
          animation: rf-sway 4s ease-in-out infinite;
        }

        /* ── Header ── */
        .rf-header {
          text-align: center;
          margin-bottom: clamp(44px,8vh,64px);
          position: relative; z-index: 1;
        }
        .rf-eyebrow-row {
          display: flex; align-items: center; justify-content: center;
          gap: 14px; margin-bottom: 18px; opacity: 0;
        }
        .rf-eyebrow-line { height: 1px; width: 70px; flex-shrink: 0; }
        .rf-eyebrow-line--left  { background: linear-gradient(90deg, transparent, rgba(154,123,58,0.55)); }
        .rf-eyebrow-line--right { background: linear-gradient(90deg, rgba(154,123,58,0.55), transparent); }
        .rf-eyebrow-text {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em;
          color: #7a5820; text-transform: uppercase; white-space: nowrap;
        }
        .rf-title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-weight: 300;
          font-size: clamp(2.8rem, 7vw, 5rem);
          color: #0d0905; letter-spacing: 0.06em;
          line-height: 1; margin: 0 0 16px; opacity: 0;
        }
        .rf-subtitle {
          font-size: 0.65rem; font-weight: 600; letter-spacing: 0.18em;
          color: #5a3e14; text-transform: uppercase; opacity: 0;
        }
        .rf-subtitle span { color: #9a7b3a; }

        /* ── Form wrapper ── */
        .rf-form-wrap {
          max-width: 600px; margin: 0 auto;
          position: relative; z-index: 1; opacity: 0;
        }

        /* Decorative frame around form */
        .rf-form-frame {
          position: relative;
          background: rgba(255,255,255,0.65);
          border: 1px solid rgba(154,123,58,0.2);
          padding: clamp(36px,5vw,56px) clamp(28px,4vw,48px);
          box-shadow:
            0 8px 48px rgba(154,123,58,0.08),
            0 2px  8px rgba(154,123,58,0.05);
        }
        /* Top gold accent */
        .rf-form-frame::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
          background: linear-gradient(90deg, transparent, #9a7b3a 30%, #c6a769 50%, #9a7b3a 70%, transparent);
        }
        /* Corner ticks */
        .rf-frame-corner {
          position: absolute;
          width: 14px; height: 14px;
          border-color: rgba(154,123,58,0.3); border-style: solid;
        }
        .rf-frame-corner--tl { top:-1px; left:-1px;  border-width: 1px 0 0 1px; }
        .rf-frame-corner--tr { top:-1px; right:-1px; border-width: 1px 1px 0 0; }
        .rf-frame-corner--bl { bottom:-1px; left:-1px;  border-width: 0 0 1px 1px; }
        .rf-frame-corner--br { bottom:-1px; right:-1px; border-width: 0 1px 1px 0; }

        /* ── Field ── */
        .rf-field {
          margin-bottom: 32px; position: relative; opacity: 1;
        }
        .rf-field:last-of-type { margin-bottom: 36px; }

        .rf-field-label {
          display: flex; align-items: baseline;
          justify-content: space-between; margin-bottom: 10px;
        }
        .rf-label {
          font-size: 0.62rem; font-weight: 700; letter-spacing: 0.18em;
          color: #7a5820; text-transform: uppercase;
        }
        .rf-req { color: #9a7b3a; }
        .rf-hint {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 0.8rem;
          color: #9a7b3a; letter-spacing: 0.03em;
        }

        /* Underline-style input */
        .rf-input, .rf-select, .rf-textarea {
          width: 100%; box-sizing: border-box;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(154,123,58,0.3);
          padding: 10px 4px 10px;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.95rem, 1.8vw, 1.1rem);
          color: #1c140a; letter-spacing: 0.03em;
          transition: border-color 0.3s ease;
          outline: none;
        }
        .rf-input::placeholder, .rf-textarea::placeholder {
          color: rgba(61,42,10,0.32); font-style: italic;
        }
        .rf-input:focus, .rf-select:focus, .rf-textarea:focus {
          border-bottom-color: #9a7b3a;
        }

        /* Animated underline on focus */
        .rf-field-line {
          position: absolute; bottom: 0; left: 0;
          height: 1.5px; width: 0%;
          background: linear-gradient(90deg, #9a7b3a, #c6a769);
          transition: width 0.4s ease;
          pointer-events: none;
        }
        .rf-field:focus-within .rf-field-line { width: 100%; }
        .rf-field:focus-within .rf-input,
        .rf-field:focus-within .rf-select,
        .rf-field:focus-within .rf-textarea {
          border-bottom-color: transparent;
        }

        .rf-select {
          cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239a7b3a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 4px center;
          padding-right: 24px;
        }
        .rf-textarea {
          resize: none; min-height: 80px;
          font-style: italic; padding-top: 8px;
          border: 1px solid rgba(154,123,58,0.2);
          background: rgba(245,237,224,0.35);
          padding: 12px 14px;
        }
        .rf-textarea:focus { border-color: #9a7b3a; }
        .rf-field:focus-within .rf-textarea { border-color: #9a7b3a;overflow: visible !important; }

        /* ── Attend cards ── */
        .rf-attend-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px; margin-top: 2px;
        }
        .rf-attend-radio { display: none; }
        .rf-attend-card {
          position: relative;
          border: 1px solid rgba(154,123,58,0.22);
          background: rgba(245,237,224,0.3);
          padding: 20px 16px 18px;
          display: flex; flex-direction: column;
          align-items: center; gap: 6px;
          cursor: pointer; text-align: center;
          transition: all 0.35s ease;
          overflow: hidden;
        }
        .rf-attend-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
          background: linear-gradient(90deg, transparent, #9a7b3a 40%, #c6a769 50%, #9a7b3a 60%, transparent);
          transform: scaleX(0);
          transition: transform 0.35s ease;
        }
        .rf-attend-card:hover { border-color: rgba(154,123,58,0.45); background: rgba(245,237,224,0.6); }
        .rf-attend-card:hover::before { transform: scaleX(1); }
        .rf-attend-card--selected {
          border-color: rgba(154,123,58,0.5);
          background: rgba(198,167,105,0.1);
          box-shadow: 0 4px 20px rgba(154,123,58,0.1);
        }
        .rf-attend-card--selected::before { transform: scaleX(1); }

        .rf-attend-icon {
          font-size: 1.4rem; line-height: 1;
          margin-bottom: 2px;
        }
        .rf-attend-title {
          font-family: 'Cinzel', serif;
          font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.14em; color: #1c140a;
          text-transform: uppercase;
        }
        .rf-attend-sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 0.82rem;
          color: #7a5820; letter-spacing: 0.03em;
        }

        /* Check badge */
        .rf-attend-check {
          position: absolute; top: 10px; right: 10px;
          width: 20px; height: 20px; border-radius: 50%;
          background: #9a7b3a; color: #fff;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transform: scale(0.5);
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .rf-attend-card--selected .rf-attend-check {
          opacity: 1; transform: scale(1);
        }

        /* ── Guest counter ── */
        .rf-guest-counter {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid rgba(154,123,58,0.25);
          background: rgba(245,237,224,0.4);

          width: 160px;     
          margin-top: 12px; 
        }
        .rf-counter-btn {
          width: 42px; height: 42px;
          background: none; border: none;
          font-size: 1.2rem; color: #9a7b3a;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s ease, color 0.2s ease;
          flex-shrink: 0;
        }
        .rf-counter-btn:hover { background: rgba(154,123,58,0.1); color: #7a5820; }
        .rf-counter-btn:disabled { opacity: 0.3; cursor: default; }
        .rf-counter-num {
          width: 52px; text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem; color: #1c140a; letter-spacing: 0.04em;
          border-left: 1px solid rgba(154,123,58,0.18);
          border-right: 1px solid rgba(154,123,58,0.18);
          height: 42px; display: flex; align-items: center; justify-content: center;
        }

        /* ── Section divider ── */
        .rf-section-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 8px 0 28px;
        }
        .rf-section-divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(154,123,58,0.2), transparent);
        }
        .rf-section-divider-line--right {
          background: linear-gradient(90deg, transparent, rgba(154,123,58,0.2));
        }
        .rf-section-divider-label {
          font-size: 0.58rem; font-weight: 700; letter-spacing: 0.18em;
          color: rgba(122,88,32,0.5); text-transform: uppercase; white-space: nowrap;
        }

        /* ── Submit button ── */
        .rf-submit-wrap { margin-top: 8px; }
        .rf-submit {
          width: 100%; padding: 16px 24px;
          background: transparent; border: 1.5px solid #7a5820;
          color: #0d0905;
          font-family: 'Cinzel', serif; font-size: 0.62rem;
          font-weight: 700; letter-spacing: 0.28em;
          text-transform: uppercase; cursor: pointer;
          position: relative; overflow: hidden;
          transition: color 0.5s ease, border-color 0.3s ease, transform 0.2s ease;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .rf-submit::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #9a7b3a, #c6a769 50%, #9a7b3a);
          transform: translateX(-105%);
          transition: transform 0.55s cubic-bezier(0.4,0,0.2,1);
          z-index: 0;
        }
        .rf-submit:hover::before { transform: translateX(0); }
        .rf-submit:hover { color: #fdf6ec; border-color: #9a7b3a; }
        .rf-submit:active { transform: scale(0.985); }
        .rf-submit > * { position: relative; z-index: 1; }
        .rf-submit-spinner {
          width: 14px; height: 14px;
          border: 1.5px solid rgba(255,255,255,0.4);
          border-top-color: #fff; border-radius: 50%;
          animation: rf-spin 0.7s linear infinite;
        }
        @keyframes rf-spin { to { transform: rotate(360deg); } }

        /* ── Success overlay ── */
        .rf-success {
          position: fixed; inset: 0; z-index: 300;
          display: flex; align-items: center; justify-content: center;
          background: rgba(245,237,224,0.7);
          backdrop-filter: blur(10px);
          animation: rf-fade-in 0.5s ease forwards;
        }
        @keyframes rf-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .rf-success-card {
          background: #fdf6ec;
          border: 1px solid rgba(154,123,58,0.3);
          padding: clamp(40px,6vw,64px) clamp(36px,5vw,56px);
          text-align: center; max-width: 440px; width: 90%;
          position: relative;
          box-shadow: 0 24px 80px rgba(100,70,10,0.15);
          animation: rf-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes rf-pop {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        .rf-success-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
          background: linear-gradient(90deg, transparent, #9a7b3a 30%, #c6a769 50%, #9a7b3a 70%, transparent);
        }
        .rf-success-icon {
          font-size: 2.2rem; margin-bottom: 16px; display: block;
          animation: rf-bounce 0.6s 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes rf-bounce {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .rf-success-rule {
          width: 60px; height: 1px; margin: 16px auto;
          background: linear-gradient(90deg, transparent, #9a7b3a, transparent);
        }
        .rf-success-title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-weight: 300;
          font-size: 2.2rem; color: #0d0905;
          letter-spacing: 0.06em; margin: 0 0 10px;
        }
        .rf-success-sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 1rem;
          color: #5a3e14; letter-spacing: 0.04em; line-height: 1.6;
        }
        .rf-success-close {
          margin-top: 28px;
          background: none; border: 1px solid rgba(154,123,58,0.3);
          color: #7a5820; padding: 10px 28px; cursor: pointer;
          font-family: 'Cinzel', serif; font-size: 0.55rem;
          font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase;
          transition: all 0.3s ease;
        }
        .rf-success-close:hover {
          background: rgba(154,123,58,0.08); border-color: rgba(154,123,58,0.5);
        }

        /* ── Mobile ── */
        @media (max-width: 500px) {
          .rf-attend-grid { grid-template-columns: 1fr; }
        }
      `}
      </style>

      <section className="rsvp-root" id="rsvp">
        <div className="rsvp-bg" />
        <div className="rsvp-bg-grain" />

        {/* Floating petals */}
        {[...Array(10)].map((_, i) => {
          const size = 5 + (i % 4) * 3;
          const colors = ["#d4aa50","#c6a769","#e8d09a","#b8922a","#f0e0b0"];
          return (
            <div key={i} className="rf-petal" style={{
              width: size, height: size + 4,
              background: colors[i % colors.length],
              left: `${8 + i * 9}%`,
              bottom: `${5 + (i % 3) * 8}%`,
              animationDelay: `${i * 0.7}s`,
              transform: `rotate(${i * 37}deg)`,
            }} />
          );
        })}

        {/* Corners */}
        {[
          { top: 28, left: 28 },
          { top: 28, right: 28, transform: "scaleX(-1)" },
          { bottom: 28, left: 28, transform: "scaleY(-1)" },
          { bottom: 28, right: 28, transform: "scale(-1,-1)" },
        ].map((s, i) => (
          <svg key={i} className="rsvp-corner-svg" width="44" height="44" viewBox="0 0 48 48" style={s}>
            <path d="M2 46 L2 2 L46 2" fill="none" stroke="#c6a769" strokeWidth="1"/>
            <circle cx="2" cy="2" r="2" fill="#c6a769"/>
            <circle cx="46" cy="2" r="1.5" fill="none" stroke="#c6a769" strokeWidth="1"/>
          </svg>
        ))}

        {/* Header */}
        <header className="rf-header">
          <div className="rf-eyebrow-row">
            <div className="rf-eyebrow-line rf-eyebrow-line--left" />
            <span className="rf-eyebrow-text">Kindly Respond</span>
            <div className="rf-eyebrow-line rf-eyebrow-line--right" />
          </div>
          <h2 className="rf-title">RSVP</h2>
          <p className="rf-subtitle">Please confirm your attendance by <strong>1st July 2026</strong></p>
        </header>

        {/* Form */}
        <div className="rf-form-wrap">
          <div className="rf-form-frame">
            <div className="rf-frame-corner rf-frame-corner--tl" />
            <div className="rf-frame-corner rf-frame-corner--tr" />
            <div className="rf-frame-corner rf-frame-corner--bl" />
            <div className="rf-frame-corner rf-frame-corner--br" />

            <form onSubmit={handleSubmit}>

              {/* Full Name — full width */}
              <FloatingField label="Full Name" required>
                <input
                  type="text" name="name" className="rf-input"
                  placeholder="Your full name"
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                />
              </FloatingField>

              {/* Attending */}
              <div className="rf-field" style={{ marginBottom: 32 }}>
                <div className="rf-field-label">
                  <span className="rf-label">Will you be attending? <span className="rf-req">*</span></span>
                </div>
                <div className="rf-attend-grid">
                  <AttendCard
                    value="yes"
                    selected={formData.attending === "yes"}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, attending: "yes" }))
                    }
                    icon="🥂"
                    title="Joyfully Accepts"
                    sub="I'll be there"
                  />

                  <AttendCard
                    value="no"
                    selected={formData.attending === "no"}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, attending: "no" }))
                    }
                    icon="🕊️"
                    title="Regretfully Declines"
                    sub="Unable to attend"
                  />
                </div>
                <div className="rf-field-line" style={{ display: "none" }} />
              </div>

              {/* Conditional fields when attending */}
              {formData.attending === "yes" && (
                <>
                  <div className="rf-section-divider">
                    <div className="rf-section-divider-line" />
                    <span className="rf-section-divider-label">Guest Details</span>
                    <div className="rf-section-divider-line rf-section-divider-line--right" />
                  </div>

                  <div className="rf-field" style={{ marginBottom: 32 }}>
                    <div className="rf-field-label">
                      <span className="rf-label">
                        Number of Guests <span className="rf-req">*</span>
                      </span>
                      <span className="rf-hint">Including yourself</span>
                    </div>

                    {/* ✅ FORCE VISIBILITY */}
                    <div style={{ marginTop: "12px" }}>
                      <div className="rf-guest-counter">
                        <button
                          type="button"
                          className="rf-counter-btn"
                          disabled={parseInt(formData.guests) <= 1}
                          onClick={() =>
                            setFormData((p) => ({
                              ...p,
                              guests: String(Math.max(1, parseInt(p.guests) - 1)),
                            }))
                          }
                        >
                          -
                        </button>

                        <div className="rf-counter-num">{formData.guests}</div>

                        <button
                          type="button"
                          className="rf-counter-btn"
                          disabled={parseInt(formData.guests) >= 10}
                          onClick={() =>
                            setFormData((p) => ({
                              ...p,
                              guests: String(Math.min(10, parseInt(p.guests) + 1)),
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Message */}
              <div className="rf-section-divider">
                <div className="rf-section-divider-line" />
                <span className="rf-section-divider-label">Well Wishes</span>
                <div className="rf-section-divider-line rf-section-divider-line--right" />
              </div>

              <div className="rf-field" style={{ marginBottom: 36 }}>
                <div className="rf-field-label">
                  <span className="rf-label">Message for the Couple</span>
                  <span className="rf-hint">Optional</span>
                </div>
                <textarea
                  name="message" className="rf-textarea"
                  placeholder="Share your warmest wishes…"
                  value={formData.message} onChange={handleChange}
                  rows={4}
                />
                <div className="rf-field-line" />
              </div>

              {/* Submit */}
              <div className="rf-submit-wrap">
                <button type="submit" className="rf-submit" disabled={submitting}>
                  {submitting
                    ? <><div className="rf-submit-spinner" /> <span>Sending…</span></>
                    : <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                        <span>Send RSVP</span>
                      </>
                  }
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>

      {/* Success overlay */}
      {submitted && (
        <div className="rf-success" onClick={() => setSubmitted(false)}>
          <div className="rf-success-card" onClick={e => e.stopPropagation()}>

            {submittedAttending === "yes" ? (
              // ── Attending: YES ──────────────────────────────
              <>
                <span className="rf-success-icon">💌</span>
                <h3 className="rf-success-title">Thank You!</h3>
                <div className="rf-success-rule" />
                <p className="rf-success-sub">
                  Your RSVP has been received.<br/>
                  We look forward to celebrating<br/>this beautiful day with you.
                </p>
              </>
            ) : (
              // ── Attending: NO ───────────────────────────────
              <>
                <span className="rf-success-icon">🕊️</span>
                <h3 className="rf-success-title">We'll Miss You</h3>
                <div className="rf-success-rule" />
                <p className="rf-success-sub">
                  Thank you for letting us know.<br/>
                  You'll be in our hearts<br/>on this special day.
                </p>
              </>
            )}

            <button className="rf-success-close" onClick={() => setSubmitted(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}