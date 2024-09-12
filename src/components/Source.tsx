import { FunctionComponent, useContext, useEffect, useState } from "react";
import { OBSSource } from "../shared";
import { OBSConnectionContext } from "../contexts/OBSConnectionContext";
import { toast } from "react-toastify";

interface SourceProps {
  source: OBSSource;
  setEnabled: (source: OBSSource, value: boolean) => void;
}

const Source: FunctionComponent<SourceProps> = ({ source, setEnabled }) => {
  const { connection, isRecording } = useContext(OBSConnectionContext);

  const [imageData, setImageData] = useState<string>();

  useEffect(() => {
    const getPreviewImage = async () => {
      try {
        if (!connection) {
          throw new Error("could not connect to webSocket");
        }

        const response = await connection.call("GetSourceScreenshot", {
          sourceName: source.sourceName,
          imageFormat: "jpg",
          imageWidth: 256,
          imageCompressionQuality: 25,
        });

        setImageData(response.imageData);
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("An unexpected error occured");
        }
      }
    };

    getPreviewImage()
  }, [source, connection]);

  function toggleSourceEnabled() {
    setEnabled(source, !source.enabled);
  }

  return (
    <li>
      <div className="flex flex-col border-2 space-y-1 pb-2">
        <span className="border-b-2 font-semibold px-2">
          {source.sourceName}
        </span>
        {imageData? <img className="mx-2" src={`${imageData}`} alt={`preview of the video source ${source.sourceName}`} /> : null}
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
