/*
Diabase H-Series Cross-Platform Wizard
Copyright (c) 2021. Nick Colleran, Diabase Engineering, LLC
    This file is part of Diabase H-Series Cross-Platform Wizard.
    Diabase H-Series Cross-Platform Wizard is free software: you can 
    redistribute it and/or modify it under the terms of the GNU Affero
    General Public License as published by the Free Software Foundation,
    either version 3 of the License, or (at your option) any later version.
    Diabase H-Series Cross-Platform Wizard is distributed in the hope 
    that it will be useful, but WITHOUT ANY WARRANTY; without even the
    implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    See the GNU Affero General Public License for more details.
    You should have received a copy of the GNU Affero General Public License
    along with Diabase H-Series Cross-Platform Wizard.  If not, see
    <https://www.gnu.org/licenses/>.
 */

#include <nan.h>//This include might show a compiler error, but that is a mistake, and should not effect anything. Do not remove.

#define _CRT_SECURE_NO_WARNINGS
#define _USE_MATH_DEFINES

#include <cmath>

#include <iostream>

#include <vector>

#include <array>

#include <string>

#include <sstream>

#include <stdint.h>

#include <fstream>

# define M_PI 3.14159265358979323846

void write_gcode(std::string outFileName, std::string inFileName, double radius);
std::string scaleY(std::string line, double radius, double currentLayerHeight, double firstLayerHeight);


/* This is the main gcode processing method. It gets called with:
const addon = require('../build/Release/gcodeProcessing.node');
addon.gcodeProcessing(PathOfOriginalGcode, PathOfOutputLocation, Radius)
*/
void Add(const Nan::FunctionCallbackInfo < v8::Value > & info) {
  v8::Local < v8::Context > context = info.GetIsolate() -> GetCurrentContext();

  if (info.Length() != 3) {
    Nan::ThrowTypeError("Required parameters: InFileName, OutFileName, radius");
    return;
  }

  v8::Isolate * isolate = info.GetIsolate();
  v8::String::Utf8Value utf8Infilename(isolate, info[0]);
  std::string infilename( * utf8Infilename);
  v8::String::Utf8Value utf8Outfilename(isolate, info[1]);
  std::string outfilename( * utf8Outfilename);
  double radius = info[2] -> NumberValue(context).FromJust();

  try {
    write_gcode(outfilename, infilename, radius);
    info.GetReturnValue().Set(true);
  } catch (std::exception & e) {
    std::cout << e.what() << std::endl;
    info.GetReturnValue().Set(false);
  }
}

