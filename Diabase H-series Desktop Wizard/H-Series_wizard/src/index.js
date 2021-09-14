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
QFileDialog, QMainWindow, QWidget,
QLabel, FlexLayout, QPixmap,
QIcon, QPushButton, QPlainTextEdit
} from '@nodegui/nodegui';
import logo from '../assets/DiabaseIcon.jpg';
import banner from '../assets/DiabaseBanner.png';
const stlProcessing = require('../build/Release/fileProcessing.node');
const gcodeProcessing = require('../build/Release/gcodeProcessing.node');
const open = require('open');

// Images
const absoulteImagePath = banner;
const diabaseBannerImage = new QPixmap();
diabaseBannerImage.load(absoulteImagePath);

// Messages
const homeWelcomeMessage = 'Welcome to the Diabsae Engineering Wizard.\n\
This Application '
const rotaryWelcomeMessage = 'Welcome to the rotary Printing section of the wizard\n\
This section of the application is designed to process STL and G-Code files,\n\
and prepare them for rotary printing.\n\
See the buttons below to navigate to our our github, or to continue with STL or G-Code processing.'
const stlInstructionsText = 'This functionality prepares a .stl file for rotary printing.\n\
Click the upload button below to be directed to choose a .stl file. \n\
If you would like to select a different file, click the upload button again.\n\
Once the file is processed, a new .stl file will be created in the same location as the uploaded .stl file.'
const gcodeInstructionsText = 'This functionality prepares a Gcode file for rotary printing.\n\
Click the upload button below to be directed to choose a Gcode file. \n\
If you would like to select a different file, click the upload button again.\n\
Once the file is processed, a new Gcode file will be created in the same location as the uploaded Gcode file.'

//Global Variables
let canContinue = false;
let backToStl = false;

// WELCOME PAGE WIDGETS START

  //Buttons
  const websiteButton = createButton('buttonRowButton', 'What\'s Rotary Printing?');
  const gitButton = createButton('buttonRowButton', 'Diabase Github');
  const rotaryButton = createButton('buttonRowButton', 'Rotary Printing');

  //Root
  const welcomeButtonRow = [gitButton, websiteButton, rotaryButton];
  const welcomeHeaderRow = [createLabel('intro', homeWelcomeMessage)];

// WELCOME PAGE WIDGETS END
//
//
// ROTARY PAGE WIDGETS START

  //Buttons
  const continueToStlProcessing = createButton('buttonRowButton','STL processing');
  const continueToGcodeProcessing = createButton('buttonRowButton', 'G-Code processing');

  //Root
  const rotaryButtonRow = [continueToStlProcessing, continueToGcodeProcessing];
  const rotaryHeaderRow = [createLabel('intro', rotaryWelcomeMessage)];

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
  const uploadButtonStlPage = createButton('uploadButton','Upload .STL File');
  const backButtonStlPage = createButton('buttonRowButton','Back');
  const processStlButton = createButton('buttonRowButton','Process Selected STL');
  const stlToGcode = new createButton('buttonRowButton','Continue to\nGcode processing');

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
  [uploadButtonStlPage,createLabel('selectedFile','Selected File:'),selectedStlFileName].forEach(widget => uploadRowStlPageLayout.addWidget(widget));
  [createLabel('enterStretchLabel','Stretch Factor(1 is unchanged):'), stretchInput].forEach(widget => stretchRowStlPageLayout.addWidget(widget));
  const stlButtonRow = [backButtonStlPage,processStlButton,stlToGcode];
  const stlHeaderRow = [createLabel('instructions', stlInstructionsText), uploadRowStlPage, stretchRowStlPage];

