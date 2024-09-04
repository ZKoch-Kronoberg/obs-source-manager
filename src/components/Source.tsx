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
      <div>
        {source.sourceName}: {source.enabled ? "enabled " : "disabled "}
        <button onClick={toggleSourceEnabled}>toggle</button>
      </div>
    </li>
  );
};

export default Source;
