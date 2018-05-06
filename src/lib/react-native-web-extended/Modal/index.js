import React from 'react';
import ReactDOM from 'react-dom';
import {
  View,
  StyleSheet
} from 'react-native-web';

const Modal = ({
  visible,
  children
}) => {
  return visible ? (
    ReactDOM.createPortal(
      <View style={styles.modal}>{children}</View>,
      document.body
    )
  ) : null;
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }
});

export default Modal;