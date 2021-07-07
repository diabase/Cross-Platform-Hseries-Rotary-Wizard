# Cross-Platform-Hseries-Rotary-Wizard

## Description
### App Overview
This is a cross platform desktop application designed to take the place of the old H series wizard. It was written in 2021 by Nick Colleran for Diabase Engineering.
This application prepares STL files and Gcode files for rotary printing by unwrapping and scaling them. The GUI is written in NodeJS and NodeGUI, and the file processing is done with c++ plugins written for Node.
### Rotary Printing
Rotary printing is printing around a cylinder, rather than on a flat bad. This offers a number of advantages, including but not limited to: less support material, stronger parts, less visable layer lines, and access to all sides of a printed part. See examples below.

![Unable To Display Rotary Printing Gif][logo]

![](https://gyazo.com/eb5c5741b6a9a16c692170a41a49c858.png | width=100)

### Unwrapping Files
In order to slice prints that will be done on a rotary axis, we “unwrap” the original STL or gcode file so that the part is “flat” and that each layer is sized to correspond with its circumference at that Z(or R) height. See the images baloe for an example. 
## Use

## Instalation


[logo]: https://github.com/diabase/Cross-Platform-Hseries-Rotary-Wizard/blob/main/ReadMeImages/rotaryPrinting.gif =250x250