// STL PAGE WIDGETS END
//
//
// Gcode PAGE WIDGETS START

  // Upload row
  const uploadRowGcodePage = new QWidget();
  const uploadRowGcodePageLayout = new FlexLayout();
  uploadRowGcodePage.setLayout(uploadRowGcodePageLayout);
  uploadRowGcodePage.setObjectName('centerRow');

  // radius Row
  const radiusRowGcodePage = new QWidget();
  const radiusRowGcodePageLayout = new FlexLayout();
  radiusRowGcodePage.setLayout(radiusRowGcodePageLayout);
  radiusRowGcodePage.setObjectName('centerRow');

  // Buttons
  const uploadButtonGcodePage = createButton('uploadButton','Upload .gcode File');
  const backButtonGcodePage = createButton('buttonRowButton','Back');
  const processGcodeButton = createButton('buttonRowButton','Process Selected Gcode');

  // radius Selection
  const radiusInput = new QLineEdit();
  radiusInput.setObjectName('input');

  const selectedGcodeFileName = new QPlainTextEdit();
  selectedGcodeFileName.setReadOnly(true);
  selectedGcodeFileName.setWordWrapMode(3);
  selectedGcodeFileName.setObjectName('fileDisplayArea');

  const GcodeFileDialog = new QFileDialog();
  GcodeFileDialog.setNameFilter('(*.gcode)');

  //Root
  [uploadButtonGcodePage,createLabel('selectedFile','Selected File:'),selectedGcodeFileName].forEach(widget => uploadRowGcodePageLayout.addWidget(widget));
  [createLabel('enterRadiusLabel','Inner Radius in mm:'), radiusInput].forEach(widget => radiusRowGcodePageLayout.addWidget(widget));
  const gcodeButtonRow = [backButtonGcodePage,processGcodeButton];
  const gcodeHeaderRow = [createLabel('instructions',gcodeInstructionsText), uploadRowGcodePage, radiusRowGcodePage];

// Gcode PAGE WIDGETS END
//
//
// STYLING START

  const StyleSheet = `
    #rootView{
      background-color: #FFFFFF;
      height: '100%';
      align-items: 'center';
    }
    #banner{
      qproperty-alignment: AlignCenter;
    }
    #intro {
      font-size: 18px;
      qproperty-alignment: AlignCenter;
      padding: 20;
    }
    #instructions{
      font-size: 18px;
      qproperty-alignment: AlignCenter;
      padding: 10;
    }
    #centerRow{
      margin-bottom: 5px;
      margin-bottom: 5px;
      flex-direction: row;
      padding: 20;
      align-items: 'center';
    }
    #buttonRowButton{
      margin-right: 5px;
      margin-left: 5px;
      font-size: 14px;
      width: 185px;
      height: 50px;
    }
    #stlToGcode {
      margin-right: 5px;
      margin-left: 5px;
      font-size: 16px;
      width: 185px;
      height: 50px;
    }
    #selectedFile{
      margin-left: 20px;
      font-size: 16px;
      qproperty-alignment: AlignCenter;
    }
    #enterStretchLabel{
      margin-left: 6px;
      font-size: 16px;
      qproperty-alignment: AlignCenter;
    }
    #enterRadiusLabel{
      margin-left: 50px;
      font-size: 16px;
      qproperty-alignment: AlignCenter;
    }
    #input{
      font-size: 16px;
      width: 100px;
      height: 40px;
    }
    #fileDisplayArea{
      font-size: 16px;
      width: 500px;
      height: 40px;
    }  
  `;

// STYLING END
//
//
// STARTUP CODE START
  //const welcomeWindow = createPage(400, 875, 'Diabase Printing Wizard - Home')
  const walcomeWindow = createPage(400, 875, 'Diabase Wizard - Welcome',welcomeHeaderRow,welcomeButtonRow );
  const rotaryWindow = createPage(400, 875, 'Diabase Rotary Printing Wizard - Welcome',rotaryHeaderRow,rotaryButtonRow );
  const stlPageWindow = createPage(500, 900, 'Diabase Rotary Printing Wizard - STL processing',stlHeaderRow, stlButtonRow );
  const gcodePageWindow = createPage(500, 900, 'Diabase Rotary Printing Wizard - G-Code processing',gcodeHeaderRow, gcodeButtonRow );
  rotaryWindow.show();
  global.win = rotaryWindow;

