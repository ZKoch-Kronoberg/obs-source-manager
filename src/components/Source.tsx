import { FunctionComponent } from "react";
import { OBSSource } from "../shared";

interface SourceProps {
  source: OBSSource;
  setEnabled: (source: OBSSource, value: boolean) => void;
}

const Source: FunctionComponent<SourceProps> = ({ source, setEnabled }) => {
  function toggleSourceEnabled() {
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
        <button className="border-2 m-2" onClick={toggleSourceEnabled}>
          toggle
        </button>
      </div>
    </li>
  );
};

export default Source;
