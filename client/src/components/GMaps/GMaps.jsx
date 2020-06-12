import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Map, InfoWindow, Marker, GoogleApiWrapper, Polyline, LatLng } from 'google-maps-react'
import { Preloader, Card, CardPanel, Collapsible, CollapsibleItem, Row, Icon } from 'react-materialize'

const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '500px',
}

//const proxyurl = 'https://cors-anywhere.herokuapp.com/'
//const proxyurl = 'http://www.bertrandpotart.com/freesurf/'
export class MapContainer extends Component {
    state = {
        showingInfoWindow: false, //Hides or the shows the infoWindow
        activeMarker: {}, //Shows the active marker upon click
        selectedPlace: {}, //Shows the infoWindow to the selected place upon a marker
        roads: {},
        pathCoordinates: [],
        noms: [],
        coordinates: [],
    }

    /*Permet de gérer le component*/
    /*componentDidMount() {
        //this.fetchRoads()
    }

    fetchRoads = () => {
        const museums = this.props.museums.records.filter((museum) => museum.hasOwnProperty('geometry'))
        let coordinates = [];
        let noms = [];
        museums.map((museum) => {
            // Certains musées sont dôtés de coordonnées, d'autres noms:
            // Ceux-ci ont un objet geometry
            // avec un champ coordinates [longitude, latitude]
            noms.push(museum['fields']['nom_du_musee']);
            coordinates.push(museum.geometry['coordinates']);
        });
        this.setState({noms: noms});
        this.setState({coordinates: coordinates});
        let origin = '';
        let path = '';
        coordinates.map((coordinate, index) => {
          if(index == 1){
            origin = coordinate[1] + ',' + coordinate[0];
          }
          path += "via:" + coordinate[1] + ',' + coordinate[0];
          if(index != coordinate.length + 1){
            path += '|';
          }
        });
        /*https://maps.googleapis.com/maps/api/directions/json?origin=48.87396223516477,2.295111042446485&destination=48.87396223516477,2.295111042446485&waypoints=via:48.86612446131622,2.312576404506803|via:48.87198647229124,2.3316210022659334&key=AIzaSyC2EbNhEBrOMzZFk4vbwpm6h-GTrfXTwH0*/
    /*fetch(
            proxyurl +
                'https://maps.googleapis.com/maps/api/directions/json?origin=' + origin + '&destination=' + origin + '&waypoints=' + path + '&key=AIzaSyC2EbNhEBrOMzZFk4vbwpm6h-GTrfXTwH0'
                //'https://maps.googleapis.com/maps/api/directions/json?origin=48.87396223516477,2.295111042446485&destination=48.87396223516477,2.295111042446485&waypoints=via:48.86612446131622,2.312576404506803|via:48.87198647229124,2.3316210022659334&key=AIzaSyC2EbNhEBrOMzZFk4vbwpm6h-GTrfXTwH0'
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
    }*/

