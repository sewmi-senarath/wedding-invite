import { useState } from "react";
import InvitationCover from "./components/InvitationCover";
import SaveTheDate from "./components/SavetheDate";
import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
import EventDetails from "./components/EventDetails";
// import Timeline from "./components/Timeline";
import Map from "./components/Map";
import RSVPForm from "./components/RSVPForm";
import Footer from "./components/Footer";
import MusicPlayer from "./components/MusicPlayer";
import OurStory from "./components/Story";


function App() {
  const [stage, setStage] = useState("cover");

  return (
    <>
      {/* Stage 1: Invitation cover with ring animation */}
      {stage === "cover" && (
        <>
        <Navbar />
        <InvitationCover onOpen={() => setStage("savethedate")} />
        <MusicPlayer />
        </>
      )}

      {/* Stage 2: Full-screen Save the Date with countdown */}
      {stage === "savethedate" && (
        <>
        <Navbar />
        <SaveTheDate />
        <EventDetails />
        <MusicPlayer />
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