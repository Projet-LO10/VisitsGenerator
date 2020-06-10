import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Vehicles extends Component {
    constructor(props) {
        super(props)
    }

    render() {
      const { car } = this.props

        return (
            <div>
              <h3>Voici les données véhicules</h3>

              <div className="row">
                  <div className="card blue-grey darken-1">
                      <div className="card-content orange-text">
                          <span className="card-title">Informations générales</span>
                          {car.marque ? <h6>Marque : {car.marque}</h6> : <h6>Marque : Chargement...</h6>}
                          {car.designation_commerciale ? <h6>Modèle : {car.designation_commerciale}</h6> : <h6>Marque : Chargement...</h6>}
                          {car.carburant ? <h6>Carburant : {car.carburant}</h6> : <h6>Carburant : Chargement...</h6>}
                          {car.co2_g_km ? <h6>CO2 rejeté : {car.co2_g_km} g/km</h6> : <h6>CO2 rejeté : Chargement...</h6>}
                      </div>
                  </div>
              </div>
            </div>
        )
    }
}

Vehicles.propTypes = {
    car: PropTypes.object.isRequired,
}

export default Vehicles
