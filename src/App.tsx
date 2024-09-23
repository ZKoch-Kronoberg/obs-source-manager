import { useCallback, useState } from "react";
import "./App.css";
import ConnectionModal from "./components/ConnectionModal";
import { ConnectionInfo } from "./shared";
import { OBSConnectionProvider } from "./contexts/OBSConnectionContext";
import SceneView from "./components/SceneView";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RecordingControls from "./components/RecordingControls";
import HelpModal from "./components/HelpModal";

function App() {
  //STATE
  //connection info
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    url: "ws://localhost:4455",
    password: "",
  });
  const HandleConnectionInfoSave = useCallback(
    (wsPort: string, wsPassword: string) => {
      setConnectionInfo({
        url: "ws://localhost:" + wsPort,
        password: wsPassword,
      });
    },
    []
  );

  //connection modal openness
  const [connectionModalIsOpen, setConnectionModalIsOpen] =
    useState<boolean>(false);
  function openConnectionModal() {
    setConnectionModalIsOpen(true);
  }
  function closeConnectionModal() {
    setConnectionModalIsOpen(false);
  }

  // modal openness
  const [helpModalIsOpen, setHelpModalIsOpen] = useState<boolean>(false);
  function openHelpModal() {
    setHelpModalIsOpen(true);
  }
  function closeHelpModal() {
    setHelpModalIsOpen(false);
  }

  return (
    <>
      <main className="w-full min-h-screen max-h-full px-4 pt-4">
        <h1 className="text-4xl mb-4">OBS Control panel</h1>
        <div className="flex flex-row gap-x-2">
          <button className="border-2 px-2" onClick={openConnectionModal}>
            Open connection settings
          </button>
          <button className="border-2 px-2" onClick={openHelpModal}>
            Help
          </button>
        </div>
        <ConnectionModal
          isOpen={connectionModalIsOpen}
          onClose={closeConnectionModal}
          callback={HandleConnectionInfoSave}
        />
        <HelpModal isOpen={helpModalIsOpen} onClose={closeHelpModal} />
        <div>
          <h2 className="text-2xl">Current Connection Info</h2>
          <p>WebSocket : {connectionInfo.url}</p>
          <p>
            Password:{" "}
            {connectionInfo.password
              ? /* connectionInfo.password */ "*******"
              : "Not set"}
          </p>
        </div>
        <OBSConnectionProvider connectionInfo={connectionInfo}>
          <SceneView />
          <RecordingControls />
        </OBSConnectionProvider>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={false}
        transition={Slide}
      />
      <footer className="border-t-2 flex flex-row gap-x-2 mt-2">
        <a href="https://raw.githubusercontent.com/ZKoch-Kronoberg/obs-source-manager/main/LICENSE.txt">
          License
        </a>
        <a href="https://raw.githubusercontent.com/ZKoch-Kronoberg/obs-source-manager/main/oss-attribution/attribution.txt">
          3rd party atributions
        </a>
      </footer>
    </>
  );
}

export default App;
