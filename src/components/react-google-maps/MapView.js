import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Map from './Map';

const defaultRegion = { latitude: -34.397, longitude: 150.644 };

const MapView = ({ region, children }) => (
  <Map
    region={region || defaultRegion}
    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
    loadingElement={<div style={{ height: '100%' }} />}
    containerElement={<div style={{ height: '400px' }} />}
    mapElement={<div style={{ height: '100%' }} />}
  >
    {children}
  </Map>
);

Map.propTypes = {
  region: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number
  }),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

Map.defaultProps = {
  region: defaultRegion
};

export default MapView;
