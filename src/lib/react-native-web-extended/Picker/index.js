import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RMCPicker from 'rmc-picker/es';
import 'rmc-picker/assets/index.css';

const dummyFnc = () => {};

const map = ({ props }) => {
  const { value, label } = props;
  return <RMCPicker.Item value={value}>{label}</RMCPicker.Item>;
};

class Picker extends Component {
  static propTypes = {
    selectedValue: PropTypes.number,
    onValueChange: PropTypes.func,
    onScrollChange: PropTypes.func
  }

  render() {
    const {
      mode,
      placeholder,
      selectedValue,
      onValueChange,
      children
    } = this.props;

    const items = React.Children
      ? React.Children.map(children, map)
      : [].concat(children).map(map);

    return (
      <RMCPicker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        onScrollChange={dummyFnc}
      >
        {items}
      </RMCPicker>
    );
  }
}

Picker.Item = () => null;

export default Picker;
