import React, { useCallback, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Modal from "react-modal";
import ConnectionModal from "./components/ConnectionModal";
import OBSWebSocket, { OBSWebSocketError } from "obs-websocket-js";

function App() {
  //STATE
  //connection info
  const [connectionInfo, setConnectionInfo] = useState<{
    url: string;
    password: string;
  }>({
    url: "ws://localhost:4455",
    password: "",
  });
  // Updated handler
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
  const [connection, setConnection] = useState<OBSWebSocket>();

  //USEFFECTS
  useEffect(() => {
    const connectToOBS = async () => {
      try {
        const obs = new OBSWebSocket();
        await obs.connect(connectionInfo.url, connectionInfo.password);
        setConnection(obs);
      } catch (error) {
        if (error instanceof OBSWebSocketError) {
          console.error("Failed to connect to OBS:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };
    console.log(connectionInfo);
    connectToOBS();

    //cleanup function
    return () => {
      if (connection) {
        connection.disconnect();
        console.log("Disconnected from OBS WebSocket");
      }
    };
  }, [connectionInfo]);

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
    </>
  );
}

export default App;
