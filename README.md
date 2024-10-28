# OBS Source Manager

**DISCLAIMER**: This application is not, and has never been affiliated with, endorsed by, or officially connected to [OBS](https://github.com/obsproject/obs-studio) (Open Broadcaster Software) in any way.

OBS Source Manager is a react-based UI designed to make simultaneously recording several video sources to separate files with OBS simple and approachable even for less technical users. The way the the source manager works places some requirements on the structure of the scene collection, but most setups should be compatible with it. Once a scene collection has been set up the source manager can be used to select sources and start/stop recordings without having to actually touch OBS at all. 

## Installation

⚠️**Note**: The following instructions are aimed towards people already familiar with Node.js, npm, and React to keep this section concise. [A Detailed guide]() that can hopefully be followed without any prior knowledge will be added soon.

### Requirements

  * Node.js and npm, available from [their website](https://nodejs.org/en). 
  * OBS with with the plugins obs-websocket and [Source Record](https://obsproject.com/forum/resources/source-record.1285/). Some versions of OBS have compatability issues with the Source Record plugin. So far I only know that it works on [OBS 30.0.0](https://github.com/obsproject/obs-studio/releases/tag/30.0.0) and does not work on OBS 30.2.3. OBS versions after and including 28.0.0 come with obs-websocket already installed by default.

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

