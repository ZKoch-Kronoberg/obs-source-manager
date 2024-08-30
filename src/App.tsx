import { useCallback, useEffect, useState } from "react";
import "./App.css";
import ConnectionModal from "./components/ConnectionModal";
import OBSWebSocket, { OBSWebSocketError } from "obs-websocket-js";
import { ConnectionInfo } from "./shared";
import { OBSConnectionProvider } from "./contexts/OBSConnectionContext";
import SceneView from "./components/SceneView";

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

  //OBS connection

  return (
    <>
      <h1>OBS Kontrollpanel</h1>
      <button onClick={openModal}>öppna anslutningsinställningar</button>
      <ConnectionModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        callback={HandleConnectionInfoSave}
      ></ConnectionModal>
      <div>
        <h2>Current Connection Info</h2>
        <p>WebSocket : {connectionInfo.url}</p>
        <p>
          Password:{" "}
          {connectionInfo.password ? connectionInfo.password : "Not set"}
        </p>
      </div>
      <OBSConnectionProvider connectionInfo={connectionInfo}>
        <SceneView></SceneView>
      </OBSConnectionProvider>
      <footer>
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
