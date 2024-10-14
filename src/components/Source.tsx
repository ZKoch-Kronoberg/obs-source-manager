import { FunctionComponent, useContext, useEffect, useState } from "react";
import { OBSSource } from "../shared";
import { OBSConnectionContext } from "../contexts/OBSConnectionContext";
//import { toast } from "react-toastify";
import { Video, VideoOff } from "react-feather";
import Switch from "react-switch";

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

        if (!source.enabled) {
          /*OBS won't render screenshots for a disabled source and throws an
            an error*/
          return;
        }

        const response = await connection.call("GetSourceScreenshot", {
          sourceName: source.sourceName,
          imageFormat: "jpg",
          imageWidth: 512,
          imageCompressionQuality: 100,
        });

        setImageData(response.imageData);
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          //toast.error(`Error: ${error.message}`);
        } else {
          //toast.error("An unexpected error occured");
        }
      }
    };

    const timeoutId = setTimeout(() => {
      getPreviewImage();
    }, 2000); //2000 milliseconds = 2 seconds

    return () => clearTimeout(timeoutId);
  }, [source, connection]);

  function toggleSourceEnabled() {
    //console.log(`toggling ${source.sourceName}`);
    setEnabled(source, !source.enabled);
  }

  return (
    <li>
      <div className="bg-lightGray flex flex-col rounded-sm border border-gray">
        <div className="border-b-[1px] border-gray w-full px-[16px] py-[8px]">
          <span className="text-p">{source.sourceName}</span>
        </div>
        <div className="p-[16px] h-[160px]">
          {imageData ? (
            <img
              className={`object-scale-down rounded-sm${
                !source.enabled ? " grayscale" : ""
              }`}
              src={`${imageData}`}
              alt={`${source.sourceName} video source preview`}
            />
          ) : null}
        </div>
        <div className="flex flex-row justify-between items-center border-t-[1px] border-gray mt-auto px-[16px] py-[8px]">
          {source.enabled ? <Video /> : <VideoOff />}
          <Switch
            checked={source.enabled as boolean}
            onChange={() => toggleSourceEnabled()}
            aria-label={`Include source ${source.sourceName} in recording`}
            disabled={isRecording}
          ></Switch>
        </div>
      </div>
    </li>
  );
};

export default Source;
