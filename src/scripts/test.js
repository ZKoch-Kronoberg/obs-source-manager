const { OBSWebSocket } = require("obs-websocket-js");
const obs = new OBSWebSocket();

obs
  .connect("ws://localhost:4455", "1umsXp9YDxvgUI2w")
  .then(() => {
    console.log("Connected to OBS WebSocket");
    return obs.call("GetSceneList");
  })
  .then((data) => {
    console.log("Current scenes:", data.scenes);
  })
  .catch((err) => {
    console.error("Failed to connect or call method:", err);
  });
