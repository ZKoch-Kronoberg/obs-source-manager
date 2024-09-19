import { FunctionComponent } from "react";
import Modal from "react-modal";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: FunctionComponent<HelpModalProps> = ({ isOpen, onClose }) => {
  Modal.setAppElement("#root");

  return (
    <Modal
      isOpen={isOpen}
      onAfterClose={onClose}
      contentLabel="Help"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >
      <button className="border-2" type="button" onClick={onClose}>
        Close
      </button>
      <h2 className="text-4xl">Help</h2>
      <h3 className="text-2xl">Setting up OBS Studio</h3>
      <p>
        To use this control panel as inteded you will need to have{" "}
        <a href="https://obsproject.com/download">OBS Studio</a> and the plugins{" "}
        <a href="https://obsproject.com/forum/resources/obs-websocket-remote-control-obs-studio-using-websockets.466/">
          "obs-websocket"
        </a>{" "}
        and{" "}
        <a href="https://obsproject.com/forum/resources/source-record.1285/">
          "Source Record"
        </a>{" "}
        Installed. The links here will take you to the relevant download page.{" "}
      </p>
      <p className="font-bold">
        The latest version of OBS Studio comes with obs-websocket preinstalled,
        meaning you only have to install it for older versions of OBS.
      </p>
      <h3 className="text-2xl">Scenes and sources in OBS Studio</h3>
      <p>
        The control panel expects your scenes and sources to be set up a certain
        way inside OBS and will not work as intended unless scenes and sources
        have been set up in the way it expects.
      </p>
      <h4 className="text-xl">Importing an existing scene collection</h4>
      <p>
        If your scenes and sources have already been set up once (like our
        camera system for example) it's easiest to add them by importing them as
        a scene collection from a file.
      </p>
      <p>
        To import a scene collection hover over the scene collection tab of OBS'
        top menu and click on Import.
        <img
          src={`${process.env.PUBLIC_URL}/help/obs_import.png`}
          alt="OBS's interface with the location of the import button highlighted"
          className="max-w-3xl"
        />
        Then click on the "..." button and select the scene collection file
        using the file explorer.
        <img
          src={`${process.env.PUBLIC_URL}/help/obs_import2.png`}
          alt='OBS&apos;s import scene collection dialog with the location of the "..." button highlighted'
          className="max-w-3xl"
        />
        <img
          src={`${process.env.PUBLIC_URL}/help/obs_import3.png`}
          alt="how to select a scene collection in the file explorer"
          className="max-w-3xl"
        />
        After that press the import button in the dialog to add the scene
        collection and switch to it from the scene collection tab of OBS' top
        menu.
        <img
          src={`${process.env.PUBLIC_URL}/help/obs_import4.png`}
          alt="OBS's import scene collection dialog with the import button highlighted"
          className="max-w-3xl"
        />
        <img
          src={`${process.env.PUBLIC_URL}/help/obs_import5.png`}
          alt="OBS's interface with the location of the button to switch to the added scene highlighted"
          className="max-w-3xl"
        />
      </p>
      <h4 className="text-xl">
        Creating a scene collection from scratch or modifying an existing one
      </h4>
      <p>
        New scene collections or modifications to existing ones can be made in
        OBS Studio. The control panel should work with any scene that follows
        this structure:
        {/* prettier-ignore */}
        <pre className="pl-4 text-sm whitespace-pre-line" role="img" aria-label="Required scene collection structure diagram" aria-describedby="scene-collection-description">
          {`Master scene
          ├── Scene source for Nested scene 1
          ├── Scene source for Nested scene 2
          └── ...
          Nested scene 1
          ├── Video source 1A
          │   └── Source record filter
          ├── Video source 1B
          │   └── Source record filter
          └── ...
          Nested scene 2
          ├── Video source 2A
          │   └── Source record filter
          ├── Video source 2B
          │   └── Source record filter
          └── ...
          ...`}
          </pre>
      </p>
      <p id="scene-collection-description">
        The scene collection has a master scene and one or more nested scenes.
        The master scene has a scene source for each of the nested scenes. Each
        nested scene has one or more video sources, which each have a single
        source record filter named "Source Record" (case sensetive) with its
        record mode set to "recording".
      </p>
      <h3 className="text-2xl">Setting up OBS WebSocket server</h3>
      <p>
        The OBS WebSocket server lets the control panel connect to the OBS
        program. The settings for it can be found under the tools tab of OBS'
        top menu.
        <img
          src={`${process.env.PUBLIC_URL}/help/obs_websocket.png`}
          alt="OBS's interface with the location of the Websocket server settings button highlighted"
          className="max-w-3xl"
        />
        In the websocket settings dialog you need to:
        <ol className="list-decimal list-inside">
          <li>enable authorization</li>
          <li>
            set a secure password or let OBS generate one by erasing the text in
            the password field and then pressing the generate button next to it
          </li>
          <li>enable the websocket server</li>
        </ol>
        <img
          src={`${process.env.PUBLIC_URL}/help/obs_websocket2.png`}
          alt="OBS's WebSocket server settings dialog with the mentioned controls highlighted"
          className="max-w-3xl"
        />
      </p>
      <p>
        The OBS WebSocket server should now automatically start when OBS starts.
      </p>
      <h2 className="text-3xl">Connecting the control panel to OBS</h2>
      <p>
        <ol className="list-decimal list-inside">
          <li>open OBS and select your master scene</li>
          <li>
            Open the control panel. It will automatically try and connect to OBS
            without a password incase you did not feel the need to set one. If
            you did set a password you will see these three error messages:
            <img
              src={`${process.env.PUBLIC_URL}/help/connection_errors.png`}
              alt='the three error messages mentioned: "Error: couldn&apos;t connect to webSocket", "Failed to connect to OBS:","Failed to connect to OBS:Your payload&apos;s data is missing an `authentication` string, however authentication is required."'
              className="max-w-3xl"
            />
            which you can ignore if you did set a password.
          </li>
          <li>
            Click on the "Open connection settings" button on the control panel,
            enter the password for the OBS WebSocket server, press "save" and
            then "close".
          </li>
        </ol>
        If you forget the password you can open the OBS WebSocket server
        settings dialog and either check what the password is by pressing the
        "Show connection information" button or set a new one.
      </p>
      <p>
        Once the control panel properly connects to OBS and your scenes and
        sources load you will get a success message saying that the master scene
        was loaded.
      </p>
    </Modal>
  );
};

export default HelpModal;
