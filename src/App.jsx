import { useRef } from "react";
import DisplaySection from "./components/DisplaySection";
import Jumbotron from "./components/Jumbotron";
import Nav from "./components/Nav";
import SoundSection from "./components/SoundSection";
import WebjiViewer from "./components/WebjiViewer";
import Loader from "./components/Loader";

function App() {

  const webgiViewerRef = useRef()
  const contentRef = useRef()

  const handlePreview = () => {
    webgiViewerRef.current.triggerPreview();
  }

  return (
    <div className="App">
      <Loader/>
      <div id="id" ref={contentRef}>
        <Nav />
        <Jumbotron />
        <SoundSection />
        <DisplaySection triggerPreview={handlePreview} />
      </div>
      <WebjiViewer contentRef={contentRef} ref={webgiViewerRef} />
    </div>
  );
}

export default App;
