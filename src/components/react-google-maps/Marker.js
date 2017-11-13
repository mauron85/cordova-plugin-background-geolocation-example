import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Marker as GMarker } from 'react-google-maps';

class Marker extends Component {
    static propTypes = {
        coordinate: PropTypes.shape({
            latitude: PropTypes.number,
            longitude: PropTypes.number
        })
    }

    render() {
        const { latitude, longitude } = this.props.coordinate;
        return (
            <GMarker
                position={{ lat: latitude, lng: longitude }}
            />      
        )
    }
}

export default Marker;
