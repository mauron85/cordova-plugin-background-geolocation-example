import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { GoogleMap, withScriptjs, withGoogleMap } from 'react-google-maps';

const Map = withGoogleMap(({ region, children }) => {
  const { latitude, longitude } = region;
  return (
    <GoogleMap defaultZoom={8} center={{ lat: latitude, lng: longitude }}>
      {children}
    </GoogleMap>
  );
});

Map.propTypes = {
  region: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default withScriptjs(Map);
