import { FunctionComponent, useState } from "react";
import Modal from "react-modal";
import { X } from "react-feather";

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

  function handleSave() {
    callback(wsPort, password);
  }

  Modal.setAppElement("#root");
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onClose()}
      contentLabel="Connection settings"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      className="bg-gray border border-white rounded-md max-w-[600px] min-h-[475px] mx-auto mt-[32px] p-[32px]"
      overlayClassName="absolute inset-0 bg-black bg-opacity-50 overflow-auto"
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
          <div className="flex flex-row mt-[24px] gap-x-[16px]">
            <button
              className="bg-offblack text-white font-[700] rounded-full p-[12px]"
              type="button"
              onClick={handleSave}
            >
              Save settings
            </button>
            <button
              className="text-white font-[700] border border-white rounded-full p-[12px]"
              type="button"
              onClick={onClose}
            >
              Close settings
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ConnectionModal;
