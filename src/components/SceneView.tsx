import { FunctionComponent, useContext, useEffect, useState } from "react";
import { OBSConnectionContext } from "../contexts/OBSConnectionContext";
import { OBSResponseTypes, OBSWebSocketError } from "obs-websocket-js";
import { toast } from "react-toastify";
import { Toast } from "react-toastify/dist/components";

interface SceneViewProps {}

interface masterScene {
  name: string;
  subSceneNames: string[];
}

const SceneView: FunctionComponent<SceneViewProps> = () => {
  const { connection } = useContext(OBSConnectionContext);
  const [masterScene, setMasterScene] = useState<masterScene>();

  useEffect(() => {
    //get list of scenes nested in the current scene
    const getNestedScenes = async () => {
      try {
        if (!connection) {
          throw new Error("couldn't connect to webSocket");
        }

        const currentSceneName = (
          await connection.call("GetCurrentProgramScene")
        ).currentProgramSceneName;
        if (!currentSceneName) {
          throw new Error("couldn't get name of current scene");
          /*I don't think this should be able to happen according to ts but
              it doesn't hurt to validate*/
        }
        console.log("currentScene:", currentSceneName);

        const contents = await connection.call("GetSceneItemList", {
          sceneName: currentSceneName,
        });
        console.log("contents:", contents);
        //filter to only the sceneItems that are a scene source
        const subScenes = contents.sceneItems.filter(
          (sceneItem) => (sceneItem.sourceType = "OBS_SOURCE_TYPE_SCENE")
        );
        console.log("subScenes:", subScenes);
        if (subScenes.length < 1) {
          throw new Error("Could not detect any subscenes");
        }

        //all checks were cleared, set the state
        const subSceneNames = subScenes.map(
          (subscene) => subscene.sourceName as string
        );
        const result: masterScene = {
          name: currentSceneName,
          subSceneNames: subSceneNames,
        };
        setMasterScene({
          name: currentSceneName,
          subSceneNames: subSceneNames,
        });
        toast.success("Your master scene has successfully been read");
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("An unexpected error occured");
        }
      }
    };

    getNestedScenes();
  }, [connection]);

  return (
    <>
      {masterScene !== undefined ? (
        <div>
          <h2>Master Scene: {masterScene.name}</h2>
          <ul>
            {masterScene.subSceneNames.map((subSceneName) => (
              <li key={subSceneName}>{subSceneName}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
};

export default SceneView;
