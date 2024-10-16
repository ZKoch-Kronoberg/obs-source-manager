import { FunctionComponent, useContext, useEffect, useState } from "react";
import { OBSConnectionContext } from "../contexts/OBSConnectionContext";
import { toast } from "react-toastify";

interface RecordingControlsProps {}

const RecordingControls: FunctionComponent<RecordingControlsProps> = () => {
  const { connection, isRecording, recordingStartTime } =
    useContext(OBSConnectionContext);

  const [recordingDuration, setRecordingDuration] = useState<number>(0);

  function formatDuration(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    if (recordingStartTime === null || isRecording === false) {
      return;
    }

    const timerUpdateInterval = setInterval(() => {
      const calculatedDuration =
        new Date().getTime() - recordingStartTime.getTime();
      setRecordingDuration(calculatedDuration);
    }, 1000);

    return () => {
      clearInterval(timerUpdateInterval);
      setRecordingDuration(0);
    };
  }, [isRecording, recordingStartTime]);

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
    <div className=" bg-lightGray rounded-t-lg px-[20px] tablet:px-[121px] pt-[32px] mt-auto">
      <div className="text-h2 font-[700] mb-[16px]">
        {isRecording ? "Recording is in progress" : "Not recording"}
      </div>
      <div role="timer" className="mb-[18px]">
        {formatDuration(recordingDuration)}
      </div>
      {isRecording ? (
        <button
          className="bg-offblack text-white font-[700] flex items-center justify-center gap-x-[12px] rounded-full p-[12px] mb-[16px]"
          onClick={stopRecording}
          aria-label="Stop recording"
          aria-describedby="recordingInfo"
        >
          <span>Stop recording</span>
          <span className="text-white text-[19px]" role="img">
            ■
          </span>
        </button>
      ) : (
        <button
          className="bg-offblack text-white font-[700] flex items-center justify-center gap-x-[12px] rounded-full p-[12px] mb-[16px]"
          onClick={startRecording}
          aria-label="Start recording"
          aria-describedby="recordingInfo"
        >
          <span>Start recording</span>
          <span className="text-[#F00006] text-[19px]" role="img">
            ⬤
          </span>
        </button>
      )}
      <p id="recordingInfo mb-[49px] text-[12px]">
        Note: you will not be able to change which sources are being recorded
        once a recording is in progress.
      </p>
    </div>
  );
};

export default RecordingControls;
