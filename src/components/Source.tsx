import { FunctionComponent, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { OBSConnectionContext } from "../contexts/OBSConnectionContext";
import { OBSSource } from "../shared";
import { OBSEventTypes } from "obs-websocket-js";

interface SourceProps {
  identifier: OBSSource;
  setEnabled: (value: boolean) => void;
}

const Source: FunctionComponent<SourceProps> = ({ identifier, setEnabled }) => {
  const { connection } = useContext(OBSConnectionContext);

  async function handleSourceEnabledChange(
    event: OBSEventTypes["SceneItemEnableStateChanged"]
  ) {
    console.log(event, identifier);
    if (
      !(
        event.sceneName === identifier.sceneName &&
        event.sceneItemId === identifier.sceneItemId
      )
    ) {
      return;
    }
    try {
      if (!connection) {
        throw new Error("couldn't connect to webSocket");
      }

      //update source record filter to match updated scene i
      await connection.call("SetSourceFilterEnabled", {
        //should be isolated to a function
        sourceName: identifier.sourceName,
        filterName: "Source Record",
        filterEnabled: event.sceneItemEnabled,
      });

      setEnabled(event.sceneItemEnabled);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unexpected error occured");
      }
    }
  }

  async function toggleSourceEnabled() {
    try {
      if (!connection) {
        throw new Error("couldn't connect to webSocket");
      }

      await connection.call("SetSceneItemEnabled", {
        sceneName: identifier.sceneName,
        sceneItemId: identifier.sceneItemId,
        sceneItemEnabled: !identifier.enabled,
      });
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unexpected error occured");
      }
    }
  }

  /*First time component is rendered read visibility of source and set initial
    state and source record endabledness in OBS accordingly.*/
  useEffect(() => {
    const setup = async () => {
      try {
        if (!connection) {
          throw new Error("couldn't connect to webSocket");
        }

        const response = await connection.call("GetSceneItemEnabled", {
          sceneItemId: identifier.sceneItemId,
          sceneName: identifier.sceneName,
        });
        console.log(`${identifier.sourceName}:`, response.sceneItemEnabled);
        const isEnabled = response.sceneItemEnabled;

        //set source record filter to match source's enabledness
        await connection.call("SetSourceFilterEnabled", {
          //should be isolated to a function
          sourceName: identifier.sourceName,
          filterName: "Source Record",
          filterEnabled: isEnabled,
        });

        /*set up event listener to try and prevent desyncs from messing with
          OBS' UI while the app is connected */

        connection.on("SceneItemEnableStateChanged", handleSourceEnabledChange);

        setEnabled(isEnabled);
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("An unexpected error occured");
        }
      }
    };

    setup();

    //cleanup
    return () => {
      connection?.off("SceneItemEnableStateChanged", handleSourceEnabledChange);
    };
  }, []);

  return (
    <li>
      <div>
        {identifier.sourceName}: {identifier.enabled ? "enabled " : "disabled "}
        <button onClick={toggleSourceEnabled}>toggle</button>
      </div>
    </li>
  );
};

export default Source;
