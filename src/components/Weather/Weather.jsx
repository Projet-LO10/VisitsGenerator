import React, { Component } from 'react'

class Weather extends Component {
    state = {
        post: {},
        ville: {},
    }

    /*Permet de gérer le component*/
    componentDidMount() {
        fetch('https://api.weatherbit.io/v2.0/forecast/daily?city=Autun&lang=fr&key=e4669577bb74436e9dd4bba4fd820014')
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
                            <p>{this.state.post.city_name ? <h6>Ville : {this.state.post.city_name}</h6> : <h6>Ville : Chargement...</h6>}</p>
                            <p>{this.state.post.timezone ? <h6>Timezone : {this.state.post.timezone}</h6> : <h6>Timezone : Chargement...</h6>}</p>
                            <p>{this.state.post.country_code ? <h6>Pays : {this.state.post.country_code}</h6> : <h6>Pays : Chargement...</h6>}</p>
                        </div>
                    </div>
                </div>
                {/* ------------------------------------------*/}

                {/*CARD ------------------------------------------*/}
                <div className="row">
                    <div className="card blue-grey darken-1">
                        <div className="card-content orange-text">
                            <span className="card-title">J+1</span>
                            <p>{this.state.post.data ? <h6>Date : {this.state.post.data[0]['valid_date']}</h6> : <h6>Date : Chargement...</h6>}</p>
                            <p>{this.state.post.data ? <h6>Température : {this.state.post.data[0]['temp']}</h6> : <h6>Température : Chargement...</h6>}</p>
                            <p>{this.state.post.data ? <h6>Pays : {this.state.post.data[0]['weather']['description']}</h6> : <h6>Pays : Chargement...</h6>}</p>
                        </div>
                    </div>
                </div>
                {/* ------------------------------------------*/}

                {/*CARD ------------------------------------------*/}
                <div className="row">
                    <div className="card blue-grey darken-1">
                        <div className="card-content orange-text">
                            <span className="card-title">J+2</span>
                            <p>{this.state.post.data ? <h6>Date : {this.state.post.data[1]['valid_date']}</h6> : <h6>Date : Chargement...</h6>}</p>
                            <p>{this.state.post.data ? <h6>Température : {this.state.post.data[1]['temp']}</h6> : <h6>Température : Chargement...</h6>}</p>
                            <p>{this.state.post.data ? <h6>Pays : {this.state.post.data[1]['weather']['description']}</h6> : <h6>Pays : Chargement...</h6>}</p>
                        </div>
                    </div>
                </div>
                {/* ------------------------------------------*/}

                <h2>Voici une carte google maps</h2>
            </div>
        )
    }
}

export default Weather
