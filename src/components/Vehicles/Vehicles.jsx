import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Vehicles extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        post: {},
    }

    /*Permet de gérer le component*/
    componentDidMount() {
        this.fetchVehicles()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.car !== this.props.car) {
          this.fetchVehicles()
        }
    }

    fetchVehicles = () => {
        fetch(`https://public.opendatasoft.com/api/records/1.0/search/?q=${this.props.car}&dataset=vehicules-commercialises&q=&sort=puissance_maximale&facet=marque&facet=modele_utac&facet=carburant&facet=hybride&facet=puissance_administrative&facet=boite_de_vitesse&facet=annee&facet=carrosserie&facet=gamme`)
            .then(response =>  response.json())
            .then((result) => {
                setTimeout(() => {
                    this.setState({ post: result.records[0].fields })
                }, 1500)
            })
    }

    render() {
        return (
            <div className="App">
              <h2>Voici les données véhicules</h2>

              <div className="row">
                  <div className="card blue-grey darken-1">
                      <div className="card-content orange-text">
                          <span className="card-title">Informations générales</span>
                          <p>{this.state.post.marque ? <h6>Marque : {this.state.post.marque}</h6> : <h6>Marque : Chargement...</h6>}</p>
                          <p>{this.state.post.designation_commerciale ? <h6>Modèle : {this.state.post.designation_commerciale}</h6> : <h6>Marque : Chargement...</h6>}</p>
                          <p>{this.state.post.carburant ? <h6>Carburant : {this.state.post.carburant}</h6> : <h6>Carburant : Chargement...</h6>}</p>
                          <p>{this.state.post.co2_g_km ? <h6>CO2 rejeté : {this.state.post.co2_g_km} g/km</h6> : <h6>CO2 rejeté : Chargement...</h6>}</p>
                      </div>
                  </div>
              </div>
            </div>
        )
    }
}

Vehicles.propTypes = {
    car: PropTypes.string.isRequired,
}

export default Vehicles
