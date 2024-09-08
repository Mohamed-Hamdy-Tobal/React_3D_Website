import DisplaySection from "./components/DisplaySection";
import Jumbotron from "./components/Jumbotron";
import Nav from "./components/Nav";
import SoundSection from "./components/SoundSection";
import WebjiViewer from "./components/WebjiViewer";

function App() {

  return (
    <div className="App">
      <Nav/>
      <Jumbotron/>
      <SoundSection/>
      <DisplaySection/>
      <WebjiViewer/>
    </div>
  );
}

export default App;
