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

  //!!THIS HAS TO BE USECALLBACK BC OF SOMETHING CALLED STALE CLOSURES
  async function syncSourceEnabledChange(
    event: OBSEventTypes["SceneItemEnableStateChanged"]
  ) {
    console.log(sources);
    try {
      if (!sources) {
        throw new Error(`could not load sources list in nested scene ${name}`);
      }
      const changedSource = sources.find((source) => {
        return source.sourceName === event.sceneName;
      });

      if (!changedSource) {
        console.log("a");
        return; // means the changed source wasn't in this subscene;
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
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unexpected error occured");
      }
    }
  }

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

        console.log("sources:", foundSources);

        connection.on("SceneItemEnableStateChanged", syncSourceEnabledChange);

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
    console.log("sources after setting:", sources);

    //cleanup function
    return () => {
      connection?.off("SceneItemEnableStateChanged", syncSourceEnabledChange);
    };
  }, [connection, name]);

  useEffect(() => {
    console.log("Sources updated:", sources);

    if (sources && connection) {
      // Set up the event handler only if sources are available
      connection.on("SceneItemEnableStateChanged", syncSourceEnabledChange);

      // Cleanup function to remove the event listener when the component unmounts or sources change
      return () => {
        connection.off("SceneItemEnableStateChanged", syncSourceEnabledChange);
      };
    }
  }, [sources, connection]);

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
    []
  );

  // apply this https://inclusive-components.design/a-todo-list/ to both this conponent and sceneview
  return (
    <li>
      <h3>{name}</h3>
      {sources ? (
        <ul>
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