    render() {
        const { dataSource } = this.props
        // console.log(dataSource)
        const { steps, distance } = dataSource.roads

        return distance ? (
            <Row>
                <Collapsible accordion={false}>
                    <CollapsibleItem icon={<Icon>info</Icon>} header="Informations sur le trajet" expanded>
                        {dataSource.roads['distance'] ? <h6>Distance : {dataSource.roads['distance']['text']}</h6> : <h6>Distance : Chargement...</h6>}
                        {dataSource.roads['duration'] ? <h6>Durée : {dataSource.roads['duration']['text']}</h6> : <h6>Durée : Chargement...</h6>}
                    </CollapsibleItem>
                    <CollapsibleItem icon={<Icon>place</Icon>} header="La carte" expanded>
                        <Map
                            google={this.props.google}
                            zoom={14}
                            containerStyle={containerStyle}
                            initialCenter={{ lat: dataSource.coordinates[0][1], lng: dataSource.coordinates[0][0] }}
                        >
                            <Polyline
                                path={dataSource.pathCoordinates}
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
                            {dataSource.coordinates.map((marker, index) => {
                                if (index <= 5) {
                                    return (
                                        <Marker
                                            key={index}
                                            onClick={this.onMarkerClick}
                                            name={dataSource.noms[index]}
                                            position={{ lat: marker[1], lng: marker[0] }}
                                        />
                                    )
                                }
                            })}
                            <InfoWindow marker={dataSource.activeMarker} visible={dataSource.showingInfoWindow} onClose={this.onClose}>
                                <div>
                                    <h4>{this.state.selectedPlace.name}</h4>
                                </div>
                            </InfoWindow>
                        </Map>
                    </CollapsibleItem>
                    <CollapsibleItem icon={<Icon>directions_run</Icon>} header="Votre itinéraire">
                        {steps.map((step, i) => (
                            <p key={i} dangerouslySetInnerHTML={{ __html: step['html_instructions'] }} />
                        ))}
                    </CollapsibleItem>
                </Collapsible>
            </Row>
        ) : (
            <Preloader active flashing={false} size="big" />
        )

        // if (dataSource.roads['distance'] != undefined) {
        //     console.log(dataSource.coordinates[0])
        //     const itineraire = dataSource.roads['steps']
        //     return (
        //         <div className="row GMap">
        //             <h3>Votre visite guidée</h3>
        //             <Card className="center blue-grey darken-1 orange-text">
        //                 <span className="card-title">Informations sur le trajet</span>
        //                 {dataSource.roads['distance'] ? <h6>Distance : {dataSource.roads['distance']['text']}</h6> : <h6>Distance : Chargement...</h6>}
        //                 {dataSource.roads['duration'] ? <h6>Durée : {dataSource.roads['duration']['text']}</h6> : <h6>Durée : Chargement...</h6>}
        //             </Card>
        //             <Card className="center blue-grey darken-1 orange-text">
        //                 <span className="card-title">Etapes du trajet</span>
        //                 {itineraire.map((step) => {
        //                     let temp = step['html_instructions']
        //                     let temp2 = ''
        //                     let comp = 0
        //                     for (var i = 0; i < temp.length; i++) {
        //                         if (temp[i] == '<') {
        //                             if (temp2 == '') {
        //                                 temp2 += temp.substr(0, i)
        //                             } else if (comp != 0) {
        //                                 temp2 += temp.substr(comp + 1, i - comp - 1)
        //                                 comp = 0
        //                             }
        //                         }
        //                         if (temp[i] == '>') {
        //                             comp = i
        //                         }
        //                     }
        //                     return <h6>{temp2}</h6>
        //                 })}
        //                 <h6>Retour au point de départ</h6>
        //             </Card>
        //             <Map
        //                 google={this.props.google}
        //                 zoom={14}
        //                 containerStyle={containerStyle}
        //                 initialCenter={{ lat: dataSource.coordinates[0][1], lng: dataSource.coordinates[0][0] }}
        //             >
        //                 <Polyline
        //                     path={dataSource.pathCoordinates}
        //                     options={{
        //                         strokeColor: '#FF0000',
        //                         strokeOpacity: 1,
        //                         strokeWeight: 2,
        //                         icons: [
        //                             {
        //                                 icon: 'hello',
        //                                 offset: '0',
        //                                 repeat: '10px',
        //                             },
        //                         ],
        //                     }}
        //                 />
        //                 {dataSource.coordinates.map((marker, index) => {
        //                     if (index <= 5) {
        //                         return <Marker onClick={this.onMarkerClick} name={dataSource.noms[index]} position={{ lat: marker[1], lng: marker[0] }} />
        //                     }
        //                 })}
        //                 <InfoWindow marker={dataSource.activeMarker} visible={dataSource.showingInfoWindow} onClose={this.onClose}>
        //                     <div>
        //                         <h4>{this.state.selectedPlace.name}</h4>
        //                     </div>
        //                 </InfoWindow>
        //             </Map>
        //             {/*<Card className="center blue-grey darken-1 orange-text">
        //                 <span className="card-title">Informations sur le trajet</span>
        //                 {this.state.roads['distance'] && this.props.car ? (
        //                     <h6>Economie carbone : {(this.state.roads['distance']['value'] / 1000) * this.props.car.co2_g_km} g</h6>
        //                 ) : (
        //                     <h6>Economie carbone : Chargement...</h6>
        //                 )}
        //             </Card>*/}
        //         </div>
        //     )
        // } else {
        //     return <Preloader active flashing={false} size="big" />
        // }
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyC2EbNhEBrOMzZFk4vbwpm6h-GTrfXTwH0',
})(MapContainer)
