import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";

export default function InvitationCover({ onOpen }) {
  const mountRef   = useRef();
  const canvasRef  = useRef();
  const mouseRef   = useRef({ x: 0.5, y: 0.5 });
  const glowRef    = useRef();
  const contentRef = useRef();
  const [startMusic, setStartMusic] = useState(false);

  // ── 2D Particle canvas ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let animId;

    const COLORS = [
      "rgba(198,167,105,0.7)", "rgba(212,185,140,0.5)",
      "rgba(232,208,154,0.6)", "rgba(255,240,190,0.55)", "rgba(184,146,42,0.65)",
    ];

    const particles = Array.from({ length: 55 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H + H,
      size: 1 + Math.random() * 2.5, speed: 0.3 + Math.random() * 0.7,
      drift: (Math.random() - 0.5) * 0.4, color: COLORS[i % COLORS.length],
      opacity: Math.random(), angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02, isPetal: i % 4 === 0,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.y -= p.speed; p.x += p.drift + Math.sin(p.angle) * 0.3;
        p.angle += p.spin; p.opacity = Math.min(1, p.opacity + 0.005);
        if (p.y < -20) { p.y = H + 10; p.x = Math.random() * W; p.opacity = 0; }
        ctx.save(); ctx.globalAlpha = p.opacity * 0.8;
        ctx.translate(p.x, p.y); ctx.rotate(p.angle);
        if (p.isPetal) {
          ctx.fillStyle = p.color; ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 2, p.size * 3.5, 0, 0, Math.PI * 2); ctx.fill();
        } else {
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.5);
          g.addColorStop(0, p.color); g.addColorStop(1, "rgba(198,167,105,0)");
          ctx.fillStyle = g; ctx.beginPath();
          ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  // ── Mouse parallax ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          x: (mouseRef.current.x - 0.5) * 8,
          y: (mouseRef.current.y - 0.5) * 5,
          duration: 1.4, ease: "power2.out",
        });
      }
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: `${e.clientX - window.innerWidth / 2}px`,
          y: `${e.clientY - window.innerHeight / 2}px`,
          duration: 1.8, ease: "power3.out",
        });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ── THREE.JS Ring ──────────────────────────────────────────────────────────
  useEffect(() => {
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff0d0, 1.4));
    [{ c: 0xd4af37, i: 3.0, p: [4,5,6] }, { c: 0xd4af37, i: 2.5, p: [-5,2,-3] },
     { c: 0xffd060, i: 2.0, p: [0,-4,4] }, { c: 0xfff8e0, i: 1.5, p: [0,10,2] }
    ].forEach(({ c, i, p }) => {
      const l = new THREE.DirectionalLight(c, i); l.position.set(...p); scene.add(l);
    });

    const loader = new GLTFLoader();
    loader.load("/models/ring.glb", (gltf) => {
      const ring = gltf.scene;
      ring.scale.set(0, 0, 0);
      ring.position.set(0, 0.6, 0);
      ring.rotation.x = 0.3; ring.rotation.y = 0.4;
      ring.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.envMapIntensity = 2.0;
          child.material.roughness = Math.min(child.material.roughness, 0.18);
          child.material.metalness = Math.max(child.material.metalness, 0.92);
          // Tint toward warm gold
          if (child.material.color) {
            child.material.color.setRGB(
              child.material.color.r * 1.15,
              child.material.color.g * 1.05,
              child.material.color.b * 0.7
            );
          }
        }
      });
      scene.add(ring);

      // Smaller, cuter scale: 1.4 instead of 2.2
      gsap.to(ring.scale, { x: 1.4, y: 1.4, z: 1.4, duration: 2.0, ease: "elastic.out(1,0.6)", delay: 0.4 });
      gsap.to(ring.rotation, { y: ring.rotation.y + Math.PI * 2, duration: 22, repeat: -1, ease: "none" });
      gsap.to(ring.position, { y: 0.75, duration: 3.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
    });

    const animate = () => { requestAnimationFrame(animate); renderer.render(scene, camera); };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Cinematic text reveal ─────────────────────────────────────────────
    gsap.set([".ic-top-label",".ic-name-thiloka",".ic-ampersand-wrap",
              ".ic-name-devin",".ic-divider",".ic-diamond-row",".ic-sub-lines",".ic-btn"], { opacity: 1 });

    const tl = gsap.timeline({ delay: 0.6 });
    tl.fromTo(".ic-top-label",
      { opacity: 0, y: -20, letterSpacing: "0.55em" },
      { opacity: 1, y: 0,   letterSpacing: "0.35em", duration: 1.3, ease: "power3.out" }
    );
    tl.fromTo(".ic-name-thiloka",
      { opacity: 0, y: 55, filter: "blur(10px)" },
      { opacity: 1, y: 0,  filter: "blur(0px)", duration: 1.5, ease: "expo.out" }, "-=0.5"
    );
    tl.fromTo(".ic-ampersand-wrap",
      { opacity: 0, scale: 0.3, rotate: -20 },
      { opacity: 1, scale: 1,   rotate: 0,   duration: 1.0, ease: "back.out(2.2)" }, "-=0.9"
    );
    tl.fromTo(".ic-name-devin",
      { opacity: 0, y: 55, filter: "blur(10px)" },
      { opacity: 1, y: 0,  filter: "blur(0px)", duration: 1.5, ease: "expo.out" }, "-=1.0"
    );
    tl.fromTo(".ic-divider",
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 1.1, ease: "power3.out" }, "-=0.5"
    );
    tl.fromTo(".ic-diamond-row",
      { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.3"
    );
    tl.fromTo(".ic-sub-lines",
      { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "-=0.3"
    );
    tl.fromTo(".ic-btn",
      { opacity: 0, y: 18, scale: 0.94 },
      { opacity: 1, y: 0,  scale: 1, duration: 1.0, ease: "back.out(1.5)" }, "-=0.4"
    );

    return () => { window.removeEventListener("resize", onResize); renderer.dispose(); };
  }, []);

  const handleOpen = () => {
    setStartMusic(true);
    gsap.to(".ic-cover", { opacity: 0, y: -30, duration: 1.1, ease: "power3.inOut", onComplete: onOpen });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cinzel+Decorative:wght@400&family=Great+Vibes&family=Raleway:wght@300;400&display=swap');

        /* ── Gold shimmer ── */
        @keyframes ic-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes ic-glow-pulse {
          0%,100% { opacity: 0.55; transform: translate(-50%,-50%) scale(1); }
          50%      { opacity: 0.85; transform: translate(-50%,-50%) scale(1.1); }
        }
        @keyframes ic-breathe {
          0%,100% { transform: scaleX(1); opacity: 0.8; }
          50%      { transform: scaleX(1.08); opacity: 1; }
        }
        @keyframes ic-diamond-blink {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.3); }
        }
        @keyframes ic-ring-spin     { to { transform: translate(-50%,-50%) rotate(360deg);  } }
        @keyframes ic-ring-spin-rev { to { transform: translate(-50%,-50%) rotate(-360deg); } }
        @keyframes ic-btn-breathe {
          0%,100% { box-shadow: 0 0 0 0 rgba(198,167,105,0); }
          50%      { box-shadow: 0 0 24px 4px rgba(198,167,105,0.22); }
        }

        .ic-cover { font-family: 'Raleway', sans-serif; }

        /* ── NAMES — the centrepiece ── */
        .ic-name-thiloka,
        .ic-name-devin {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(3.4rem, 10.5vw, 7.2rem);
          line-height: 1.05;
          letter-spacing: 0.02em;
          display: block; margin: 0;
          /* Gentle warm gold shimmer — no harsh whites */
          background: linear-gradient(
            105deg,
            #7a5010 0%,
            #b8922a 18%,
            #d4aa50 32%,
            #c6a040 45%,
            #8a6418 55%,
            #c6a040 65%,
            #d4aa50 78%,
            #b8922a 88%,
            #7a5010 100%
          );
          background-size: 220% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: ic-shimmer 6s linear infinite;
          filter: drop-shadow(0 2px 12px rgba(184,146,42,0.4));
          opacity: 0;
        }
        .ic-name-devin { animation-delay: -3s; }

        /* ── Ampersand ── */
        .ic-ampersand-wrap {
          display: flex; align-items: center; gap: 14px;
          width: 100%; max-width: 340px;
          margin: 2px auto; opacity: 0;
        }
        .ic-ampersand {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(1.5rem, 4vw, 2.6rem);
          background: linear-gradient(135deg, #8a6418 0%, #c6a040 40%, #d4aa50 60%, #b8922a 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: ic-shimmer 5s linear infinite;
          filter: drop-shadow(0 1px 6px rgba(184,146,42,0.45));
          display: inline-block; flex-shrink: 0;
        }
        .ic-amp-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(198,167,105,0.55), transparent);
        }

        /* ── Label ── */
        .ic-top-label {
          font-family: 'Cinzel Decorative', cursive;
          font-size: clamp(0.44rem, 1.1vw, 0.58rem);
          letter-spacing: 0.35em; color: #9a7b3a;
          text-transform: uppercase; font-weight: 400; opacity: 0;
        }

        /* ── Sub lines ── */
        .ic-sub-line {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-weight: 400;
          color: #3d2a08; letter-spacing: 0.06em;
        }

        /* ── Divider ── */
        .ic-divider {
          display: block; width: 130px; height: 1px;
          background: linear-gradient(90deg, transparent, #b8922a 25%, #f0d080 50%, #b8922a 75%, transparent);
          margin: 0 auto; transform-origin: center; opacity: 0;
          animation: ic-breathe 3.5s ease-in-out infinite;
        }

        /* ── Diamonds ── */
        .ic-diamond-row { display: flex; align-items: center; justify-content: center; gap: 14px; opacity: 0; }
        .ic-diamond {
          font-size: 7px; color: #c6a769;
          animation: ic-diamond-blink 2.8s ease-in-out infinite;
        }
        .ic-diamond:nth-child(2) { animation-delay: 0.9s; }
        .ic-diamond:nth-child(3) { animation-delay: 1.8s; }

        /* ── Button ── */
        .ic-btn {
          font-family: 'Cinzel Decorative', cursive;
          font-size: clamp(0.42rem, 1vw, 0.54rem);
          letter-spacing: 0.26em; text-transform: uppercase;
          color: #1a1208; background: transparent;
          border: 1px solid #9a7b3a;
          padding: 15px 44px; cursor: pointer;
          position: relative; overflow: hidden;
          transition: color 0.55s ease, border-color 0.3s;
          /* no opacity:0 here — GSAP fromTo handles it */
          animation: ic-btn-breathe 3s ease-in-out infinite;
        }
        .ic-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, #9a7b3a, #c6a769 40%, #f0d080 60%, #c6a769 80%, #9a7b3a);
          background-size: 200%;
          transform: translateX(-105%);
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .ic-btn:hover::before { transform: translateX(0); }
        .ic-btn:hover { color: #fff; border-color: transparent; }
        .ic-btn span { position: relative; z-index: 1; }

        /* ── Decorative spinning rings ── */
        .ic-deco-ring {
          position: absolute; border-radius: 50%; pointer-events: none; z-index: 1;
          top: 30%; left: 50%;
        }
        .ic-deco-ring--1 {
          width: 320px; height: 320px;
          border: 1px dashed rgba(198,167,105,0.12);
          animation: ic-ring-spin 42s linear infinite;
          transform: translate(-50%,-50%);
        }
        .ic-deco-ring--2 {
          width: 500px; height: 500px;
          border: 1px solid rgba(198,167,105,0.07);
          animation: ic-ring-spin-rev 60s linear infinite;
          transform: translate(-50%,-50%);
        }
        .ic-ring-gem {
          position: absolute; width: 5px; height: 5px;
          background: rgba(198,167,105,0.55); border-radius: 50%;
          box-shadow: 0 0 8px rgba(198,167,105,0.7);
        }

        /* ── Scan line ── */
        .ic-scan-line {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(198,167,105,0.35) 30%, rgba(240,208,128,0.55) 50%, rgba(198,167,105,0.35) 70%, transparent);
          animation: ic-scan 9s ease-in-out infinite;
          pointer-events: none; z-index: 2;
        }
      `}</style>

      <section className="ic-cover" style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(160deg, #f5ede0 0%, #fdf6ec 40%, #f0e6d3 100%)",
      }}>

        {/* Grain */}
        <div style={{
          position:"absolute",inset:0,opacity:0.04,zIndex:0,
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize:"128px",
        }}/>

        {/* Particles */}
        <canvas ref={canvasRef} style={{ position:"absolute",inset:0,pointerEvents:"none",zIndex:1 }} />

        {/* Spinning deco rings */}
        <div className="ic-deco-ring ic-deco-ring--1">
          {[0,90,180,270].map((deg,i) => (
            <div key={i} className="ic-ring-gem" style={{
              top: `${50 + 50*Math.sin(deg*Math.PI/180)}%`,
              left: `${50 + 50*Math.cos(deg*Math.PI/180)}%`,
              transform: "translate(-50%,-50%)",
            }}/>
          ))}
        </div>
        <div className="ic-deco-ring ic-deco-ring--2"/>

        {/* Center glow (mouse reactive) */}
        <div ref={glowRef} style={{
          position:"absolute", width:560, height:560, borderRadius:"50%",
          background:"radial-gradient(ellipse, rgba(198,167,105,0.18) 0%, rgba(198,167,105,0.06) 40%, transparent 70%)",
          pointerEvents:"none", zIndex:1,
          top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          animation:"ic-glow-pulse 4s ease-in-out infinite",
        }}/>

        {/* THREE.JS canvas */}
        <div ref={mountRef} style={{ position:"absolute",inset:0,zIndex:0,pointerEvents:"none" }}/>

        {/* Corner ornaments */}
        {[
          { top:24,left:24 },
          { top:24,right:24,transform:"scaleX(-1)" },
          { bottom:24,left:24,transform:"scaleY(-1)" },
          { bottom:24,right:24,transform:"scale(-1)" },
        ].map((s,i) => (
          <svg key={i} width="64" height="64" viewBox="0 0 64 64"
            style={{ position:"absolute",opacity:0.38,zIndex:3,...s }}>
            <defs>
              <linearGradient id={`cg${i}`} x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c6a769" stopOpacity="0"/>
                <stop offset="50%" stopColor="#c6a769" stopOpacity="1"/>
                <stop offset="100%" stopColor="#f0d080" stopOpacity="0.8"/>
              </linearGradient>
            </defs>
            <path d="M2 62 L2 2 L62 2" fill="none" stroke={`url(#cg${i})`} strokeWidth="1"/>
            <circle cx="2" cy="2" r="2.5" fill="#c6a769"/>
            <circle cx="62" cy="2" r="1.5" fill="none" stroke="#c6a769" strokeWidth="1" opacity="0.5"/>
          </svg>
        ))}

        {/* ── TEXT CONTENT ── */}
        <div ref={contentRef} style={{
          position:"absolute", bottom:0, left:0, right:0,
          minHeight:"56%", height:"auto",
          zIndex:10, textAlign:"center",
          paddingLeft:24, paddingRight:24,
          paddingTop:32, paddingBottom:40,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", gap:0,
          background:"linear-gradient(to bottom, transparent 0%, rgba(245,237,224,0.82) 15%, rgba(245,237,224,0.97) 32%, rgba(245,237,224,1) 48%)",
        }}>

          <p className="ic-top-label" style={{ marginBottom:16 }}>
            Wedding Invitation
          </p>

          {/* ── Names ── */}
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:0,marginBottom:16 }}>
            <span className="ic-name-thiloka">Thiloka</span>

            <div className="ic-ampersand-wrap">
              <div className="ic-amp-line"/>
              <span className="ic-ampersand">&amp;</span>
              <div className="ic-amp-line"/>
            </div>

            <span className="ic-name-devin">Devin</span>
          </div>

          <span className="ic-divider" style={{ marginBottom:14 }}/>

          <div className="ic-diamond-row" style={{ marginBottom:12 }}>
            <span className="ic-diamond">◆</span>
            <span className="ic-diamond">◆</span>
            <span className="ic-diamond">◆</span>
          </div>

          <div className="ic-sub-lines" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:0,marginBottom:26,opacity:0 }}>
            <p className="ic-sub-line" style={{ fontSize:"clamp(0.88rem,2vw,1.05rem)",marginBottom:4 }}>
              Together with their families
            </p>
            <p className="ic-sub-line" style={{ fontSize:"clamp(0.82rem,1.8vw,0.98rem)",marginBottom:0,opacity:0.8 }}>
              invite you to celebrate their union
            </p>
          </div>

          <button className="ic-btn" onClick={handleOpen}>
            <span>Open Invitation</span>
          </button>

        </div>
      </section>
    </>
  );
}