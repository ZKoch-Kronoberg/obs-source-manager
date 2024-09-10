import { useCallback, useState } from "react";
import "./App.css";
import ConnectionModal from "./components/ConnectionModal";
import { ConnectionInfo } from "./shared";
import { OBSConnectionProvider } from "./contexts/OBSConnectionContext";
import SceneView from "./components/SceneView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RecordingControls from "./components/RecordingControls";

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

  //modal openness
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  function openModal() {
    setModalIsOpen(true);
  }
  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <>
      <main className="w-full min-h-screen px-4 pt-4">
        <h1 className="text-4xl mb-4">OBS Kontrollpanel</h1>
        <button className="border-2 px-2" onClick={openModal}>
          öppna anslutningsinställningar
        </button>
        <ConnectionModal
          isOpen={modalIsOpen}
          onClose={closeModal}
          callback={HandleConnectionInfoSave}
        ></ConnectionModal>
        <div>
          <h2 className="text-2xl">Current Connection Info</h2>
          <p>WebSocket : {connectionInfo.url}</p>
          <p>
            Password:{" "}
            {connectionInfo.password ? connectionInfo.password : "Not set"}
          </p>
        </div>
        <OBSConnectionProvider connectionInfo={connectionInfo}>
          <SceneView />
          <RecordingControls />
        </OBSConnectionProvider>
      </main>
      <footer className="border-t-2 flex flex-row gap-x-2">
        <a href="https://raw.githubusercontent.com/ZKoch-Kronoberg/obs-source-manager/main/LICENSE.txt">
          License
        </a>
        <a href="https://raw.githubusercontent.com/ZKoch-Kronoberg/obs-source-manager/main/oss-attribution/attribution.txt">
          3rd party atributions
        </a>
      </footer>
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
