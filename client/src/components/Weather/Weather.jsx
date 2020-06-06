import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Card, CardPanel } from 'react-materialize'

class Weather extends Component {
    constructor(props) {
        super(props)
    }

    // state = {
    //     post: {},
    //     ville: {},
    // }

    /*Permet de gérer le component*/
    // componentDidMount() {
    //     this.fetchWeather()
    // }

    // componentDidUpdate(prevProps) {
    //     if (prevProps.lat !== this.props.lat || prevProps.lon !== this.props.lon || prevProps.ville !== this.props.ville || prevProps.date !== this.props.date) {
    //         this.fetchWeather()
    //     }
    // }

    // fetchWeather = () => {
    //     fetch(
    //         `https://api.weatherbit.io/v2.0/forecast/daily?lat=${this.props.lat}&lon=${this.props.lon}&country=FR&lang=fr&key=e4669577bb74436e9dd4bba4fd820014`
    //     )
    //         .then((response) => response.json())
    //         .then((result) => {
    //             // setTimeout(() => {
    //             //     this.setState({ post: result })
    //             // }, 1500)
    //             this.setState({ post: result })
    //         })
    // }

    // isDateValid = (date) => {
    //     const before = moment().subtract(1, 'days')
    //     const after = moment().add(15, 'days')
    //     const now = moment(date)
    //     return now.isBetween(before, after)
    //     // return moment(date).isBetween(moment().subtract(1, 'days'), moment().add(15, 'days'))
    // }

    render() {
        const { dataSource, date, ville } = this.props

        return (
            <div className="App">
                <h3>Voici les données météo à {ville}</h3>

                {/*CARD Générale ------------------------------------------*/}
                <Card className="center blue-grey darken-1 orange-text">
                    <span className="card-title">Informations générales</span>
                    <h6>Ville : {ville}</h6>
                    <h6>Timezone : {dataSource.timezone}</h6>
                    <h6>Pays : {dataSource.country_code}</h6>
                </Card>

                {/*CARD pour le jour demandé ------------------------------------------*/}
                <Card className="center blue-grey darken-1 orange-text">
                    <div className="card-image" style={{ width: '10%', margin: 'auto' }}>
                        {/* <img src={'src/images/weather/' + dataSource['weather']['icon'] + '.png'}></img> */}
                        <img src={`/images/weather/${dataSource['weather']['icon']}.png`} />
                    </div>
                    <span className="card-title">Météo le {date}</span>
                    <h6>Température : {dataSource['temp']} degrés</h6>
                    <h6>Description : {dataSource['weather']['description']}</h6>
                </Card>

                {/*CARD Générale ------------------------------------------*/}
                {/* <Card className="center blue-grey darken-1 orange-text">
                    <span className="card-title">Informations générales</span>
                    {this.state.post.city_name ? <h6>Ville : {thi.state.psost.city_name}</h6> : <h6>Ville : Chargement...</h6>}
                    {this.state.post.timezone ? <h6>Timezone : {this.state.post.timezone}</h6> : <h6>Timezone : Chargement...</h6>}
                    {this.state.post.country_code ? <h6>Pays : {this.state.post.country_code}</h6> : <h6>Pays : Chargement...</h6>}
                </Card> */}
                {/* ------------------------------------------*/}

                {/*CARD pour le jour demandé ------------------------------------------*/}

                {/* <Card className="center blue-grey darken-1 orange-text">
                    <div className="card-image" style={{ width: '10%', margin: 'auto' }}>
                        {data ? <img src={'src/images/weather/' + data['weather']['icon'] + '.png'}></img> : <h6>Chargement...</h6>}
                    </div>
                    <span className="card-title">Météo le {date}</span>
                    {data ? <h6>Température : {data['temp']}</h6> : <h6>Température : Chargement...</h6>}
                    {data ? <h6>Description : {data['weather']['description']}</h6> : <h6>Description : Chargement...</h6>}
                </Card> */}

                {/*CARD ------------------------------------------*/}
                {/* <div className="row center">
                    <div className="card blue-grey darken-1">
                        <div className="card-content orange-text">
                            <div className="card-image" style={{ width: '10%', margin: 'auto' }}>
                                {this.state.post.data ? (
                                    <img src={'src/images/weather/' + this.state.post.data[0]['weather']['icon'] + '.png'}></img>
                                ) : (
                                    <h6>Pays : Chargement...</h6>
                                )}
                            </div>
                            <span className="card-title">J+1</span>
                            {this.state.post.data ? <h6>Date : {this.state.post.data[0]['valid_date']}</h6> : <h6>Date : Chargement...</h6>}
                            {this.state.post.data ? <h6>Température : {this.state.post.data[0]['temp']}</h6> : <h6>Température : Chargement...</h6>}
                            {this.state.post.data ? <h6>Pays : {this.state.post.data[0]['weather']['description']}</h6> : <h6>Pays : Chargement...</h6>}
                        </div>
                    </div>
                </div> */}
                {/* ------------------------------------------*/}

                {/*CARD ------------------------------------------*/}
                {/* <div className="row center">
                    <div className="card blue-grey darken-1">
                        <div className="card-content orange-text">
                            <div className="card-image" style={{ width: '10%', margin: 'auto' }}>
                                {this.state.post.data ? (
                                    <img src={'src/images/weather/' + this.state.post.data[1]['weather']['icon'] + '.png'}></img>
                                ) : (
                                    <h6>Pays : Chargement...</h6>
                                )}
                            </div>
                            <span className="card-title">J+2</span>
                            {this.state.post.data ? <h6>Date : {this.state.post.data[1]['valid_date']}</h6> : <h6>Date : Chargement...</h6>}
                            {this.state.post.data ? <h6>Température : {this.state.post.data[1]['temp']}</h6> : <h6>Température : Chargement...</h6>}
                            {this.state.post.data ? <h6>Pays : {this.state.post.data[1]['weather']['description']}</h6> : <h6>Pays : Chargement...</h6>}
                        </div>
                    </div>
                </div> */}
                {/* ------------------------------------------*/}
            </div>
        )
    }
}

Weather.propTypes = {
    dataSource: PropTypes.object.isRequired,
    ville: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
}

export default Weather
