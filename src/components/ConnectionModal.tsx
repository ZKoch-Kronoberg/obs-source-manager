import { FunctionComponent, useEffect, useState } from "react";
import Modal from "react-modal";
import { X, Check } from "react-feather";

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  callback: (wsPort: string, password: string) => void;
}

const ConnectionModal: FunctionComponent<ConnectionModalProps> = ({
  isOpen,
  onClose,
  callback,
}) => {
  //why did I use state here?
  const [wsPort, setWsPort] = useState<string>("4455");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState(false);

  function handleSave() {
    //save connection info to localstorage if remember info box is checked
    if (remember) {
      console.log("Saving connection info");
      localStorage.setItem(
        "connectionInfo",
        JSON.stringify({ port: wsPort, password: password })
      );
    } else {
      //delete saved info if not
      console.log("deleting saved connection info");
      localStorage.removeItem("connectionInfo");
    }

    callback(wsPort, password);
  }

  //pupulate with remembered connection info when component loads
  useEffect(() => {
    const rememberedInfo = localStorage.getItem("connectionInfo");
    if (rememberedInfo) {
      setWsPort(JSON.parse(rememberedInfo).port);
      setPassword(JSON.parse(rememberedInfo).password);
      setRemember(true);
    } else {
      setRemember(false);
    }
  }, []);

  Modal.setAppElement("#root");
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onClose()}
      contentLabel="Connection settings"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onAfterOpen={() => (document.body.style.overflow = "hidden")}
      onAfterClose={() => (document.body.style.overflow = "unset")}
      className="bg-bluishGray rounded-md max-w-[600px] min-h-[475px] mx-auto mt-[32px] p-[32px] px-[20px]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 overflow-auto"
    >
      <div className="relative">
        <button
          className="absolute right-0 text-white"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          <X></X>
        </button>
        <h2 className="text-white text-h2 font-[700] mb-[16px]">Connect</h2>
        <form className="flex flex-col">
          <label
            className="text-white text-p mt-[16px] mb-[8px]"
            htmlFor="wsURL"
          >
            WebSocket Port:{" "}
          </label>
          <input
            className="rounded-sm p-[6px] max-w-[300px]"
            id="wsURL"
            type="text"
            value={wsPort}
            onChange={(e) => setWsPort(e.target.value)}
            placeholder="port"
          />
          <label
            className="text-white text-p mt-[16px] mb-[8px]"
            htmlFor="password"
          >
            Password:{" "}
          </label>
          <input
            className="rounded-sm p-[6px] max-w-[300px]"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter OBS websocket password"
          />
          <div className="flex flex-row mt-[18px] gap-x-1 items-center">
            <div className="relative h-[18px] w-[18px]">
              <input
                className="peer appearance-none border-2 rounded-[4px] h-[18px] w-[18px] border-white"
                type="checkbox"
                defaultChecked={remember}
                id="remember"
                onClick={() => setRemember(!remember)}
              />
              <Check className="absolute inset-0 hidden peer-checked:block pointer-events-none stroke-white h-[18px] w-[18px]" />
            </div>
            <label className="text-white text-[12px]" htmlFor="remember">
              Remember connection info
            </label>
          </div>
          <div className="flex flex-row mt-[24px] gap-x-[16px]">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSave}
            >
              Connect
            </button>
            <button className="btn btn-ghost" type="button" onClick={onClose}>
              Close settings
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ConnectionModal;
