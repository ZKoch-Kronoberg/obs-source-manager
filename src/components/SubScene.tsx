import { FunctionComponent, useContext, useEffect, useState } from "react";
import { OBSConnectionContext } from "../contexts/OBSConnectionContext";
import { toast } from "react-toastify";
import { OBSResponseTypes } from "obs-websocket-js";

interface SubSceneProps {
  name: string;
}

const SubScene: FunctionComponent<SubSceneProps> = ({ name }) => {
  const { connection } = useContext(OBSConnectionContext);

  const [sources, setSources] = useState<string[] | undefined>();

  //get current subscene's information and log it or something
  useEffect(() => {
    const getSources = async () => {
      try {
        if (!connection) {
          throw new Error("couldn't connect to webSocket");
        }

        const response = await connection.call("GetSceneItemList", {
          sceneName: name,
        });
        if (response.sceneItems.length < 1) {
          throw new Error(`could not detect any sceneItems in ${name}`);
        }
        console.log(`${name}`, response.sceneItems);

        const foundSourceObjects = response.sceneItems.filter((source) => {
          return (source.sourceType = "OBS_SOURCE_TYPE_INPUT");
        });
        if (foundSourceObjects.length < 1) {
          throw new Error(`could not detect any inputs in ${name}`);
        }

        const foundSources = foundSourceObjects.map(
          (sourceObject) => sourceObject.sourceName as string
        );
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
  }, [connection]);

  // apply this https://inclusive-components.design/a-todo-list/ to both this conmponent and sceneview
  return (
    <li>
      <h3>{name}</h3>
      {sources ? (
        <ul>
          {sources.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      ) : null}
    </li>
  );
};

export default SubScene;
