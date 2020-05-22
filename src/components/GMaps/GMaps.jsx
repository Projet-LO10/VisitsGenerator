import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react'

const containerStyle = {
    position: 'relative',
    width: '200px',
    height: '200px',
}

export class MapContainer extends Component {
    render() {
        return (
            <div className="row">
                <Map
                    google={this.props.google}
                    containerStyle={containerStyle}
                    initialCenter={{
                        lat: 46.950914,
                        lng: 4.301565,
                    }}
                ></Map>
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyC2EbNhEBrOMzZFk4vbwpm6h-GTrfXTwH0',
})(MapContainer)
