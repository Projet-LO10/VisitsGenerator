import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Weather extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        post: {},
        ville: {},
    }

    /*Permet de gérer le component*/
    componentDidMount() {
        this.fetchWeather()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.city !== this.props.city) {
            this.fetchWeather()
        }
    }

    fetchWeather = () => {
        fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${this.props.city}&lang=fr&key=e4669577bb74436e9dd4bba4fd820014`)
            .then((response) => {
                return response.json()
            })
            .then((result) => {
                setTimeout(() => {
                    this.setState({ post: result })
                }, 1500)
            })
    }

    render() {
        return (
            <div className="App">
                <h2>Voici les données météo</h2>

                {/*CARD Générale ------------------------------------------*/}
                <div className="row">
                    <div className="card blue-grey darken-1">
                        <div className="card-content orange-text">
                            <span className="card-title">Informations générales</span>
                            {this.state.post.city_name ? <h6>Ville : {this.state.post.city_name}</h6> : <h6>Ville : Chargement...</h6>}
                            {this.state.post.timezone ? <h6>Timezone : {this.state.post.timezone}</h6> : <h6>Timezone : Chargement...</h6>}
                            {this.state.post.country_code ? <h6>Pays : {this.state.post.country_code}</h6> : <h6>Pays : Chargement...</h6>}
                        </div>
                    </div>
                </div>
                {/* ------------------------------------------*/}

                {/*CARD ------------------------------------------*/}
                <div className="row">
                    <div className="card blue-grey darken-1">
                        <div className="card-content orange-text">
                            <span className="card-title">J+1</span>
                            {this.state.post.data ? <h6>Date : {this.state.post.data[0]['valid_date']}</h6> : <h6>Date : Chargement...</h6>}
                            {this.state.post.data ? <h6>Température : {this.state.post.data[0]['temp']}</h6> : <h6>Température : Chargement...</h6>}
                            {this.state.post.data ? <h6>Pays : {this.state.post.data[0]['weather']['description']}</h6> : <h6>Pays : Chargement...</h6>}
                        </div>
                    </div>
                </div>
                {/* ------------------------------------------*/}

                {/*CARD ------------------------------------------*/}
                <div className="row">
                    <div className="card blue-grey darken-1">
                        <div className="card-content orange-text">
                            <span className="card-title">J+2</span>
                            {this.state.post.data ? <h6>Date : {this.state.post.data[1]['valid_date']}</h6> : <h6>Date : Chargement...</h6>}
                            {this.state.post.data ? <h6>Température : {this.state.post.data[1]['temp']}</h6> : <h6>Température : Chargement...</h6>}
                            {this.state.post.data ? <h6>Pays : {this.state.post.data[1]['weather']['description']}</h6> : <h6>Pays : Chargement...</h6>}
                        </div>
                    </div>
                </div>
                {/* ------------------------------------------*/}
            </div>
        )
    }
}

Weather.propTypes = {
    city: PropTypes.string.isRequired,
}

export default Weather
