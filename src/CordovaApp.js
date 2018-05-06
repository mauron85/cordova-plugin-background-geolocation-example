import React from 'react';
import ReactDOM from 'react-dom';
import { AppRegistry } from 'react-native';
import RootNavigator from './BrowserNavigator';
import BrowserAppContainer from './BrowserAppContainer';
import './res/fonts.css';

const App = BrowserAppContainer(RootNavigator);

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root')
});  
