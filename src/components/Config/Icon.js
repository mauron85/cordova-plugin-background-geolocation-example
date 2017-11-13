import React from 'react';
import { Platform } from 'react-native';
import { Icon as IconRN } from 'native-base';

const Icon = ({ name, ...props }) => (
  <IconRN {...props} name={Platform.OS === 'web' ? `android-${name}` : name} />
);

export default Icon;
