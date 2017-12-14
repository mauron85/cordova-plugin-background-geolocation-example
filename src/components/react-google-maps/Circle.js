import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Circle as GCircle } from 'react-google-maps';

class Circle extends Component {
    static propTypes = {
        radius: PropTypes.number,
        center: PropTypes.shape({
            latitude: PropTypes.number,
            longitude: PropTypes.number
        })
    }
    render() {
        const { center, radius } = this.props;
        const { latitude, longitude } = center;
        return <GCircle center={{ lat: latitude, lng: longitude }} radius={radius} />;
    }
}

export default Circle;
