import OBSWebSocket, { OBSWebSocketError } from "obs-websocket-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ConnectionInfo } from "../shared";

interface OBSConnectionContextType {
  connection: OBSWebSocket | null;
}

export const OBSConnectionContext = createContext<OBSConnectionContextType>({
  connection: null,
});

export const useOBSConnection = () => useContext(OBSConnectionContext);

interface OBSConnectionProviderProps {
  connectionInfo: ConnectionInfo | null;
  children?: ReactNode;
}

export const OBSConnectionProvider: React.FC<OBSConnectionProviderProps> = ({
  connectionInfo,
  children,
}) => {
  const [connection, setConnection] = useState<OBSWebSocket | null>(null);

  useEffect(() => {
    let obs: OBSWebSocket | null = null;

    const connectToOBS = async () => {
      if (connectionInfo) {
        if (obs) {
          obs.disconnect();
          console.log("Disconnected from previous OBS WebSocket");
        }
        try {
          obs = new OBSWebSocket();
          await obs.connect(connectionInfo.url, connectionInfo.password);
          setConnection(obs);
          console.log("Connected to OBS WebSocket");
        } catch (error) {
          if (error instanceof OBSWebSocketError) {
            console.error("Failed to connect to OBS:", error.message);
          } else {
            console.error("Unexpected error:", error);
          }
        }
      }
    };

    connectToOBS();

    // Cleanup function to disconnect on unmount or when connectionInfo changes
    return () => {
      if (obs) {
        obs.disconnect();
        console.log("Disconnected from OBS WebSocket");
      }
    };
  }, [connectionInfo]);

  return (
    <OBSConnectionContext.Provider value={{ connection: connection }}>
      {children}
    </OBSConnectionContext.Provider>
  );
};
