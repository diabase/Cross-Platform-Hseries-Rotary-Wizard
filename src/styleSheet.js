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

export const StyleSheet = `
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
    #enterPreheatLabel{
      margin-left: 25px;
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