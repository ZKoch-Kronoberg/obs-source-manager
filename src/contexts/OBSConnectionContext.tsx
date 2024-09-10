import OBSWebSocket, {
  OBSEventTypes,
  OBSWebSocketError,
} from "obs-websocket-js";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ConnectionInfo } from "../shared";
import { toast } from "react-toastify";

interface OBSConnectionContextType {
  connection: OBSWebSocket | null;
  isRecording: boolean;
}

export const OBSConnectionContext = createContext<OBSConnectionContextType>({
  connection: null,
  isRecording: false,
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
  const [isRecording, setisRecording] = useState<boolean>(false);

  useEffect(() => {
    let obs: OBSWebSocket | null = null;

    const connectToOBS = async () => {
      if (connectionInfo) {
        //this doesn't seem to trigger and I don't remember what the idea was
        if (obs) {
          obs.disconnect();
          console.log("Disconnected from previous OBS WebSocket");
        }
        try {
          obs = new OBSWebSocket();
          await obs.connect(connectionInfo.url, connectionInfo.password);
          setConnection(obs);
          console.log("Connected to OBS WebSocket");
          toast.info("Connected to OBS WebSocket");
        } catch (error) {
          if (error instanceof OBSWebSocketError) {
            console.error("Failed to connect to OBS:", error.message);
            toast.error(`Failed to connect to OBS:${error.message}`);
          } else {
            console.error("Unexpected error:", error);
            toast.error("An unexpected error occured");
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
        toast.info("Disconnected from OBS WebSocket");
      }
    };
  }, [connectionInfo]);

  const syncIsRecording = useCallback(
    async (event: OBSEventTypes["RecordStateChanged"]) => {
      console.log("event.outputActive:", event.outputActive);
      setisRecording(event.outputActive);
    },
    []
  );

  useEffect(() => {
    const getRecordingStatus = async () => {
      if (!connection) {
        console.log("can't get recording status yet, not connected");
        return;
      }

      const result = await connection.call("GetRecordStatus");
      console.log(result);
      setisRecording(result.outputActive);
      console.log("isRecording was set to:", result.outputActive);

      connection.on("RecordStateChanged", syncIsRecording);
    };

    getRecordingStatus();
    return () => {
      connection?.off("RecordStateChanged", syncIsRecording);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  return (
    <OBSConnectionContext.Provider
      value={{ connection: connection, isRecording: isRecording }}
    >
      {children}
    </OBSConnectionContext.Provider>
  );
};
