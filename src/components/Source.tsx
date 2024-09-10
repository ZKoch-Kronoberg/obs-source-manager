import { FunctionComponent, useContext } from "react";
import { OBSSource } from "../shared";
import { OBSConnectionContext } from "../contexts/OBSConnectionContext";

interface SourceProps {
  source: OBSSource;
  setEnabled: (source: OBSSource, value: boolean) => void;
}

const Source: FunctionComponent<SourceProps> = ({ source, setEnabled }) => {
  const { isRecording } = useContext(OBSConnectionContext);

  function toggleSourceEnabled() {
    //console.log(`toggling ${source.sourceName}`);
    setEnabled(source, !source.enabled);
  }

  return (
    <li>
      <div className="flex flex-col border-2 space-y-1 pb-2">
        <span className="border-b-2 font-semibold px-2">
          {source.sourceName}
        </span>
        <span className="px-2">
          {source.enabled ? "enabled " : "disabled "}
        </span>
        <button
          disabled={isRecording}
          className="border-2 m-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          onClick={toggleSourceEnabled}
        >
          toggle
        </button>
      </div>
    </li>
  );
};

export default Source;
