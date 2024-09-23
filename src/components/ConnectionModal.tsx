import { FunctionComponent, useState } from "react";
import Modal from "react-modal";

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
  const [wsPort, setWsPort] = useState<string>("4455");
  const [password, setPassword] = useState<string>("");

  function handleSave() {
    callback(wsPort, password);
  }

  Modal.setAppElement("#root");
  return (
    <Modal
      isOpen={isOpen}
      onAfterClose={onClose}
      contentLabel="Connection settings"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >
      <h2 className="text-4xl mb-4">Connect</h2>
      <form>
        <div>
          <label htmlFor="wsURL">WebSocket Port: </label>
          <input
            className="border-2"
            id="wsURL"
            type="text"
            value={wsPort}
            onChange={(e) => setWsPort(e.target.value)}
            placeholder="port"
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            className="border-2"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Skriv lösenord"
          />
        </div>
        <div className="flex flex-row gap-x-2 mt-2">
          <button className="border-2 px-2" type="button" onClick={handleSave}>
            Save
          </button>
          <button className="border-2 px-2" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ConnectionModal;
