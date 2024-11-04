# Detailed installation guide

## Installing Node.js
Start by downloading the Node.js installer from [their website](https://nodejs.org/en) and find the downloaded file on your computer. Once you find it, double click it to start the Node.js installer.

![image](https://github.com/user-attachments/assets/83a554ff-a4d8-456c-a9a1-d96bac132301)

If nothing is said about a particular step it's safe to assume there's nothing particular that you need to do.

When you get to the step "Custom Setup" you will need to make sure you install the features "Node.js runtime", "npm package manager", and "Add to PATH" if you are using Windows. 

![image](https://github.com/user-attachments/assets/31318eef-f8c5-456c-a09b-fcd45c61ae7f)

The default options should be just fine.

Check the box to install tools for native modules on the next step if you are using Windows.

![image](https://github.com/user-attachments/assets/b5226e5c-5db0-4526-8c2b-768cce96012f)

Once the installer is done the command prompt will open if you are using Windows and ask you to install the additional tools.

![image](https://github.com/user-attachments/assets/d7d2771d-7f11-48e5-8217-955185050995)

Click on the window and press any key to start the installation and then wait while it does its thing. You may get a popup asking if you want Windows PowerShell to make changes to your devices, which you should say yes to.

### Verifying your installation
open your command prompt by searching for "cmd" in the Windows search bar if you are on Windows or open your terminal by pressing the command key (⌘) and spacebar at the same time to open Spotlight and searching for "terminal".

![image](https://github.com/user-attachments/assets/b05a679c-4e92-4420-8652-03e4b968dd54)

Type 
```bash
"node -v"
```
into the command prompt/terminal and hit enter. If everything went right with the installation it should show you what version of Node.js you have installed

![image](https://github.com/user-attachments/assets/6cb05b72-b33b-4dd8-a96a-f61f3adcdd45)

If it doesn't work the first time you can try restarting your pc before trying again

## Installing OBS Studio

I recommend using [OBS Studio 30.0.0](https://github.com/obsproject/obs-studio/releases/tag/30.0.0) since some other versions are known to have compatability issues with a plugin the source manager needs to work but 30.0.0 is definitley known to work. Which file you should download from the bottom of the linked page depends on your computer.

![image](https://github.com/user-attachments/assets/985ca353-5447-4a3c-be55-1ef7468f6f86)

Windows users should download "OBS-Studio-30.0-Full-Installer-x64.exe".

MacOS users should first check if they have a Apple Silicon (M1/M2) or Intel processor by clicking on the Apple menu and selecting "About This Mac" and looking at the Processor/Chip section under the Overview tab. If it says something like "Apple M1", "Apple M2", "M1 Pro", "M2 Max" etc, you should download "OBS-Studio-30.0.0-macOS-Apple.dmg". If it mentions intel anywhere you should download "OBS-Studio-30.0.0-macOS-Apple.dmg".

Once you have downloaded the correct file for your computer locate it and run it in the same way as you did the Node.js to start the installation There's nothing particular that you need to do when installing OBS other than maybe giving it permissions to install like any other app, but when OBS Studio launches for the first time MacOS users will be asked to grant App permissions, and then users of either OS will be shown the auto-configuration wizard. Select Optimise just for recording on the first step. You can leave the rest unchanged 


