import { useEffect } from "react";
import { gsap } from "gsap";

export default function Loader() {
  useEffect(() => {
    gsap.to(".loader", {
      rotate: 360,
      repeat: -1,
      duration: 1,
      ease: "linear"
    });
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="loader w-12 h-12 border-4 border-gold border-t-transparent rounded-full"></div>
    </div>
  );
}