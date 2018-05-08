import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Map from './Map';

const MapView = ({ style, children, ...props }) => (
  <Map
    {...props}
    loadingElement={<div style={style} />}
    containerElement={<div style={style} />}
    mapElement={<div style={{ height: '100%' }} />}
  >
    {children}
  </Map>
);

Map.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  googleMapURL: PropTypes.string,
  style: PropTypes.object
};

Map.defaultProps = {
  googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
};

export default MapView;
