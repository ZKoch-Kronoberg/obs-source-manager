import { FunctionComponent, useContext } from "react";
import { OBSConnectionContext } from "../contexts/OBSConnectionContext";
import { toast } from "react-toastify";

interface RecordingControlsProps {}

const RecordingControls: FunctionComponent<RecordingControlsProps> = () => {
  const { connection, isRecording } = useContext(OBSConnectionContext);

  async function startRecording() {
    try {
      if (!connection) {
        throw new Error("could not connect to webSocket");
      }

      await connection.call("StartRecord");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        //toast.error(`Error: ${error.message}`);
      } else {
        //toast.error("An unexpected error occured");
      }
    }
  }

  async function stopRecording() {
    try {
      if (!connection) {
        throw new Error("could not connect to webSocket");
      }

      const response = await connection.call("StopRecord");
      toast.success(`Saved combined recording to ${response.outputPath}`);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        //toast.error(`Error: ${error.message}`);
      } else {
        //toast.error("An unexpected error occured");
      }
    }
  }

  return (
    <>
      <span className="text-lg">
        {isRecording ? "Recording is in progress" : "Not recording"}
      </span>
      <div className="flex flex-row flex-wrap gap-x-2 gap-y-1 mt-2">
        <button
          disabled={isRecording}
          onClick={startRecording}
          className="border-2 px-1 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          aria-label="Start recording"
          aria-describedby="recordingInfo"
        >
          Start recording
        </button>
        <button
          disabled={!isRecording}
          onClick={stopRecording}
          className="border-2 px-1 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          Stop recording
        </button>
      </div>
      <span id="recordingInfo">
        Note: you will not be able to change which sources are being recorded
        once a recording is in progress.
      </span>
    </>
  );
};

export default RecordingControls;
