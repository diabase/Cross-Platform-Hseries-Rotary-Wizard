# Cross-Platform-Hseries-Rotary-Wizard

## Description
### App Overview
This is a cross-platform desktop application designed to take the place of the old H series wizard. It was written in 2021 by Nick Colleran for Diabase Engineering.
This application prepares STL files and Gcode files for rotary printing by unwrapping and scaling them. The GUI is written in NodeJS and NodeGUI, and the file processing is done with c++ plugins written for Node.
### Rotary Printing
Rotary printing is printing around a cylinder, rather than on a flat bed. This offers several advantages, including but not limited to: less support material, stronger parts, less visible layer lines, and access to all sides of a printed part. See examples below.

![Unable To Display Rotary Printing Gif][RotaryGif]
![Unable To Display Rotary Printing Image][RotaryImage]

### Unwrapping Files
To slice prints that will be done on a rotary axis, we “unwrap” the original STL or gcode file so that the part is “flat” and that each layer is sized to correspond with its circumference at that Z(or R) height. See the images below for an example. 

![Unable To Display Unwrapping Image][UnwrappingImage]

## Use
This should be used in tandem with the H-series cura or simplify 3d post-processing scripts. 
Instructions:

1: Navigate to the STL section of the desktop wizard, and upload an STL to prepare it for slicing by clicking "Upload .STL File".

![Unable To Display Unwrapping Image][UploadSTL]

2: Once you have uploaded the file and chosen your desired stretch factor(default 1), press "Process Selected STL". You will get a message telling you where to find the processed .STL file. 

2: Upload the output STL to either simplify 3d or cura. Make sure the appropriate post-processing script is applied to the slicing software. Slice the file, and the post-processing script should be automatically used, resulting in a gcode file.

3: Navigate to the Gcode section of the desktop wizard, and upload the resulting gcode file to make the final transformation.

4: You will get a message telling you where the resulting Gcode file can be found. It is ready for rotary printing on an H-series machine. 
## Instalation


[RotaryGif]: https://github.com/diabase/Cross-Platform-Hseries-Rotary-Wizard/blob/main/ReadMeImages/rotaryPrinting.gif
[RotaryImage]: https://github.com/diabase/Cross-Platform-Hseries-Rotary-Wizard/blob/main/ReadMeImages/Rotary.webp
[UnwrappingImage]: https://github.com/diabase/Cross-Platform-Hseries-Rotary-Wizard/blob/main/ReadMeImages/UnwrappingImage.PNG
[UploadSTL]: https://github.com/diabase/Cross-Platform-Hseries-Rotary-Wizard/blob/main/ReadMeImages/UploadSTL.PNG
