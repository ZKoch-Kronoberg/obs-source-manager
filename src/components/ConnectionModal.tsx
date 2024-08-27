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
      contentLabel="Konfigurera anslutning"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >
      <h2>Anslut</h2>
      <form>
        <div>
          <label htmlFor="wsURL">WebSocket Port:</label>
          <input
            id="wsURL"
            type="text"
            value={wsPort}
            onChange={(e) => setWsPort(e.target.value)}
            placeholder="port"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Skriv lösenord"
          />
        </div>
        <button type="button" onClick={handleSave}>
          Spara
        </button>
        <button type="button" onClick={onClose}>
          Stäng
        </button>
      </form>
    </Modal>
  );
};

export default ConnectionModal;
