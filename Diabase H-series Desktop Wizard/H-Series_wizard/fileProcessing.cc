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

#include <nan.h> //This include might show a compiler error, but that is a mistake, and should not effect anything. Do not remove.

#define _CRT_SECURE_NO_WARNINGS
#define _USE_MATH_DEFINES

#include <cmath>

#include <iostream>

#include <vector>

#include <array>

#include <string>

#include <stdint.h>

#include "stl_reader.h"

#include <fstream>

//Prototype
void write_stl(std::string filename, std::vector < unsigned int > tris, std::vector < float > coords, double stretch);
void rotaryTransform(float * p, double stretch);
void editGcode(std::string inFileName, std::string outFileName, double radius);

/* This is the stl processing method. It gets called with:
const addon = require('../build/Release/fileProcessing.node');
addon.processSTL(PathOfOriginalStl, PathOfOutputLocation, StretchFactor)
*/
void Add(const Nan::FunctionCallbackInfo < v8::Value > & info) {
  v8::Local < v8::Context > context = info.GetIsolate() -> GetCurrentContext();

  if (info.Length() != 3) {
    Nan::ThrowTypeError("Required parameters: InFileName, OutFileName, Stretch");
    return;
  }

  v8::Isolate * isolate = info.GetIsolate();
  v8::String::Utf8Value utf8Infilename(isolate, info[0]);
  std::string infilename( * utf8Infilename);
  v8::String::Utf8Value utf8Outfilename(isolate, info[1]);
  std::string outfilename( * utf8Outfilename);
  int stretch = info[2] -> NumberValue(context).FromJust();
  std::vector < float > coords, normals;
  std::vector < unsigned int > tris, solids;

  try {
    std::string extraExtension;
    stl_reader::ReadStlFile((infilename).c_str(), coords, normals, tris, solids);
    write_stl(outfilename, tris, coords, stretch);
    info.GetReturnValue().Set(true);
  } catch (std::exception & e) {
    std::cout << e.what() << std::endl;
    info.GetReturnValue().Set(false);
  }
}


/*
This is the method that writes to the STL File.
It is called within the Add method.
*/
void write_stl(std::string filename, std::vector < unsigned int > tris, std::vector < float > coords, double stretch) {
  //binary file
  std::string header_info = filename + " -output" + "\0";
  char head[80];
  std::strncpy(head, header_info.c_str(), sizeof(head)); // - 1
  char attribute[2] = "0";
  unsigned long numTris = tris.size() / 3;
  unsigned long numCor = coords.size() / 3;

  std::ofstream myfile;

  myfile.open((filename).c_str(), std::ios::out | std::ios::binary);
  myfile.write(head, sizeof(head));
  myfile.write((char * ) & numTris, sizeof(numTris));

  //go thru all the coords, transform
  for (size_t icor = 0; icor < numCor; icor++) {
    float * c = & coords[3 * icor];
    rotaryTransform(c, stretch);
  }

  for (size_t itri = 0; itri < numTris; itri++) {
    float zed = 0;
    for (size_t itr = 0; itr < 3; itr++) { //normals
      myfile.write((char * ) & zed, sizeof(float));
    }
    int cmap[3] = {
      1,
      0,
      2
    };
    for (int icorner = 0; icorner < 3; icorner++) {
      float * c = & coords[3 * tris[3 * itri + cmap[icorner]]];
      for (size_t itr = 0; itr < 3; itr++)
        myfile.write((char * ) & c[itr], sizeof(c[0]));
    }
    myfile.write(attribute, 2);
  }
  myfile.close();
}

/*
This makes the needed transformations for rotary printing. 
*/
void rotaryTransform(float * p, double stretch) {
  float rad = std::sqrt(p[1] * p[1] + p[2] * p[2]);
  float alpha = std::atan2f(-p[1], p[2]) * stretch;
  //p[0] unchanged
  p[1] = rad * alpha;
  p[2] = rad;
}


/*
This exports the add method to be used as "processSTL".
*/
void Init(v8::Local < v8::Object > exports) {
  v8::Local < v8::Context > context = exports -> CreationContext();
  exports -> Set(context,
    Nan::New("processSTL").ToLocalChecked(),
    Nan::New < v8::FunctionTemplate > (Add) -
    > GetFunction(context)
    .ToLocalChecked());
}

NODE_MODULE(stlProcessing, Init)