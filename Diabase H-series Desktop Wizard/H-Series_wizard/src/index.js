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
QLineEdit, QMessageBox, ButtonRole,
QFileDialog, FlexLayout, QPushButton, 
QPlainTextEdit, QWidget
} from '@nodegui/nodegui';

import{
homeWelcomeMessage, rotaryWelcomeMessage,
stlInstructionsText, rotaryGcodeInstructionsText,
s3dGcodeInstructionsText } from './messages';

const open = require('open');
const guiTools = require('./guiTools');
const fileTools = require('./fileTools');

//Global Variables
let canContinue = false;
let backToStl = false;

// WELCOME PAGE WIDGETS START

  //Buttons
  const gitButton = guiTools.createButton('buttonRowButton', 'Diabase Github');
  const rotaryButton = guiTools.createButton('buttonRowButton', 'Rotary Printing');
  const s3dButton = guiTools.createButton('buttonRowButton', 'Simplify3d Processing');

  //Root
  const welcomeButtonRow = [gitButton, rotaryButton, s3dButton];
  const welcomeHeaderRow = [guiTools.createLabel('intro', homeWelcomeMessage)];

// WELCOME PAGE WIDGETS END
//
//
// ROTARY PAGE WIDGETS START

  //Buttons
  const websiteButton = guiTools.createButton('buttonRowButton', 'What\'s Rotary Printing?');
  const continueToStlProcessing = guiTools.createButton('buttonRowButton','STL processing');
  const rotaryGcodeButton = guiTools.createButton('buttonRowButton', 'G-Code processing');
  const rotaryBackButton = guiTools.createButton('buttonRowButton', 'Back');

  //Root
  const rotaryButtonRow = [rotaryBackButton, websiteButton, continueToStlProcessing, rotaryGcodeButton];
  const rotaryHeaderRow = [guiTools.createLabel('intro', rotaryWelcomeMessage)];

// ROTARY PAGE WIDGETS END
//
//
// STL PAGE WIDGETS START

  // Upload row
  const uploadRowStlPage = new QWidget();
  const uploadRowStlPageLayout = new FlexLayout();
  uploadRowStlPage.setLayout(uploadRowStlPageLayout);
  uploadRowStlPage.setObjectName('centerRow');

  // Stretch Row
  const stretchRowStlPage = new QWidget();
  const stretchRowStlPageLayout = new FlexLayout();
  stretchRowStlPage.setLayout(stretchRowStlPageLayout);
  stretchRowStlPage.setObjectName('centerRow');

  // Buttons
  const uploadButtonStlPage = guiTools.createButton('uploadButton','Upload .STL File');
  const backButtonStlPage = guiTools.createButton('buttonRowButton','Back');
  const processStlButton = guiTools.createButton('buttonRowButton','Process Selected STL');
  const stlToGcode = new guiTools.createButton('buttonRowButton','Continue to\nGcode processing');

  // Stretch Selection
  const stretchInput = new QLineEdit();
  stretchInput.setObjectName('input');
  stretchInput.setText('1');

  // File Selection
  const selectedStlFileName = new QPlainTextEdit();
  selectedStlFileName.setReadOnly(true);
  selectedStlFileName.setWordWrapMode(3);
  selectedStlFileName.setObjectName('fileDisplayArea');

  const stlFileDialog = new QFileDialog();
  stlFileDialog.setNameFilter('(*.stl)');

  //Root
  [uploadButtonStlPage,guiTools.createLabel('selectedFile','Selected File:'),selectedStlFileName].forEach(widget => uploadRowStlPageLayout.addWidget(widget));
  [guiTools.createLabel('enterStretchLabel','Stretch Factor(1 is unchanged):'), stretchInput].forEach(widget => stretchRowStlPageLayout.addWidget(widget));
  const stlButtonRow = [backButtonStlPage,processStlButton,stlToGcode];
  const stlHeaderRow = [guiTools.createLabel('instructions', stlInstructionsText), uploadRowStlPage, stretchRowStlPage];

