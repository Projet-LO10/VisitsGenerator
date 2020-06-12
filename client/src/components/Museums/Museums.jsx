import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Preloader, Card, CardPanel, Collection, CollectionItem } from 'react-materialize'

class Museum extends Component {
    constructor(props) {
        super(props)
        this.state = {
            museums: undefined,
        }
    }

    // componentDidMount() {
    //     this.fetchMuseums()
    // }

    // componentDidUpdate(prevProps) {
    //     if (prevProps.ville !== this.props.ville) {
    //         this.setState({ museums: undefined })
    //         this.fetchMuseums()
    //     }
    // }

    // fetchMuseums = () => {
    //     fetch(
    //         `https://data.culture.gouv.fr/api/records/1.0/search/?dataset=liste-et-localisation-des-musees-de-france&q=&rows=-1&facet=departement&facet=region&refine.ville=${this.props.ville.toUpperCase()}`
    //     )
    //         .then((data) => data.json())
    //         .then((data) => {
    //             this.setState({ museums: data })
    //         })
    // }

    render() {
        // Selectionne seulement les musées ayant un champ geometry qui contient les latitudes et longitudes
        const museums = this.props.dataSource.records.filter((museum) => museum.hasOwnProperty('geometry'))
        return museums.length ? (
            <>
                <h4>Liste des musées à {this.props.ville}</h4>
                <Collection>
                    {museums.map((museum, index) => {
                        if (index <= 5) {
                            // Certains musées sont dôtés de coordonnées, d'autres noms:
                            // Ceux-ci ont un objet geometry
                            // avec un champ coordinates [longitude, latitude]
                            const { coordinates } = museum.geometry,
                                lon = coordinates[0],
                                lat = coordinates[1]
                            return (
                                <CollectionItem key={museum.recordid}>
                                    <p><strong>{museum.fields['nom_du_musee']}</strong></p>
                                    <p>{museum.fields['addr']}</p>
                                    <p>{museum.fields['periode_ouverture']}</p>
                                    <p>{museum.fields['sitweb']}</p>
                                    {/* <p>
                                        Latitude : {lat}, longitude: {lon}
                                    </p> */}
                                </CollectionItem>
                            )
                        }
                    })}
                </Collection>
                {/* {museums.map((museum, index) => {
                  if (index <= 5) {
                    // Certains musées sont dôtés de coordonnées, d'autres noms:
                    // Ceux-ci ont un objet geometry
                    // avec un champ coordinates [longitude, latitude]
                    const { coordinates } = museum.geometry,
                        lon = coordinates[0],
                        lat = coordinates[1]
                    return (
                        <Card key={museum.recordid} className="blue-grey darken-1" textClassName="white-text" title={museum.fields['nom_du_musee']}>
                            <p>{museum.fields['addr']}</p>
                            <p>{museum.fields['periode_ouverture']}</p>
                            <p>{museum.fields['sitweb']}</p>
                            <p>
                                Latitude : {lat}, longitude: {lon}
                            </p>
                        </Card>
                    )
                  }
                })} */}
            </>
        ) : (
            <CardPanel className="red accent-1">Aucun musée disponible à {this.props.ville}</CardPanel>
        )
    }
}

Museum.propTypes = {
    dataSource: PropTypes.object.isRequired,
    ville: PropTypes.string.isRequired,
}

export default Museum
