import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Preloader, Card, CardPanel, Collection, CollectionItem } from 'react-materialize'

class HistoricalMonuments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            monuments: undefined,
        }
    }

    render() {
        // Selectionne seulement les monuments ayant un champ geometry qui contient les latitudes et longitudes
        const monuments = this.props.dataSource.records.filter((monument) => monument.hasOwnProperty('geometry'))
        return monuments.length ? (
            <>
                <h4>Liste des monuments historiques à {this.props.ville}</h4>
                <Collection>
                    {monuments.map((monument, index) => {
                        if (index <= 5) {
                            // Certains monuments sont dôtés de coordonnées, d'autres noms:
                            // Ceux-ci ont un objet geometry
                            // avec un champ coordinates [longitude, latitude]
                            const { coordinates } = monument.geometry,
                                lon = coordinates[0],
                                lat = coordinates[1]
                            return (
                                <CollectionItem key={monument.recordid}>
                                    <p><strong>{monument.fields['tico']}</strong></p>
                                    <p>{monument.fields['adrs']}</p>
                                    <p>{monument.fields['hist']}</p>
                                    <p>{monument.fields['scle']}</p>
                                </CollectionItem>
                            )
                        }
                    })}
                </Collection>
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
