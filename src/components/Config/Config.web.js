import React, { Component } from 'react';
import { View } from 'react-native';
import CommonConfig from './Config.common';
import IOSConfig from './Config.ios';
import AndroidConfig from './Config.android';

class Config extends Component {
  render() {
    if (device && device.platform) {
      if (/ios/i.test(device.platform)) {
        return <IOSConfig {...this.props} />
      }
      if (/android/i.test(device.platform)) {
        return <AndroidConfig {...this.props} />
      }
    }

    return (
      <View>
        <CommonConfig {...this.props} />
        <IOSConfig {...this.props} renderCommon={false} />
        <AndroidConfig {...this.props} renderCommon={false} />
      </View>
    );
  }
}

export default Config;