// STARTUP CODE END
//
//
// APPLICATION LOGIC START

  //Creates Button with given object name and text
  function createButton(name, text){
    const button = new QPushButton();
    button.setText(text);
    button.setObjectName(name);
    return button;
  }

  //Creates a label with given object name and text
  function createLabel(name, text){
    const label = new QLabel();
    label.setText(text);
    label.setObjectName(name);
    return label;
  }

  /*
  This function creates an entire page. 
  It starts by creating a window, and assigning it a root view.
  It then adds all the required widgets into the root view. 
  Return type is QMainWindow.
  */
  function createPage(height, width, title, headerWidgets, buttonRowWidgets){
    // Window
    const window = new QMainWindow();
    window.setWindowTitle(title);
    window.resize(width, height);
    window.setWindowIcon(new QIcon(logo));

    // Root view
    const rootView = new QWidget();
    const rootViewLayout = new FlexLayout();
    rootView.setObjectName('rootView');
    rootView.setLayout(rootViewLayout);
  
    // Header banner and description
    const banner = new QLabel();
    banner.setPixmap(diabaseBannerImage);
    banner.setObjectName('banner');
    headerWidgets.unshift(banner);
  
    // Field set header
    const header = new QWidget();
    const headerLayout = new FlexLayout();
    header.setLayout(headerLayout);
    headerWidgets.forEach(widget => headerLayout.addWidget(widget));
  
    // Button row
    const buttonRow = new QWidget();
    const buttonRowLayout = new FlexLayout();
    buttonRow.setLayout(buttonRowLayout);
    buttonRow.setObjectName('centerRow');
    buttonRowWidgets.forEach(widget => buttonRowLayout.addWidget(widget));
  
    [header, buttonRow].forEach(widget => rootViewLayout.addWidget(widget));
    window.setCentralWidget(rootView);
    window.setStyleSheet(StyleSheet);
    return window;
  }

  //Takes in the location of a file, and creates a new location path for the output
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

  /*Takes in the location of the .stl file, and calls all the required scripts and functions to output a processed
  .stl file to the same file location as the original .stl file
  Displays either a success or failure message after
  */
  function outputNewStl(pathString){
    const outputMessage = new QMessageBox();
    let correctedPathString = pathString.split('/').join('\\'); //MACOS let correctedPathString = pathString.split('/').join('/');
    let outputLocation = getOutputLoaction(correctedPathString, 'stl');
    let isnum = /^\d+$/.test(stretchInput.text());
    if(pathString != ''){
      if(isnum){
        if(stlProcessing.processSTL(correctedPathString, outputLocation, stretchInput.text())){
          outputMessage.setWindowTitle('Success');
          outputMessage.setText('New .stl file created at '+outputLocation);
          canContinue = true;
        }
        else{
          outputMessage.setWindowTitle('Error');
          outputMessage.setText('Could not read selected file');
          canContinue = false;
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
  }

  /*Takes in the location of the .gcode file, and calls all the required scripts and functions to output a processed
  .gcode file to the same file location as the original .gcode file
  Displays either a success or failure message after
  */
  function outputNewGcode(pathString){
    const outputMessage = new QMessageBox();
    let correctedPathString = pathString.split('/').join('\\'); // MACOS: let correctedPathString = pathString.split('/').join('/');
    let outputLocation = getOutputLoaction(correctedPathString, 'gcode');
    let isnum = parseFloat(radiusInput.text().match(/^-?\d*(\.\d+)?$/))>0;
    if(pathString != ''){
      if(isnum){
          if(gcodeProcessing.gcodeProcessing(correctedPathString, outputLocation, radiusInput.text())){
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

  function stlPageToGcodePage(){
    if(canContinue){
      gcodePageWindow.show();
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

  continueToStlProcessing.addEventListener('clicked', () => {
    stlPageWindow.show();
    rotaryWindow.hide();
  });

  continueToGcodeProcessing.addEventListener('clicked', () => {
    gcodePageWindow.show();
    rotaryWindow.hide();
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
    outputNewStl(String(stlFileDialog.selectedFiles()));
  });

  stlToGcode.addEventListener('clicked', () => {
    stlPageToGcodePage();
  });

  backButtonGcodePage.addEventListener('clicked', () => {
    if(backToStl){
      stlPageWindow.show();
    }
    else{
      rotaryWindow.show();
      backToStl = false;
    }
      gcodePageWindow.hide();
  });

  uploadButtonGcodePage.addEventListener('clicked', () => {
    GcodeFileDialog.exec();
    selectedGcodeFileName.setPlainText(GcodeFileDialog.selectedFiles());
  });

  processGcodeButton.addEventListener('clicked', () => {
    outputNewGcode(String(GcodeFileDialog.selectedFiles()));
    backToStl = false;
  });


// APPLICATION LOGIC END