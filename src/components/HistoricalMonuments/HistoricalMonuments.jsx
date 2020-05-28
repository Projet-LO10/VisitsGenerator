import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Preloader, Card, CardPanel } from 'react-materialize'

class HistoricalMonuments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            monuments: undefined,
        }
    }

    // componentDidMount() {
    //     this.fetchMonuments()
    // }

    // componentDidUpdate(prevProps) {
    //     if (prevProps.ville !== this.props.ville) {
    //         this.setState({ museum: undefined })
    //         this.fetchMonuments()
    //     }
    // }

    // fetchMonuments = () => {
    //     const refine = this.props.ville.toUpperCase() === 'PARIS' ? 'dpt_lettre' : 'commune'
    //     fetch(
    //         `https://data.culture.gouv.fr/api/records/1.0/search/?dataset=liste-des-immeubles-proteges-au-titre-des-monuments-historiques&q=&facet=reg&facet=dpt_lettre&refine.${refine}=${this.props.ville}`
    //     )
    //         .then((data) => data.json())
    //         .then((data) => {
    //             this.setState({ monuments: data })
    //         })
    // }

    render() {
        // Selectionne seulement les monuments ayant un champ geometry qui contient les latitudes et longitudes
        const monuments = this.props.dataSource.records.filter((monument) => monument.hasOwnProperty('geometry'))
        return monuments.length ? (
            <>
                <h3>Liste des monuments historiques à {this.props.ville}</h3>
                {monuments.map((monument) => {
                    // Certains monuments sont dôtés de coordonnées, d'autres noms:
                    // Ceux-ci ont un objet geometry
                    // avec un champ coordinates [longitude, latitude]
                    const { coordinates } = monument.geometry,
                        lon = coordinates[0],
                        lat = coordinates[1]
                    return (
                        <Card key={monument.recordid} className="blue-grey darken-1" textClassName="white-text" title={monument.fields['tico']}>
                            <p>{monument.fields['adrs']}</p>
                            <p>{monument.fields['hist']}</p>
                            <p>{monument.fields['scle']}</p>
                            <p>
                                Latitude : {lat}, longitude: {lon}
                            </p>
                        </Card>
                    )
                })}
            </>
        ) : (
            <CardPanel className="red accent-1">Aucun monument disponible à {this.props.ville}</CardPanel>
        )
    }
}

HistoricalMonuments.propTypes = {
    dataSource: PropTypes.object.isRequired,
    ville: PropTypes.string.isRequired,
}

export default HistoricalMonuments
