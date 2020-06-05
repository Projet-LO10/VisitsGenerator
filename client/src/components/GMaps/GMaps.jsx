import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Map, InfoWindow, Marker, GoogleApiWrapper, Polyline, LatLng } from 'google-maps-react'
import { Preloader, Card, CardPanel } from 'react-materialize'

const containerStyle = {
    position: 'relative',
    width: '400px',
    height: '300px',
}

/*const pathCoordinates = [
  {lat: 48.8742977, lng: 2.2949816},
  {lat: 48.8626979, lng: 2.2875026}
];*/

const proxyurl = 'https://cors-anywhere.herokuapp.com/'

export class MapContainer extends Component {
    state = {
        showingInfoWindow: false, //Hides or the shows the infoWindow
        activeMarker: {}, //Shows the active marker upon click
        selectedPlace: {}, //Shows the infoWindow to the selected place upon a marker
        roads: {},
        pathCoordinates: [],
    }

    /*Permet de gérer le component*/
    componentDidMount() {
        this.fetchRoads()
    }

    fetchRoads = () => {
        /*fetch(proxyurl + `https://maps.googleapis.com/maps/api/directions/json?origin=48.87396223516477,2.295111042446485&destination=48.87198647229124,2.3316210022659334&key=AIzaSyC2EbNhEBrOMzZFk4vbwpm6h-GTrfXTwH0`)*/
        fetch(
            proxyurl +
                `https://maps.googleapis.com/maps/api/directions/json?origin=48.87396223516477,2.295111042446485&destination=48.87396223516477,2.295111042446485&waypoints=via:48.86612446131622,2.312576404506803|via:48.87198647229124,2.3316210022659334&key=AIzaSyC2EbNhEBrOMzZFk4vbwpm6h-GTrfXTwH0`
        )
            .then((response) => response.json())
            .then((result) => {
                this.setState({ roads: result['routes'][0]['legs'][0] })
                let temp = []
                temp.push({ lat: this.state.roads['start_location']['lat'], lng: this.state.roads['start_location']['lng'] })
                for (var i = 0; i < this.state.roads['steps'].length; i++) {
                    temp.push(this.state.roads['steps'][i]['end_location'])
                }
                temp.push({ lat: this.state.roads['end_location']['lat'], lng: this.state.roads['end_location']['lng'] })
                this.setState({ pathCoordinates: temp })
            })
    }

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
        })

    onClose = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null,
            })
        }
    }

    render() {
        if (this.state.roads['distance'] != undefined) {
            const itineraire = this.state.roads['steps']
            return (
                <div className="row GMap">
                    <h3>Trajet de l'Arc de triomphe au Palais Garnier </h3>
                    <Card className="center blue-grey darken-1 orange-text">
                        <span className="card-title">Informations sur le trajet</span>
                        {this.state.roads['distance'] ? <h6>Distance : {this.state.roads['distance']['text']}</h6> : <h6>Distance : Chargement...</h6>}
                        {this.state.roads['duration'] ? <h6>Durée : {this.state.roads['duration']['text']}</h6> : <h6>Durée : Chargement...</h6>}
                    </Card>
                    <Card className="center blue-grey darken-1 orange-text">
                        <span className="card-title">Etapes du trajet</span>
                        {itineraire.map((step) => {
                            let temp = step['html_instructions']
                            let temp2 = ''
                            let comp = 0
                            for (var i = 0; i < temp.length; i++) {
                                if (temp[i] == '<') {
                                    if (temp2 == '') {
                                        temp2 += temp.substr(0, i)
                                    } else if (comp != 0) {
                                        temp2 += temp.substr(comp + 1, i - comp - 1)
                                        comp = 0
                                    }
                                }
                                if (temp[i] == '>') {
                                    comp = i
                                }
                            }
                            return <h6>{temp2}</h6>
                        })}
                        <h6>Retour au point de départ</h6>
                    </Card>
                    <Map google={this.props.google} zoom={14} containerStyle={containerStyle} initialCenter={{ lat: 48.87405118435778, lng: 2.2950874251727083 }}>
                        <Polyline
                            path={this.state.pathCoordinates}
                            options={{
                                strokeColor: '#FF0000',
                                strokeOpacity: 1,
                                strokeWeight: 2,
                                icons: [
                                    {
                                        icon: 'hello',
                                        offset: '0',
                                        repeat: '10px',
                                    },
                                ],
                            }}
                        />
                        <Marker
                            onClick={this.onMarkerClick}
                            name={this.state.roads['start_address']}
                            position={{ lat: 48.87405118435778, lng: 2.2950874251727083 }}
                        />
                        <Marker
                            onClick={this.onMarkerClick}
                            name={this.state.roads['end_address']}
                            position={{ lat: 48.87198647229124, lng: 2.3316210022659334 }}
                        />
                        <InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow} onClose={this.onClose}>
                            <div>
                                <h4>{this.state.selectedPlace.name}</h4>
                            </div>
                        </InfoWindow>
                    </Map>
                    <Card className="center blue-grey darken-1 orange-text">
                        <span className="card-title">Informations sur le trajet</span>
                        {this.state.roads['distance'] && this.props.car ? (
                            <h6>Economie carbone : {(this.state.roads['distance']['value'] / 1000) * this.props.car.co2_g_km} g</h6>
                        ) : (
                            <h6>Economie carbone : Chargement...</h6>
                        )}
                    </Card>
                </div>
            )
        } else {
            return <Preloader active flashing={false} size="big" />
        }
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyC2EbNhEBrOMzZFk4vbwpm6h-GTrfXTwH0',
})(MapContainer)
