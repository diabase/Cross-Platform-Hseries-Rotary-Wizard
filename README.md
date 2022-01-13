# Cross-Platform-Hseries-Rotary-Wizard

## Description
### App Overview
This is a cross-platform desktop application designed to take the place of the old H series wizard. It was written in 2021 by Nick Colleran for Diabase Engineering.
This application prepares STL files and Gcode files for rotary printing by unwrapping and scaling them. The GUI is written in NodeJS and NodeGUI, and the file processing is done with c++ plugins written for Node.
### Rotary Printing
Rotary printing is printing around a cylinder, rather than on a flat printing surface. This offers several advantages, including but not limited to: less support material, stronger parts, less visible layer lines, and access to all sides of a printed part. See examples below.

![Unable To Display Rotary Printing Gif][RotaryGif]
![Unable To Display Rotary Printing Image][RotaryImage]

### Unwrapping Files
To slice prints that will be done on a rotary axis, we “unwrap” the original STL or gcode file so that the part is “flat” and that each layer is sized to correspond with its circumference at that Z(or R) height. See the images below for an example. 

![Unable To Display Unwrapping Image][UnwrappingImage]

## Use
This should be used in tandem with the H-series cura or simplify 3d post-processing scripts. 
Instructions:

1: Navigate to the STL section of the desktop wizard, and upload an STL to prepare it for slicing by clicking "Upload .STL File".

![Unable To Display Stl Page Image][STLPage]
![Unable To Display Upload Stl Image][UploadSTL]

2: Once you have uploaded the file and chosen your desired stretch factor(default 1), press "Process Selected STL". You will get a message telling you where to find the processed .STL file. 

![Unable To Display Process Stl Image][ProcessSTL]

2: Upload the output STL to either simplify 3d or cura. Make sure the appropriate post-processing script is applied to the slicing software. Slice the file, and the post-processing script should be automatically used, resulting in a gcode file.

3: Navigate to the Gcode section of the desktop wizard, and upload the resulting gcode file.

![Unable To Display Gcode Page Image][GcodePage]
![Unable To Display Gcode Upload Image][UploadGcode]

4: Press "Process Selected Gcode", and you will get a message telling you where the resulting Gcode file can be found. It is ready for rotary printing on an H-series machine. 
![Unable To Display Gcode Process Image][ProcessGcode]
## Installation
### Windows
Download and unzip "Diabase_Desktop_Wizard_Windows.zip" from the latest release. Navigate insode the unzipped folder, and locate qode.exe. This is the application excecutable, and running this will open the wizard. 
### macOS
1: Download "DiabaseHseriesMacWizard.app.zip" from the latest release. When you open the application, you may get a popup window stating that the application can not be opened because the developer can not be verified. If this is the case, proceed to step two. If this does not happen, the app is ready.

2: A change in security settings will be needed. On the popup, locate and press the question mark icon on the top right.

3: A new popup will appear. Find the link under step one that reads "Open the General pane for me", and click it. It will open a settings window. 

4: Locate and press the padloc icon on the bottom left of the settings window. 

5: Locate the text that says the app was blocked because of an unidentified developer. Click the button next to it that says "Open Anyway".

6: On the resulting prompt, press "Open".

7: The app should launch. From here, go back to the settings tab, and press the unlocked padlock. It should lock, saving your selection. This should allow continued use of the app with no issue. 

## Building From Source
1: Clone the repository, and open in VScode.

2: Prepparing to build on your operating system: Open the files "H-Series_wizard\src\fileTools.js", and "H-Series_wizard\gcodeProcessing.cc". Near the top of each, you will find a value "currentOS" being assigned(line 41 in fileTools and line 25 is gcodeProcessing). Make sure each of these is being set to your proper OS. The available options are isted right above the delcaration. If you are building on Mac, the binding.gyp file has required changes to include acceptable versions of macOS. There is a text file in the repository titled "Binding.gyp for MacOS" that reflects these changes. To build on Mac, delete the contents of "Binding.gyp", and replace them with the contents of "Binding.gyp for MacOS". 

3: Open a terminal, and run "npm install" inside the "H-Series_wizard" directory.

4: Once that has competed, run "npx nodegui-packer --init MyAppName" with MyAppName representing what you would like to call the build.

5: Run "npm run build" to build the project.

6: Run "npx nodegui-packer --pack ./dist". This will package a production build, and print the location of the build to your terminal. By default, the app executable is "qode.exe".

7: Locate "curappy.py" in "H-Series_wizard\src\". Relocate this to "Cross-Platform-Hseries-Rotary-Wizard\deploy\win32\build\H-Series-Wizard". The new location should be "Cross-Platform-Hseries-Rotary-Wizard\deploy\win32\build\H-Series-Wizard\curappy.py". 

8: Launching "qode.exe" Will now launch the application with full functionality. 

More information on packaging nodegui projects can be found at https://docs.nodegui.org/docs/guides/packaging/


[RotaryGif]: https://github.com/diabase/Cross-Platform-Hseries-Rotary-Wizard/blob/Expanded-Functionality/ReadMeImages/rotaryPrinting.gif
[RotaryImage]: https://github.com/diabase/Cross-Platform-Hseries-Rotary-Wizard/blob/Expanded-Functionality/ReadMeImages/Rotary.webp
[UnwrappingImage]: https://github.com/diabase/Cross-Platform-Hseries-Rotary-Wizard/blob/Expanded-Functionality/ReadMeImages/UnwrappingImage.PNG
[UploadSTL]: https://github.com/diabase/Cross-Platform-Hseries-Rotary-Wizard/blob/Expanded-Functionality/ReadMeImages/UploadSTL.PNG
[ProcessStl]: https://github.com/diabase/Cross-Platform-Hseries-Rotary-Wizard/blob/Expanded-Functionality/ReadMeImages/ProcessSTL.PNG
[STLPage]: https://github.com/diabase/Cross-Platform-Hseries-Rotary-Wizard/blob/Expanded-Functionality/ReadMeImages/STLButton.PNG
[GcodePage]: https://github.com/diabase/Cross-Platform-Hseries-Rotary-Wizard/blob/Expanded-Functionality/ReadMeImages/GCODEButton.PNG
[UploadGcode]: https://github.com/diabase/Cross-Platform-Hseries-Rotary-Wizard/blob/Expanded-Functionality/ReadMeImages/GcodeUpload.PNG
[ProcessGcode]: https://github.com/diabase/Cross-Platform-Hseries-Rotary-Wizard/blob/Expanded-Functionality/ReadMeImages/GcodeProcess.PNG
