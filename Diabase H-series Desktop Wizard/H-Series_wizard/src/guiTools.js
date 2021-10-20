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
  QMainWindow, QWidget, QLabel,
  FlexLayout, QPixmap, QIcon,
  QPushButton
  } from '@nodegui/nodegui';
  
import { StyleSheet } from './styleSheet';
import logo from '../assets/DiabaseIcon.jpg';
import banner from '../assets/DiabaseBanner.png';
// Images
const absoulteImagePath = banner;
const diabaseBannerImage = new QPixmap();
diabaseBannerImage.load(absoulteImagePath);

  //Creates Button with given object name and text
  export function createButton(name, text){
    const button = new QPushButton();
    button.setText(text);
    button.setObjectName(name);
    return button;
  }

  //Creates a label with given object name and text
  export function createLabel(name, text){
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
  export function createPage(height, width, title, headerWidgets, buttonRowWidgets){
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

  