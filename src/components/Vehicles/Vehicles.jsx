import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Vehicles extends Component {
    constructor(props) {
        super(props)
    }

    /*Permet de gérer le component*/
    componentDidMount() {
        this.fetchVehicles()
    }

    fetchVehicles = () => {
        fetch(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=vehicules-commercialises&q=&sort=puissance_maximale&facet=marque&facet=modele_utac&facet=carburant&facet=hybride&facet=puissance_administrative&facet=boite_de_vitesse&facet=annee&facet=carrosserie&facet=gamme`)
            .then(response =>  response.json())
            .then(json => console.log(json));
    }

    render() {
        return (
            <div className="App">

            </div>
        )
    }
}

export default Vehicles