// STL PAGE WIDGETS END
//
//
// Rotary Gcode PAGE WIDGETS START

  // Upload row
  const uploadRowRotaryGcodePage = new QWidget();
  const uploadRowRotaryGcodePageLayout = new FlexLayout();
  uploadRowRotaryGcodePage.setLayout(uploadRowRotaryGcodePageLayout);
  uploadRowRotaryGcodePage.setObjectName('centerRow');

  // radius Row
  const radiusRowRotaryGcodePage = new QWidget();
  const radiusRowRotaryGcodePageLayout = new FlexLayout();
  radiusRowRotaryGcodePage.setLayout(radiusRowRotaryGcodePageLayout);
  radiusRowRotaryGcodePage.setObjectName('centerRow');

  // Buttons
  const uploadButtonRotaryGcodePage = guiTools.createButton('uploadButton','Upload .gcode File');
  const backButtonRotaryGcodePage = guiTools.createButton('buttonRowButton','Back');
  const processRotaryGcodeButton = guiTools.createButton('buttonRowButton','Process Selected Gcode');

  // radius Selection
  const radiusInput = new QLineEdit();
  radiusInput.setObjectName('input');

  const selectedRotaryGcodeFileName = new QPlainTextEdit();
  selectedRotaryGcodeFileName.setReadOnly(true);
  selectedRotaryGcodeFileName.setWordWrapMode(3);
  selectedRotaryGcodeFileName.setObjectName('fileDisplayArea');

  const rotaryGcodeFileDialog = new QFileDialog();
  rotaryGcodeFileDialog.setNameFilter('(*.gcode)');

  //Root
  [uploadButtonRotaryGcodePage,guiTools.createLabel('selectedFile','Selected File:'),selectedRotaryGcodeFileName].forEach(widget => uploadRowRotaryGcodePageLayout.addWidget(widget));
  [guiTools.createLabel('enterRadiusLabel','Inner Radius in mm:'), radiusInput].forEach(widget => radiusRowRotaryGcodePageLayout.addWidget(widget));
  const rotaryGcodeButtonRow = [backButtonRotaryGcodePage,processRotaryGcodeButton];
  const rotaryGcodeHeaderRow = [guiTools.createLabel('instructions',rotaryGcodeInstructionsText), uploadRowRotaryGcodePage, radiusRowRotaryGcodePage];

// Rotary Gcode PAGE WIDGETS END
//
//
// S3d Gcode PAGE WIDGETS START

  // Upload row
  const uploadRowS3dGcodePage = new QWidget();
  const uploadRowS3dGcodePageLayout = new FlexLayout();
  uploadRowS3dGcodePage.setLayout(uploadRowS3dGcodePageLayout);
  uploadRowS3dGcodePage.setObjectName('centerRow');

   // preheat Row
   const preheatRow = new QWidget();
   const preheatRowLayout = new FlexLayout();
   preheatRow.setLayout(preheatRowLayout);
   preheatRow.setObjectName('centerRow');

  // Buttons
  const uploadButtonS3dGcodePage = guiTools.createButton('uploadButton','Upload .gcode File');
  const backButtonS3dGcodePage = guiTools.createButton('buttonRowButton','Back');
  const gcodePpyButton = guiTools.createButton('buttonRowButton','Process Selected Gcode');

  const preHeatInput = new QLineEdit();
  preHeatInput.setObjectName('input');

  const selectedS3dGcodeFileName = new QPlainTextEdit();
  selectedS3dGcodeFileName.setReadOnly(true);
  selectedS3dGcodeFileName.setWordWrapMode(3);
  selectedS3dGcodeFileName.setObjectName('fileDisplayArea');

  const s3dGcodeFileDialog = new QFileDialog();
  s3dGcodeFileDialog.setNameFilter('(*.gcode)');

  //Root
  [uploadButtonS3dGcodePage,guiTools.createLabel('selectedFile','Selected File:'),selectedS3dGcodeFileName].forEach(widget => uploadRowS3dGcodePageLayout.addWidget(widget));
  [guiTools.createLabel('enterPreheatLabel','Preheat by how many lines:'), preHeatInput].forEach(widget => preheatRowLayout.addWidget(widget));
  const s3dGcodeButtonRow = [backButtonS3dGcodePage,gcodePpyButton];
  const s3dGcodeHeaderRow = [guiTools.createLabel('instructions',s3dGcodeInstructionsText), uploadRowS3dGcodePage, preheatRow];

