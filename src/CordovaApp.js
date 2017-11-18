import React from 'react';
import ReactDOM from 'react-dom';
import { AppRegistry } from 'react-native';
import { OSTheme } from 'native-base';
import RootNavigator from './BrowserNavigator';
import BrowserAppContainer from './BrowserAppContainer';

const App = BrowserAppContainer(RootNavigator);
OSTheme.setOSTheme('ios');

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root')
});  
