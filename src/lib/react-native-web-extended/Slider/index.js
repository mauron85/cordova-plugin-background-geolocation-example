import PropTypes from 'prop-types';
import React from 'react';
import RCSlider from 'rc-slider';
import 'rc-slider/assets/index.css';

const Slider = ({
  value,
  step,
  minimumValue,
  maximumValue,
  onSlidingComplete,
  onValueChange
}) => (
  <RCSlider
    min={minimumValue}
    max={maximumValue}
    defaultValue={value}
    step={step}
    onChange={onValueChange}
    onAfterChange={onSlidingComplete}
  />
);

Slider.propTypes = {
  value: PropTypes.number,
  step: PropTypes.number,
  minimumValue: PropTypes.number,
  maximumValue: PropTypes.number,
  onSlidingComplete: PropTypes.func,
  onValueChange: PropTypes.func
};

export default Slider;
