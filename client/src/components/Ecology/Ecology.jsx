import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Card, CardPanel } from 'react-materialize'

class Ecology extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { car, dist } = this.props

        return (
            <div className="App">
              <Card className="center blue-grey darken-1 orange-text">
                  <span className="card-title">Informations sur le trajet</span>
                  {dist && car ? (
                      <h6>Economie carbone : {(dist / 1000) * car.co2_g_km} g</h6>
                  ) : (
                      <h6>Economie carbone : Chargement...</h6>
                  )}
              </Card>
            </div>
        )
    }
}

Ecology.propTypes = {
    car: PropTypes.object.isRequired,
    dist: PropTypes.string.isRequired,
}

export default Ecology
