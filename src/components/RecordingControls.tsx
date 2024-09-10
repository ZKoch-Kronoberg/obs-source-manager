import { FunctionComponent, useContext } from "react";
import { OBSConnectionContext } from "../contexts/OBSConnectionContext";

interface RecordingControlsProps {}

const RecordingControls: FunctionComponent<RecordingControlsProps> = () => {
  const { connection, isRecording } = useContext(OBSConnectionContext);
  return <p>{isRecording ? "recording" : "not recording"}</p>;
};

export default RecordingControls;