// S3d Gcode PAGE WIDGETS END
//
//
// STARTUP CODE START
  const welcomeWindow = guiTools.createPage(400, 875, 'Diabase Wizard - Welcome',welcomeHeaderRow,welcomeButtonRow );
  const rotaryWindow = guiTools.createPage(400, 875, 'Diabase Rotary Printing Wizard - Welcome',rotaryHeaderRow,rotaryButtonRow );
  const stlPageWindow = guiTools.createPage(500, 900, 'Diabase Rotary Printing Wizard - STL processing',stlHeaderRow, stlButtonRow );
  const rotaryGcodePageWindow = guiTools.createPage(500, 900, 'Diabase Rotary Printing Wizard - G-Code processing',rotaryGcodeHeaderRow, rotaryGcodeButtonRow );
  const s3dGcodePageWindow = guiTools.createPage(500, 900, 'Diabase Rotary Printing Wizard - G-Code processing',s3dGcodeHeaderRow,s3dGcodeButtonRow );
  welcomeWindow.show();
  global.win = welcomeWindow;

// STARTUP CODE END
//
//
// APPLICATION LOGIC START

  function stlPageToGcodePage(){
    if(canContinue){
      rotaryGcodePageWindow.show();
      stlPageWindow.hide();
      backToStl = true;
    }
    else{
      const outputMessage = new QMessageBox();
      outputMessage.setWindowTitle('Error');
      outputMessage.setText('Please Process a .stl File Before Continuing.');
      const closeOutputMessage = new QPushButton();
      closeOutputMessage.setText('Close');
      outputMessage.addButton(closeOutputMessage, ButtonRole.AcceptRole);
      outputMessage.exec();
    }
    canContinue = false;
  }

  // Event handling
  websiteButton.addEventListener('clicked', () => {
    open('https://www.diabasemachines.com/rotary-3d-printing');
  });

  gitButton.addEventListener('clicked', () => {
    open('https://github.com/diabase');
  });
  s3dButton.addEventListener('clicked', () => {
    s3dGcodePageWindow.show();
    welcomeWindow.hide();
  });
  rotaryBackButton.addEventListener('clicked', () => {
    welcomeWindow.show();
    rotaryWindow.hide();
  });
  rotaryButton.addEventListener('clicked', () => {
    rotaryWindow.show();
    welcomeWindow.hide();
  });
  continueToStlProcessing.addEventListener('clicked', () => {
    stlPageWindow.show();
    rotaryWindow.hide();
  });

  rotaryGcodeButton.addEventListener('clicked', () => {
    rotaryGcodePageWindow.show();
    rotaryWindow.hide();
  });
  backButtonS3dGcodePage.addEventListener('clicked', () => {
    welcomeWindow.show();
    s3dGcodePageWindow.hide();
  });
  backButtonStlPage.addEventListener('clicked', () => {
    rotaryWindow.show();
    stlPageWindow.hide();
    canContinue = false;
    backToStl = false;
  });

  uploadButtonStlPage.addEventListener('clicked', () => {
    canContinue = false;
    backToStl = false;
    stlFileDialog.exec();
    selectedStlFileName.setPlainText(stlFileDialog.selectedFiles());
  });

  processStlButton.addEventListener('clicked', () => {
    canContinue = fileTools.outputNewStl(String(stlFileDialog.selectedFiles()), stretchInput.text());
  });

  stlToGcode.addEventListener('clicked', () => {
    stlPageToGcodePage();
  });

  backButtonRotaryGcodePage.addEventListener('clicked', () => {
    if(backToStl){
      stlPageWindow.show();
    }
    else{
      rotaryWindow.show();
      backToStl = false;
    }
      rotaryGcodePageWindow.hide();
  });

  uploadButtonRotaryGcodePage.addEventListener('clicked', () => {
    rotaryGcodeFileDialog.exec();
    selectedRotaryGcodeFileName.setPlainText(rotaryGcodeFileDialog.selectedFiles());
  });

  uploadButtonS3dGcodePage.addEventListener('clicked', () => {
    s3dGcodeFileDialog.exec();
    selectedS3dGcodeFileName.setPlainText(s3dGcodeFileDialog.selectedFiles());
  });

  processRotaryGcodeButton.addEventListener('clicked', () => {
    fileTools.outputNewGcode(String(rotaryGcodeFileDialog.selectedFiles()), radiusInput.text());
    backToStl = false;
  });

  gcodePpyButton.addEventListener('clicked', () => {
    fileTools.curaPPY(String(s3dGcodeFileDialog.selectedFiles()), preHeatInput.text());
  });
  
// APPLICATION LOGIC END