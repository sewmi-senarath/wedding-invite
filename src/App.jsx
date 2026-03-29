import { useState } from "react";
import InvitationCover from "./components/InvitationCover";
import SaveTheDate from "./components/SavetheDate";
import Navbar from "./components/Navbar";
import EventDetails from "./components/EventDetails";
import Map from "./components/Map";
import RSVPForm from "./components/RSVPForm";
import Footer from "./components/Footer";
import MusicPlayer from "./components/MusicPlayer";
import OurStory from "./components/Story";

function App() {
  const [stage, setStage] = useState("cover");
  const [startMusic, setStartMusic] = useState(false);

  const handleNavigate = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // When invitation opens
  const handleOpenInvitation = () => {
    setStartMusic(true);
    setStage("savethedate");
  };

  return (
    <>
      <MusicPlayer autoPlayTrigger={startMusic} />

      {/* Stage 1: Cover */}
      {stage === "cover" && (
        <>
          <InvitationCover onOpen={handleOpenInvitation} />
        </>
      )}

      {/* Stage 2: Main Website */}
      {stage === "savethedate" && (
        <>
          <Navbar onNavigate={handleNavigate} />
          <SaveTheDate />
          <EventDetails />
          <Map />
          <RSVPForm />
          <OurStory />
          <Footer />
        </>
      )}
    </>
  );
}

export default App;