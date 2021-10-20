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

// Imports
import{
  QMessageBox, ButtonRole, QPushButton
  } from '@nodegui/nodegui';


/*Takes in the location of the .stl file, and calls all the required scripts and functions to output a processed
  .stl file to the same file location as the original .stl file
  Displays either a success or failure message after
  */
//Takes in the location of a file, and creates a new location path for the output
const stlProcessing = require('../build/Release/fileProcessing.node');
const gcodeProcessing = require('../build/Release/gcodeProcessing.node');


/*Takes in the location of the .stl file, and calls all the required scripts and functions to output a processed
  .stl file to the same file location as the original .stl file
  Displays either a success or failure message after
  */
export function outputNewStl(pathString, stretchFactor){
  const outputMessage = new QMessageBox();
  let correctedPathString = pathString.split('/').join('\\'); //MACOS let correctedPathString = pathString.split('/').join('/');
  let outputLocation = getOutputLoaction(correctedPathString, 'stl');
  let isnum = /^\d+$/.test(stretchFactor);
  let canContinue = false;
  if(pathString != ''){
    if(isnum){
      if(stlProcessing.processSTL(correctedPathString, outputLocation, stretchFactor)){
        outputMessage.setWindowTitle('Success');
        outputMessage.setText('New .stl file created at '+outputLocation);
        canContinue = true;
      }
      else{
        outputMessage.setWindowTitle('Error');
        outputMessage.setText('Could not read selected file');
      }
    }
    else{
      outputMessage.setWindowTitle('Error');
      outputMessage.setText('Please Enter a Valid Stretch Factor');
    }
  }
  else{
    outputMessage.setWindowTitle('Error');
    outputMessage.setText('Please Select a .stl File');
  }
  const closeOutputMessage = new QPushButton();
  closeOutputMessage.setText('Close');
  outputMessage.addButton(closeOutputMessage, ButtonRole.AcceptRole);
  outputMessage.exec();
  return canContinue;
}

/*Takes in the location of the .gcode file, and calls all the required scripts and functions to output a processed
  .gcode file to the same file location as the original .gcode file
  Displays either a success or failure message after
  */
  export function outputNewGcode(pathString, radius){
    const outputMessage = new QMessageBox();
    let correctedPathString = pathString.split('/').join('\\'); // MACOS: let correctedPathString = pathString.split('/').join('/');
    let outputLocation = getOutputLoaction(correctedPathString, 'gcode');
    let isnum = parseFloat(radius.match(/^-?\d*(\.\d+)?$/))>0;
    if(pathString != ''){
      if(isnum){
          if(gcodeProcessing.gcodeProcessing(correctedPathString, outputLocation, radius)){
            outputMessage.setWindowTitle('Success');
            outputMessage.setText('New .gcode file created at '+outputLocation);
          }
          else{
            outputMessage.setWindowTitle('Error');
            outputMessage.setText('Could not read selected file');
          }
        }
        else{
          outputMessage.setWindowTitle('Error');
          outputMessage.setText('Please Enter a Valid Radius in mm');
        }
      }
      else{
        outputMessage.setWindowTitle('Error');
        outputMessage.setText('Please Select a .gcode File');
      }
    const closeOutputMessage = new QPushButton();
    closeOutputMessage.setText('Close');
    outputMessage.addButton(closeOutputMessage, ButtonRole.AcceptRole);
    outputMessage.exec();
  }


function getOutputLoaction(inputString, type){
  let lastSlash = inputString.lastIndexOf('\\'); //MACOS: let lastSlash = inputString.lastIndexOf('/')
  let location = inputString.slice(0, lastSlash) + '\\'; //MACOS: let location = inputString.slice(0, lastSlash) + '/';
  if(type == 'stl'){
    location+= inputString.slice(lastSlash + 1, inputString.length-4);
    location+='_unwrapped.stl';
  }
  else if(type == 'gcode'){
    location+= inputString.slice(lastSlash + 1, inputString.length-6);
    location+='_readytoprint.gcode';
  }
  return location;
}

