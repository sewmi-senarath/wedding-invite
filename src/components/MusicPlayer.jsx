import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

export default function MusicPlayer({ autoPlayTrigger }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(true); // ✅ default ON

  // Animation
  useEffect(() => {
    gsap.to(".music-btn", {
      scale: 1.05,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "sine.inOut"
    });
  }, []);

  // ✅ Auto play AFTER user interaction
  useEffect(() => {
    if (autoPlayTrigger && audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play()
        .then(() => {
          // Smooth fade-in (premium feel)
          gsap.to(audioRef.current, {
            volume: 1,
            duration: 2
          });
          setPlaying(true);
        })
        .catch(() => {
          // If blocked, keep it off
          setPlaying(false);
        });
    }
  }, [autoPlayTrigger]);

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
      <audio ref={audioRef} loop>
        <source src="/music/wedding.mp3" type="audio/mpeg" />
      </audio>

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