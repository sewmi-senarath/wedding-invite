import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  // Optional subtle animation
  useEffect(() => {
    gsap.to(".music-btn", {
      scale: 1.05,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "sine.inOut"
    });
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  return (
    <>
      {/* AUDIO ELEMENT */}
      <audio ref={audioRef} loop>
        <source src="/music/wedding.mp3" type="audio/mpeg" />
      </audio>

      {/* BUTTON */}
      <button
        onClick={toggleMusic}
        className="music-btn fixed bottom-4 right-4 z-50
                   bg-[#C6A769] text-white p-3 rounded-full shadow-lg"
      >
        {playing ? "🔊" : "🔇"}
      </button>
    </>
  );
}