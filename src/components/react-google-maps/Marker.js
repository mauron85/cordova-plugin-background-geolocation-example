import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Marker as GMarker } from 'react-google-maps';

class Marker extends Component {
    static propTypes = {
        image: PropTypes.object,
        coordinate: PropTypes.shape({
            latitude: PropTypes.number,
            longitude: PropTypes.number
        })
    }

    render() {
        const { image, coordinate } = this.props
        const { latitude, longitude } = coordinate;
        return (
            <GMarker
                icon={image}
                position={{ lat: latitude, lng: longitude }}
            />
        )
    }
}

export default Marker;