/*
This is the method that writes to the Gcode File.
It is called within the Add method.
*/
void write_gcode(std::string outFileName, std::string inFileName, double radius) {
  std::ifstream inFile;
  inFile.open((inFileName).c_str(), std::ios:: in );

  std::ofstream outFile;
  outFile.open((outFileName).c_str(), std::ios::out | std::ofstream::trunc);
  outFile << ";Processed with Diabase Rotary Printing Wizard.\n";

  std::string currentLine;

  double mainLayerHeight = 0, firstLayerHeight = 0, currentLayerHeight = 0;

  while (std::getline(inFile, currentLine)) {
    if (currentLine.find(";Layer height: ") != std::string::npos) { // Cura Check for main layer height
      std::size_t posOfLayerHeight = currentLine.find(";Layer height: ");
      std::string layerHeightString = currentLine.substr(posOfLayerHeight + 15);
      mainLayerHeight = std::stod(layerHeightString);
      break;
    } else if (currentLine.find(";   layerHeight,") != std::string::npos) { // Simplify 3d Check for main layer height
      std::size_t posOfLayerHeight = currentLine.find(";   layerHeight,");
      std::string layerHeightString = currentLine.substr(posOfLayerHeight + 16);
      mainLayerHeight = std::stod(layerHeightString);
      break;
    }
  }

  while (std::getline(inFile, currentLine)) {
    if (currentLine.find(";MINZ:") != std::string::npos) { // Cura Check for first layer height
      std::size_t posOfFirstLayerHeight = currentLine.find(";MINZ:");
      std::string firstLayerHeightString = currentLine.substr(posOfFirstLayerHeight + 6);
      firstLayerHeight = std::stod(firstLayerHeightString);
      currentLayerHeight = firstLayerHeight - mainLayerHeight;
      break;
    } else if (currentLine.find("; layer") != std::string::npos) { // Simplify 3d Check for first layer height
      std::size_t posOfFirstLayerHeight = currentLine.find("; layer 1, Z = ");
      std::string firstLayerHeightString = currentLine.substr(posOfFirstLayerHeight + 15);
      firstLayerHeight = std::stod(firstLayerHeightString);
      currentLayerHeight = firstLayerHeight;
      break;
    }
  }

  // Print error info to gcode file if needed info is not found
  if (firstLayerHeight == 0) {
    outFile << ";Could not find/calculate first layer height from Gcode. Process Failed.\n";
  } else if (mainLayerHeight == 0) {
    outFile << ";Could not find/calculate main layer height from Gcode. Process Failed.\n";
  } else {
    //Print found information to gcode file if all is well
    outFile << ";Found Layer Height: ";
    outFile << mainLayerHeight;
    outFile << "\n";
    outFile << ";Found First Layer Height: ";
    outFile << firstLayerHeight;
    outFile << "\n\n";

    while (std::getline(inFile, currentLine)) {
      if (currentLine.find(";LAYER:") != std::string::npos) {
        currentLayerHeight += mainLayerHeight;
      } else if (currentLine.find("; layer ") != std::string::npos) { //For each layer change after the initial layer, add the uniform layer height to the current z height
        currentLayerHeight += mainLayerHeight;
      }
      outFile << scaleY(currentLine, radius, currentLayerHeight, firstLayerHeight) << "\n"; // MACOS: outFile<<scaleY(currentLine, radius, currentLayerHeight, firstLayerHeight);
    }
  }
  outFile << ";File Complete\n";

  outFile.close();
  inFile.close();
}

/*
This is the method that can find the needed changes within a single gcode line.
It returns the changed line to be added to the output file.
*/
std::string scaleY(std::string line, double radius, double currentLayerHeight, double firstLayerHeight) {

  double zFactor = radius + currentLayerHeight - firstLayerHeight;
  double scaleFactor = 180 / (zFactor * M_PI);
  double testNumber;
  line = line + " ";
  std::string output = line;
  std::string num = "";
  bool Yflag = false;
  bool Negflag = false;
  if (line.find("G28") != std::string::npos) {
    return "G28 A";
  } else if (line.find("G32") != std::string::npos) {
    return "G29 S1";
  }
  for (int i = 0; i < line.length(); i++) {
    if (Yflag) {
      if (isdigit(line[i]) || line[i] == '.')
        num += line[i];
      else {
        if (line[i] == '-') {
          Negflag = true;
        } else {
          Yflag = false;
          if (num.length() > 0) {
            float number = std::stof(num);
            testNumber = number;
            number = number * scaleFactor;
            std::ostringstream ss;
            ss << number;
            std::string s(ss.str());
            if (Negflag) {
              output = output.substr(0, i - num.length() - 2) + "A" + s + output.substr(i, output.length());
              Negflag = false;
            } else {
              output = output.substr(0, i - num.length() - 1) + "A-" + s + output.substr(i, output.length());
            }
          }
        }
      }
    }
    if (line[i] == 'Y' && line[i + 1] != ' ')
      Yflag = true;
  }

  return output;
}

/*
This exports the add method to be used as "gcodeProcessing".
*/
void Init(v8::Local < v8::Object > exports) {
  v8::Local < v8::Context > context = exports -> CreationContext();
  exports -> Set(context,
    Nan::New("gcodeProcessing").ToLocalChecked(),
    Nan::New < v8::FunctionTemplate > (Add) -
    > GetFunction(context)
    .ToLocalChecked());
}

NODE_MODULE(addon, Init)