import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";

export default function InvitationCover({ onOpen }) {
  const mountRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    mountRef.current.appendChild(renderer.domElement);

    // ── LIGHTING ──────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xd4af37, 0.8));

    const keyLight = new THREE.DirectionalLight(0xd4af37, 3.5);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.5);
    rimLight.position.set(-5, 2, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xd4af37, 1.2);
    fillLight.position.set(0, -4, 4);
    scene.add(fillLight);

    // ── RING MODEL ────────────────────────────────────────
    const loader = new GLTFLoader();
    loader.load("/models/ring.glb", (gltf) => {
      const ring = gltf.scene;

      // Larger, centered, better angle
      ring.scale.set(2.2, 2.2, 2.2);
      ring.position.set(0, 0.4, 0);  // gentle upward offset, not too extreme
      ring.rotation.x = 0.25;
      ring.rotation.y = 0.4;

      ring.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.envMapIntensity = 4.5;
          child.material.roughness = Math.min(child.material.roughness, 0.5);
          child.material.metalness = Math.max(child.material.metalness, 0.0);
        }
      });

      scene.add(ring);

      // Slow, elegant rotation
      gsap.to(ring.rotation, {
        y: ring.rotation.y + Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: "none",
      });

      // Gentle float
      gsap.to(ring.position, {
        y: 0.7,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // Entrance animation
      ring.scale.set(0, 0, 0);
      gsap.to(ring.scale, {
        x: 2.2, y: 2.2, z: 2.2,
        duration: 1.6,
        ease: "back.out(1.4)",
        delay: 0.3,
      });
    });

    // ── RENDER LOOP ───────────────────────────────────────
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // ── TEXT ENTRANCE ─────────────────────────────────────
    // Use gsap.set first to ensure elements start visible if animation fails
    gsap.set([".ic-top-label", ".ic-names", ".ic-divider", ".ic-sub-lines", ".ic-btn"], {
      opacity: 1,
    });

    gsap.fromTo(".ic-top-label",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.8 }
    );
    gsap.fromTo(".ic-names",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.4, ease: "expo.out", delay: 1.0 }
    );
    gsap.fromTo(".ic-divider",
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: "power2.out", delay: 1.4 }
    );
    gsap.fromTo(".ic-sub-lines",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power2.out", delay: 1.6 }
    );
    gsap.fromTo(".ic-btn",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power2.out", delay: 1.9 }
    );

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  const handleOpen = () => {
    gsap.to(".ic-cover", {
      opacity: 0,
      y: -30,
      duration: 1.1,
      ease: "power3.inOut",
      onComplete: onOpen,
    });
  };

  return (
    <>
      {/* ── GOOGLE FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel+Decorative:wght@400&family=Raleway:wght@300;400&display=swap');

        .ic-cover {
          font-family: 'Raleway', sans-serif;
        }

        .ic-names {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #0d0905;
          text-shadow:
            0 1px 0 rgba(255,255,255,0.8),
            0 2px 20px rgba(0,0,0,0.12);
        }

        .ic-top-label {
          font-family: 'Cinzel Decorative', cursive;
          font-size: 0.6rem;
          letter-spacing: 0.35em;
          color: #7a5c1e;
          text-transform: uppercase;
          font-weight: 700;
        }

        .ic-sub-line {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 500;
          color: #1c140a;
          letter-spacing: 0.06em;
        }

        .ic-divider {
          display: block;
          width: 100px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c6a769, transparent);
          margin: 0 auto;
          transform-origin: center;
        }

        .ic-diamond-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #7a5c1e;
          font-size: 8px;
          letter-spacing: 6px;
        }

        .ic-btn {
          font-family: 'Cinzel Decorative', cursive;
          font-size: 0.55rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #0d0905;
          background: transparent;
          border: 1.5px solid #7a5c1e;
          padding: 14px 40px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: color 0.5s ease;
          font-weight: 700;
        }

        .ic-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #c6a769, #e8d09a, #c6a769);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }

        .ic-btn:hover::before {
          transform: translateX(0);
        }

        .ic-btn:hover {
          color: #fff;
        }

        .ic-btn span {
          position: relative;
          z-index: 1;
        }

        /* Floating petals */
        @keyframes floatPetal {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }

        .petal {
          position: absolute;
          width: 6px;
          height: 10px;
          border-radius: 50% 0 50% 0;
          background: rgba(198,167,105,0.35);
          animation: floatPetal linear infinite;
          pointer-events: none;
        }
      `}</style>

      <section
        className="ic-cover"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          /* Rich deep cream — warm and legible */
          background: "linear-gradient(160deg, #f5ede0 0%, #fdf6ec 40%, #f0e6d3 100%)",
        }}
      >
        {/* Subtle grain texture overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }} />

        {/* Radial glow behind ring */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(198,167,105,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Decorative corner lines */}
        {[
          { top: 24, left: 24 },
          { top: 24, right: 24, transform: "scaleX(-1)" },
          { bottom: 24, left: 24, transform: "scaleY(-1)" },
          { bottom: 24, right: 24, transform: "scale(-1)" },
        ].map((style, i) => (
          <svg key={i} width="60" height="60" viewBox="0 0 60 60"
            style={{ position: "absolute", opacity: 0.45, ...style }}>
            <path d="M2 58 L2 2 L58 2" fill="none" stroke="#c6a769" strokeWidth="1" />
            <circle cx="2" cy="2" r="2" fill="#c6a769" />
          </svg>
        ))}

        {/* Floating petals */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="petal" style={{
            left: `${10 + i * 12}%`,
            bottom: "-20px",
            animationDuration: `${8 + i * 1.5}s`,
            animationDelay: `${i * 1.2}s`,
            transform: `rotate(${i * 45}deg)`,
          }} />
        ))}

        {/* THREE.JS CANVAS — full-screen background, behind all text */}
        <div ref={mountRef} style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }} />

        {/* TEXT CONTENT — always above the ring canvas via z-index */}
        <div className="ic-sub" style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "52%",
          zIndex: 10,
          textAlign: "center",
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          /* Frosted cream panel — fully opaque at bottom, fades to transparent at top */
          background: "linear-gradient(to bottom, transparent 0%, rgba(240,230,215,0.85) 20%, rgba(240,230,215,1) 38%)",
        }}>

          <p className="ic-top-label" style={{ marginBottom: 18 }}>
            Wedding Invitation
          </p>

          <h1 className="ic-names" style={{
            fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
            lineHeight: 1.1,
            marginBottom: 20,
          }}>
            Thiloka &amp; Devin
          </h1>

          <span className="ic-divider" style={{ marginBottom: 18 }} />

          <div className="ic-diamond-row" style={{ marginBottom: 16 }}>
            ◆ &nbsp;&nbsp; ◆ &nbsp;&nbsp; ◆
          </div>

          <div className="ic-sub-lines" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, marginBottom: 36 }}>
            <p className="ic-sub-line" style={{ fontSize: "clamp(0.9rem, 2vw, 1.1rem)", marginBottom: 6 }}>
              Together with their families
            </p>
            <p className="ic-sub-line" style={{ fontSize: "clamp(0.85rem, 1.8vw, 1rem)", marginBottom: 0 }}>
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