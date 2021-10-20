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


void write_gcode(std::string outFileName,std::string inFileName);
std::string editLine(std::string line, double radius, double currentLayerHeight, double firstLayerHeight);


/* This is the main gcode processing method. It gets called with:
const addon = require('../build/Release/gcodeProcessing.node');
addon.gcodeProcessing(PathOfOriginalGcode, PathOfOutputLocation, Radius)
*/
void Add(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();

if (info.Length() != 2) {
	Nan::ThrowTypeError("Required parameters: InFileName, OutFileName, and preheat line count");
	return;
}

v8::Isolate* isolate = info.GetIsolate();
v8::String::Utf8Value utf8Infilename(isolate, info[0]);
std::string infilename(*utf8Infilename);
v8::String::Utf8Value utf8Outfilename(isolate, info[1]);
std::string outfilename(*utf8Outfilename);
int preheatLines = info[2]->NumberValue(context).FromJust();

try
	{
		write_gcode(outfilename, infilename, preheatLines);
		info.GetReturnValue().Set(true);
	}
	catch (std::exception& e)
	{
		std::cout << e.what() << std::endl;
		info.GetReturnValue().Set(false);
	}
}

/*
This is the method that writes to the Gcode File.
It is called within the Add method.
*/
void write_gcode(std::string outFileName,std::string inFileName, double preheatLines)
{	
	std::ifstream inFile;
  inFile.open((inFileName).c_str(), std::ios::in);
  std::ofstream outFile;
	outFile.open((outFileName).c_str(), std::ios::out | std::ofstream::trunc);
	outFile<< ";Processed with Diabase Rotary Printing Wizard.\n";
  std::string currentLine;

  std::string swap_value = "";
  int [] new_data = [];
  bool looking_for_retraction = false, looking_for_extrusion = false, found_extrusion = false, looking_for_swap = false, found_swap = false, first_tool = true;

	while (std::getline(inFile, currentLine)) {
		if (line.find(";Extruder ")!=std::string::npos && isdigit(line.back()))
      looking_for_retraction = true;
      looking_for_extrusion = true;
      looking_for_swap = true;
      if(preheatLines != 0){
        if(!first_tool){
          
        }
        first_tool = false;
      }
	}
	
	outFile<< ";File Complete\n";
	outFile.close();
	inFile.close();
}

/*
This is the method that can find the needed changes within a single gcode line.
It returns the changed line to be added to the output file.
*/
std::string editLine(std::string line){
  //This looks for comments in the code mentioning extruder changes. These indicate multiple things we need to search for. 
  if (line.find(";Extruder ")!=std::string::npos && isdigit(line.back()))
    std::cout << "Found " << '\n';


return output;
}

/*
This exports the add method to be used as s3dProcessing".
*/
void Init(v8::Local<v8::Object> exports) {
  v8::Local<v8::Context> context = exports->CreationContext();
  exports->Set(context,
               Nan::New("s3dProcessing").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Add)
                   ->GetFunction(context)
                   .ToLocalChecked());
}

NODE_MODULE(addon, Init)