import React, { Component } from 'react';
import { Platform } from 'react-native';
import {
  Button,
  Icon,
} from 'native-base';

const BackButton = props => (
  <Button transparent {...props}>
    <Icon name={Platform.OS === 'web' ? 'android-arrow-back' : 'arrow-back'} />
  </Button>
);

export default BackButton;
