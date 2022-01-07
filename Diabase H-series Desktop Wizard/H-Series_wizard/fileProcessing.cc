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
const bool print = false;

//Prototype
void write_stl(std::string filename, std::vector < float > coords, std::vector < float > normals, std::vector < unsigned int > tris);
void rotaryTransForm(std::vector < float > & coords, std::vector < float > & normals, std::vector <unsigned int> & tris, const double stretch);
void editGcode(std::string infilename, std::string outfilename, double radius);

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
  std::vector <float> coords, normals;
  std::vector<unsigned int> tris, solids;

  try {
    stl_reader::ReadStlFile(infilename.c_str(), coords, normals, tris, solids);
    rotaryTransForm(coords, normals, tris, stretch);
    write_stl(outfilename, coords, normals, tris);
    info.GetReturnValue().Set(true);
  } catch (std::exception & e) {
    std::cout << e.what() << std::endl;
    info.GetReturnValue().Set(false);
  }
}/*
This is the method that writes to the STL File.
It is called within the Add method.
*/
void flip(std::vector < size_t > & tris) {
  size_t numTris = tris.size() / 3;
  for (size_t itri = 0; itri < numTris; ++itri) {
    size_t temp = tris[3 * itri + 1];
    tris[3 * itri + 1] = tris[3 * itri + 2];
    tris[3 * itri + 2] = temp;
  }

}

void write_stl(std::string filename, std::vector < float > coords, std::vector < float > normals, std::vector < unsigned int > tris) {
  //binary file
  std::string header_info = "solid " + filename + "-output";
  char head[80];
  strncpy_s(head, header_info.c_str(), sizeof(head) - 1);
  char zed[2] = "0";
  float fed = 0.0;

  const size_t numTris = tris.size() / 3;
  std::ofstream myfile;

  myfile.open((filename).c_str(), std::ios::out | std::ios::binary);
  myfile.write(head, sizeof(head));
  myfile.write((char * ) & numTris, sizeof(uint32_t));

  for (size_t itri = 0; itri < numTris; ++itri) {
    //float zedA[3] = { 0.0,0.0,0.0 };
    //myfile.write((char *)&zedA[0], 3 * sizeof(float));
    myfile.write((char * ) & normals[3 * itri], 3 * sizeof(float));

    if (print)
      std::cout << "coordinates of triangle " << itri << ": ";
    for (size_t icorner = 0; icorner < 3; ++icorner) {
      float * c = & coords[3 * tris[3 * itri + icorner]];
      myfile.write((char * ) c, 3 * sizeof(float));
      if (print)
        std::cout << "(" << c[0] << ", " << c[1] << ", " << c[2] << ") ";
    }
    if (print)
      std::cout << std::endl;
    myfile.write(zed, 2);
  }
  myfile.close();
}

void rotaryTransForm(std::vector<float> &coords, std::vector<float> &normals, std::vector<unsigned int> &tris, const double stretch) {
  if (true) {
    const size_t numVert = coords.size() / 3;
    // first transform all the vertexes to the unrapped state
    for (size_t vin = 0; vin < numVert; vin++) {
      float * inPt = & coords[vin * 3];
      double rad = sqrt((pow(inPt[1], 2)) + (pow(inPt[2], 2)));
      //double ang = atan2(inPt[2], inPt[1])*(stretch + 1.0);  // original
      double ang = atan2(inPt[1], inPt[2]) * (stretch + 1.0); // modified to move slit to -Z

      inPt[1] = (float)(rad * ang);
      inPt[2] = (float) rad;
    }
  }
  //flip(tris);
  //now recalculate normals
  size_t numTris = tris.size() / 3;
  for (size_t itri = 0; itri < numTris; ++itri) {
    float * p1 = & coords[3 * tris[3 * itri + 0]];
    float * p2 = & coords[3 * tris[3 * itri + 1]];
    float * p3 = & coords[3 * tris[3 * itri + 2]];
    if (print)
      std::cout << "p1: " << p1[0] << "," << p1[1] << "," << p1[2] << std::endl;
    if (print)
      std::cout << "p2: " << p2[0] << "," << p2[1] << "," << p2[2] << std::endl;
    if (print)
      std::cout << "p3: " << p3[0] << "," << p3[1] << "," << p3[2] << std::endl;

    float * n = & normals[3 * itri];
    if (print)
      std::cout << "n: " << n[0] << "," << n[1] << ' ' << n[2] << std::endl;

    float a[3], b[3];

    for (auto i = 0; i < 3; i++) {
      b[i] = p3[i] - p1[i];
      a[i] = p2[i] - p1[i];
    }
    if (print)
      std::cout << "a: " << a[0] << "," << a[1] << "," << a[2] << std::endl;
    if (print)
      std::cout << "b: " << b[0] << "," << b[1] << "," << b[2] << std::endl;

    n[0] = a[1] * b[2] - a[2] * b[1];
    n[1] = a[2] * b[0] - a[0] * b[2];
    n[2] = a[0] * b[1] - a[1] * b[0];
    float mag = sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
    //mag = -mag; // reverse normal
    if (mag != 0.0) {
      n[0] = n[0] / mag;
      n[1] = n[1] / mag;
      n[2] = n[2] / mag;
    }
    if (print)
      std::cout << "n: " << n[0] << "," << n[1] << "," << n[2] << std::endl <<
      std::endl;
  }
}

/*
This exports the add method to be used as "processSTL".
*/
void Init(v8::Local < v8::Object > exports) {
  v8::Local < v8::Context > context = exports -> CreationContext();
  exports -> Set(context,
    Nan::New("processSTL").ToLocalChecked(),
    Nan::New < v8::FunctionTemplate > (Add)
    -> GetFunction(context)
    .ToLocalChecked());
}

NODE_MODULE(stlProcessing, Init)