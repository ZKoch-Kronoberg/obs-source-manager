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
  /*TODO: figure out why exactly the app instantly tries to connec on its own
          I think it's something with OBSConnectionContext*/
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
      <main className="w-full min-h-screen pt-[66px] flex flex-col">
        <div className="flex flex-col items-start mobile:flex-row mobile:items-center justify-between mx-[20px] tablet:mx-[122px] mb-[32px] font-[400] gap-y-[32px]">
          <h1 className="text-h1 text-white">OBS Control panel</h1>
          <div className="flex flex-row gap-x-[8px] tablet:gap-x-[12px]">
            <button
              className="text-white font-[700] bg-purplishBlue rounded-full p-[12px]"
              onClick={openConnectionModal}
            >
              Open connection settings
            </button>
            <button
              className="text-white font-[700] rounded-full border border-white p-[12px]"
              onClick={openHelpModal}
            >
              Help
            </button>
          </div>
        </div>
        <ConnectionModal
          isOpen={connectionModalIsOpen}
          onClose={closeConnectionModal}
          callback={HandleConnectionInfoSave}
        />
        <HelpModal isOpen={helpModalIsOpen} onClose={closeHelpModal} />
        {/* <div>
          <h2 className="text-2xl">Current Connection Info</h2>
          <p>WebSocket : {connectionInfo.url}</p>
          <p>Password: {connectionInfo.password ? "*******" : "Not set"}</p>
        </div> */}
        <OBSConnectionProvider connectionInfo={connectionInfo}>
          <SceneView />
          <RecordingControls />
        </OBSConnectionProvider>
      </main>
      <ToastContainer
        position="bottom-right"
        autoClose={false}
        transition={Slide}
        newestOnTop={true}
      />
      <footer className="bg-lightGray  flex flex-row gap-x-[12px] px-[20px] tablet:px-[122px] pt-[16px]">
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
