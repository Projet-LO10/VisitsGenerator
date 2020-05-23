import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Preloader, Card } from 'react-materialize'

class Museum extends Component {
    constructor(props) {
        super(props)
        this.state = {
            museums: undefined,
        }
    }

    componentDidMount() {
        fetch(
            `https://data.culture.gouv.fr/api/records/1.0/search/?dataset=liste-et-localisation-des-musees-de-france&q=&rows=-1&facet=departement&facet=region&refine.ville=${this.props.ville.toUpperCase()}`
        )
            .then((data) => data.json())
            .then((data) => {
                this.setState({ museums: data })
            })
    }

    render() {
        const museums = this.state.museums ? this.state.museums.records : []
        return museums.length ? (
            <div>
                <h3>Liste des musées à {this.props.ville}</h3>
                {museums.map((museum) => (
                    <Card key={museum.recordid} className="blue-grey darken-1" textClassName="white-text" title={museum.fields['nom_du_musee']}>
                        <p>{museum.fields['addr']}</p>
                        <p>{museum.fields['periode_ouverture']}</p>
                        <p>{museum.fields['sitweb']}</p>
                    </Card>
                ))}
            </div>
        ) : (
            <Preloader active flashing={false} size="big" />
        )
    }
}

Museum.propTypes = {
    ville: PropTypes.string.isRequired,
}

export default Museum
