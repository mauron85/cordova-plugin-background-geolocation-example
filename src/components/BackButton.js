import React, { Component } from 'react';
import {
  Button,
  Icon,
} from 'native-base';

const BackButton = props => (
  <Button transparent {...props}>
    <Icon name='arrow-back' />
  </Button>
);

export default BackButton;
