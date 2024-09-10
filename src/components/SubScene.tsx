import {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { OBSConnectionContext } from "../contexts/OBSConnectionContext";
import { toast } from "react-toastify";
import { OBSSource } from "../shared";
import Source from "./Source";
import { OBSEventTypes } from "obs-websocket-js";

interface SubSceneProps {
  name: string;
}

const SubScene: FunctionComponent<SubSceneProps> = ({ name }) => {
  const { connection } = useContext(OBSConnectionContext);

  const [sources, setSources] = useState<OBSSource[] | undefined>();

  /*This creates one event listener per nested scene which isn't ideal but the
    but the minor performance impact I expect in our usecase doesn't outweigh
    the effort it'd take to move the listener to the master scene  */
  const syncSourceEnabledChange = useCallback(
    async (event: OBSEventTypes["SceneItemEnableStateChanged"]) => {
      try {
        //check if the event concerns this nested scene
        if (event.sceneName !== name) {
          return;
        }

        if (!sources) {
          throw new Error(
            `could not load sources list in nested scene ${name}`
          );
        }

        //console.log("sources in event handler:", sources);

        //find source with id matching event's
        const changedSource = sources.find(
          (source) => source.sceneItemId === event.sceneItemId
        );
        if (!changedSource) {
          throw new Error(
            "could not find source corresponding to recived" +
              "source visibility change event"
          );
        }

        if (!connection) {
          throw new Error("could not connect to webSocket");
        }

        //update source record filter to match updated sceneItem
        await connection.call("SetSourceFilterEnabled", {
          sourceName: changedSource.sourceName,
          filterName: "Source Record",
          filterEnabled: event.sceneItemEnabled,
        });

        console.log(
          `synced ${changedSource.sourceName} to ${event.sceneItemEnabled}`
        );

        /*generate copy of sources state with the enabled property of the
        changed source updated*/
        const updatedSources = sources.map((source) => {
          if (source.sceneItemId === changedSource.sceneItemId) {
            return { ...source, enabled: event.sceneItemEnabled };
          }
          return source;
        });

        //console.log("updatedSources:", updatedSources);

        setSources(updatedSources);
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("An unexpected error occured");
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sources]
  );

  //get current subscene's information
  useEffect(() => {
    const getSources = async () => {
      try {
        if (!connection) {
          throw new Error("could not connect to webSocket");
        }

        const response = await connection.call("GetSceneItemList", {
          sceneName: name,
        });
        if (response.sceneItems.length < 1) {
          throw new Error(`could not detect any sceneItems in ${name}`);
        }
        console.log(`${name}`, response.sceneItems);

        const foundSourceObjects = response.sceneItems.filter((source) => {
          return source.sourceType === "OBS_SOURCE_TYPE_INPUT";
        });
        if (foundSourceObjects.length < 1) {
          throw new Error(`could not detect any inputs in ${name}`);
        }

        const foundSources: OBSSource[] = foundSourceObjects.map((source) => ({
          sceneName: name,
          sourceName: source.sourceName as string,
          sceneItemId: source.sceneItemId as number,
          enabled: null,
        }));

        for (const source of foundSources) {
          const result = await connection.call("GetSceneItemEnabled", {
            sceneName: source.sceneName as string,
            sceneItemId: source.sceneItemId as number,
          });
          source.enabled = result.sceneItemEnabled;
        }

        console.log("foundSources:", foundSources);

        setSources(foundSources);
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("An unexpected error occured");
        }
      }
    };

    getSources();
    //console.log("sources after setting:", sources);

    //cleanup function
    return () => {
      connection?.off("SceneItemEnableStateChanged", syncSourceEnabledChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, name]);

  useEffect(() => {
    console.log("Sources updated to:", sources);

    if (sources && connection) {
      // Set up the event handler only if sources are available
      connection.on("SceneItemEnableStateChanged", syncSourceEnabledChange);

      // Cleanup function to remove the event listener when the component unmounts or sources change
      return () => {
        connection.off("SceneItemEnableStateChanged", syncSourceEnabledChange);
      };
    }
  }, [sources, connection, syncSourceEnabledChange]);

  const setSourceEnabled = useCallback(
    async (source: OBSSource, value: boolean) => {
      try {
        if (!connection) {
          throw new Error("could not connect to webSocket");
        }

        await connection.call("SetSceneItemEnabled", {
          sceneName: source.sceneName,
          sceneItemId: source.sceneItemId,
          sceneItemEnabled: value,
        });
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("An unexpected error occured");
        }
      }
      return;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const SetAllSourcesEnabled = useCallback(
    async (value: boolean) => {
      try {
        if (!connection) {
          throw new Error("could not connect to webSocket");
        }

        if (!sources) {
          throw new Error(
            `could not load sources list in nested scene ${name}`
          );
        }

        console.log("setting all");

        for (const source of sources) {
          console.log(`setting ${source.sourceName} to: ${true}`);
          connection.call("SetSceneItemEnabled", {
            sceneName: source.sceneName,
            sceneItemId: source.sceneItemId,
            sceneItemEnabled: value,
          });

          // can't rely on the event listener to update the control panel's state for me
          const UpdatedSources = sources.map((source) => {
            return { ...source, enabled: value };
          });

          setSources(UpdatedSources);
        }
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("An unexpected error occured");
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sources]
  );

  // apply this https://inclusive-components.design/a-todo-list/ to both this conponent and sceneview
  return (
    <li className="border-2">
      <div className="flex flex-row flex-wrap gap-x-2 gap-y-1 p-1 border-b-2">
        <h3 className="text-xl">{name}</h3>
        <div className="flex flex-row flex-wrap gap-x-2 gap-y-1">
          <button
            className="border-2"
            onClick={() => SetAllSourcesEnabled(true)}
          >
            Enable all
          </button>
          <button
            className="border-2"
            onClick={() => SetAllSourcesEnabled(false)}
          >
            Disable all
          </button>
        </div>
      </div>
      {sources ? (
        <ul className="flex flex-row flex-wrap gap-x-2 gap-y-1 p-2">
          {sources.map((source) => (
            <Source
              source={source}
              key={source.sourceName}
              setEnabled={setSourceEnabled}
            ></Source>
          ))}
        </ul>
      ) : null}
    </li>
  );
};

export default SubScene;
