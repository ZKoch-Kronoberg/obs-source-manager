import { FunctionComponent, useContext, useEffect, useState } from "react";
import { OBSConnectionContext } from "../contexts/OBSConnectionContext";
import { toast } from "react-toastify";
import SubScene from "./SubScene";

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
        //console.log("currentScene:", currentSceneName);

        const contents = await connection.call("GetSceneItemList", {
          sceneName: currentSceneName,
        });
        //console.log("contents:", contents);
        //filter to only the sceneItems that are a scene source
        const subScenes = contents.sceneItems.filter(
          (sceneItem) =>
            sceneItem.sourceType == "OBS_SOURCE_TYPE_SCENE" &&
            sceneItem.sceneItemEnabled === true
        );
        //console.log("subScenes:", subScenes);
        if (subScenes.length < 1) {
          throw new Error("Could not detect any nested scenes");
        }

        //all checks were cleared, set the state
        const subSceneNames = subScenes.map(
          (subscene) => subscene.sourceName as string
        );
        setMasterScene({
          name: currentSceneName,
          subSceneNames: subSceneNames,
        });
        toast.success("Your master scene has successfully been read");
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          //toast.error(`Error: ${error.message}`);
        } else {
          //toast.error("An unexpected error occured");
        }
      }
    };

    getNestedScenes();
  }, [connection]);

  return (
    <>
      {masterScene !== undefined ? (
        <div className="w-full px-[20px] flex flex-col">
          <div className="max-w-[1200px] w-full self-center mb-[32px]">
            {/* <h2 className="text-2xl mb-2">Master Scene: {masterScene.name}</h2> */}
            <ul className="space-y-[48px]" aria-label="Nested scenes list">
              {masterScene.subSceneNames.map((subSceneName) => (
                <SubScene name={subSceneName} key={subSceneName}></SubScene>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SceneView;
