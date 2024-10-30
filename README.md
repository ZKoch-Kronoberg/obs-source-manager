# OBS Source Manager

**DISCLAIMER**: This application is not, and has never been affiliated with, endorsed by, or officially connected to [OBS](https://github.com/obsproject/obs-studio) (Open Broadcaster Software) in any way.

OBS Source Manager is a react-based UI designed to make simultaneously recording several video sources to separate files with OBS simple and approachable even for less technical users. The way the the source manager works places some requirements on the structure of the scene collection, but most setups should be compatible with it. Once a scene collection has been set up the source manager can be used to select sources and start/stop recordings without having to actually touch OBS at all. 

## Installation

⚠️**Note**: The following instructions are aimed towards people already familiar with Node.js, npm, and React to keep this section concise. [A Detailed guide]() that can hopefully be followed without any prior knowledge will be added soon.

### Requirements

  * Node.js and npm, available from [their website](https://nodejs.org/en). 
  * OBS with with the plugins [obs-websocket](https://github.com/obsproject/obs-websocket) and [Source Record](https://obsproject.com/forum/resources/source-record.1285/). Some versions of OBS have compatability issues with the Source Record plugin. So far I only know that it works on [OBS 30.0.0](https://github.com/obsproject/obs-studio/releases/tag/30.0.0) and does not work on OBS 30.2.3. OBS versions after and including 28.0.0 come with obs-websocket already installed by default.

### Instructions

Clone or download the source code for the project onto your local machine. Open the root folder in a terminal and use
```bash
npm install
```
to install the required dependencies.

You will then be able to start a development preview with 
```bash
npm start
```
and check that everything works.

## Usage

You can use the source manager from the development preview or from a build.

### Making a local build

You can create an optimized that you can use locally by using
```bash
PUBLIC_URL=. npm run build
```
This will put all the needed files in the build directory. You can launch the app by opening the produced index.html file in a browser.

A local build has the advantage of working without an internet connection, and could "installed" on computers at same time OBS is being installed. 

### Making a build for web deployment

You can make an optimized build that's ready for web deployment you can run
```bash
npm run build
```
This puts the files in the build folder which you can then deploy like normal.

### Setting up OBS

Some first-time setup will be needed in OBS before it can be used by the source manager.

1. Enable OBS' WebSocket server. Make sure to set a password and enable authentication before enabling websocket if you want that protection.
2. Create/modify your scene collection to follow the required structure or import an already configured one from a file.

Detailed instructions for both of these steps can be found in the in-app help section.

### Using the interface

1. Make sure you have opened OBS and selected your master scene.
2. Open the source manager. It will automatically try to connect to OBS without a password incase you did not feel the need to set one. If you have set a password you'll see one or two errors from the source manager trying and failing to connect without one.
3. If the source manager could not automatically connect to OBS you will have to manually enter the password. Open the source manager's connection settings, enter your password, save, and close the modal. If everything went right you should get  messages saying you connected and your master scene was read. Your video sources should also be displayed in the UI.
4. Enable all the Video sources you want to record and disable the ones you don't want to record.
5. Start a recording with the start/stop recording button at the bottom of the source manager (or from the OBS's interface it will do exactly the same thing).   
6. End the recording with the same button you used to start it once you're done. **Your video files may be lost if you do not remember to end the recording before shutting down OBS, depending on your output settings.**
 
### Launch script (optional)

A basic automation script will let you launch both OBS and the source manager from one place while also making it easy to set launch parameters that give you more control over OBS' behaviour once launched. This repo has [an example of a launch](launch.bat) that:
1. Launches OBS to a minimized window with a specific scene collection and scene selected, with the warning message about OBS not closing correctly disabled since the Source Record plugin seems to interfere with that a lot of the time, and the update prompt disabled since I don't know if the compatability issues with Source Record are present on the latest version of OBS or not.
2. Waits 5 seconds to give OBS time to start fully.
3. Opens a local build of the source manager in the OS' default browser.

## Acknowledgments
* **[OBS Studio](https://github.com/obsproject/obs-studio)** - Free and open source recording and streaming software.
* **[obs-websocket](https://github.com/obsproject/obs-websocket) and the [Source Record plugin](https://obsproject.com/forum/resources/source-record.1285/)** - Adds functionality to OBS Studio that this project wouldn't be possible without.
* **UI and UX design help** - The current look of the interface was designed by a coworker that prefers to be left anonymous. Their redesigned interface is both more user-friendly and way nicer looking than anything I could design on my own.
* **[tailwindcss](https://github.com/tailwindlabs/tailwindcss)** - Used for all of the project's styling. 
* **[obs-websocket-js](https://github.com/obs-websocket-community-projects/obs-websocket-js)** - JavaScript API that the source manager does all its connection with OBS Studio through.
* **[oss-attribution-generator](https://github.com/zumwald/oss-attribution-generator)** - The utility script I use to compile all of the third party licenses to a file.
* **[gh-pages](https://github.com/tschaub/gh-pages)** - Makes it convenient to deploy the project to github pages.
