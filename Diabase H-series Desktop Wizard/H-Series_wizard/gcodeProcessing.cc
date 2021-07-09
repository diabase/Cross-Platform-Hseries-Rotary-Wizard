/*
Diabase Engineering Rotary Printing Wizard gcodeProcessing.cc
By Nick Colleran

This code was written for Diabase Engineering.
It uses c++ code to create a NodeJS plugin used to process gcode files. 
All code used is done so with permission.

This wizard can modify gcode files to prepare them for rotary printing on a Diabase Engineering Machine.
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

void write_gcode(std::string outFileName,std::string inFileName, double radius);
std::string scaleY(std::string line, double radius);


/* This is the main gcode processing method. It gets called with:
const addon = require('../build/Release/gcodeProcessing.node');
addon.gcodeProcessing(PathOfOriginalGcode, PathOfOutputLocation, Radius)
*/
void Add(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();

if (info.Length() != 3) {
	Nan::ThrowTypeError("Required parameters: InFileName, OutFileName, radius");
	return;
}

v8::Isolate* isolate = info.GetIsolate();
v8::String::Utf8Value utf8Infilename(isolate, info[0]);
std::string infilename(*utf8Infilename);
v8::String::Utf8Value utf8Outfilename(isolate, info[1]);
std::string outfilename(*utf8Outfilename);
int radius = info[2]->NumberValue(context).FromJust();

try
	{
		
		write_gcode(outfilename, infilename, radius);
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
void write_gcode(std::string outFileName,std::string inFileName, double radius)
{	

    
	std::ifstream inFile;
    inFile.open((inFileName).c_str(), std::ios::in);

    std::ofstream outFile;
	outFile.open((outFileName).c_str(), std::ios::out | std::ofstream::trunc);
	outFile<< ";Processed with Diabase Rotary Printing Wizard.\n";
	

    std::string currentLine;

    while (std::getline(inFile, currentLine)) {
        outFile<<scaleY(currentLine, radius)<<"\n";
    }
    outFile<< ";File Complete\n";

    outFile.close();
    inFile.close();
}

/*
This is the method that can find the needed changes within a single gcode line.
It returns the changed line to be added to the output file.
*/
std::string scaleY(std::string line, double radius){
    
    double factor = 180/(radius*3.14159265);
    line = line + " ";
    std::string output = line;
    std::string num = "";
    bool Yflag = false;
    bool Negflag = false;
    if (line.find("G28") != std::string::npos || line.find("G32") != std::string::npos) {
        return "";
    }
        for (int i = 0; i < line.length(); i++) {
            if(Yflag){
                if(isdigit(line[i]) || line[i] == '.')
                    num += line[i];
                else{
                    if(line[i] == '-'){
                        Negflag = true;
                    }else{
                        Yflag = false;
                        if(num.length() > 0){
                            float number = std::stof(num);
                            number = number * factor;
                            std::ostringstream ss;
                            ss << number;
                            std::string s(ss.str());
                            if(Negflag){
                                output = output.substr(0,i-num.length()-2) + "A-" + s + output.substr(i,output.length());
                                Negflag = false; 
                            }else{
                                output = output.substr(0,i-num.length()-1) + "A" + s + output.substr(i,output.length());
                            }
                        }
                    }
                }
            }
            if(line[i] == 'Y' && line[i+1] != ' ')
                Yflag = true;
        }

return output;
}

/*
This exports the add method to be used as "gcodeProcessing".
*/
void Init(v8::Local<v8::Object> exports) {
  v8::Local<v8::Context> context = exports->CreationContext();
  exports->Set(context,
               Nan::New("gcodeProcessing").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Add)
                   ->GetFunction(context)
                   .ToLocalChecked());
}

NODE_MODULE(addon, Init)