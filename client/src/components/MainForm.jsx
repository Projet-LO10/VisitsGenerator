import React, { Component } from 'react'
import Weather from 'components/Weather/Weather.jsx'
import { Row, Col, Button, DatePicker, TextInput } from 'react-materialize'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import PropTypes from 'prop-types'
import moment from 'moment'
import CitiesAutocomplete from 'components/CitiesAutocomplete.jsx'
import Museums from 'components/Museums/Museums.jsx'
import Vehicles from 'components/Vehicles/Vehicles.jsx'
import HistoricalMonuments from 'components/HistoricalMonuments/HistoricalMonuments.jsx'
import CarForm from 'components/CarForm.jsx'

class MainForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            car: undefined,
            cityName: '',
            // date sera un objet moment()
            date: moment(),
        }
    }

    /*sendData = () => {
      this.props.parentCallback(this.state);
    }

    callbackFunctionVehicule = (childData) => {
      this.state.carProperty = childData;
      this.sendData();
    }*/

    /**
     * Méthode appelée dès que l'utlisateur clique sur le bouton de recherche de ville
     * Ajoute la valeur de l'attribut "cityName" de l'état interne en tant que paramètre "nom" dans l'URI
     * Appelle automatiquement la fonction render
     */
    handleClickCity = () => {
        let query = {}
        const { cityName, date, car } = this.state
        if (cityName) {
            query['ville'] = cityName
        }
        if (date) {
            query['date'] = date.format('DD-MMM-YYYY')
        }
        if (car) {
            query['vehicule'] = car
        }
        this.props.history.push({
            pathname: '/',
            search: queryString.stringify(query),
        })
        //this.sendData();
    }

    /*handleClickCar = () => {
        let query = {}
        if (this.state.car) {
            query['car'] = this.state.car
        }
        this.props.history.push({
            pathname: '/',
            search: queryString.stringify(query),
        })
    }*/

    /**
     * Handler appelé dès qu'une nouvelle valeur est entrée dans l'autocomplete de villes
     * Change l'attribut "cityName" de l'état interne par la valeur de l'autocomplete et appelle automatiquement la fonction render()
     */
    handleCityChange = (cityName) => {
        this.setState({ cityName: cityName })
    }

    /*noRefCheck = (select) => {
        this.setState({ car: select.target.options[select.target.value].text })
    }*/

    updateCarValue = (e) => {
        this.setState({ car: e.target.value })
    }

    /**
     * Callback quand une date est sélectionnée
     */
    handleDateSelect = (date) => {
        console.log(date)
        this.state.date = moment(date)
    }

    render() {
        // Paramètres de l'URI sous la forme d'un objet javascript "clé": "valeur"
        const query = queryString.parse(this.props.location.search)
        // S'il existe un paramètre nom dans l'URI et qu'il correspond à une ville connue
        // la variable city prend l'objet correspondant avec son nom, ses coordonées, etc.
        // sinon la variable vaut un objet vide
        const city = query.ville ? this.props.cities.find((city) => city.nom === query.ville) : {}
        return (
            <>
                <Row>
                    <CarForm />
                </Row>
                <Row>
                    <CitiesAutocomplete placeholder="Ville" cities={this.props.cities} onCityChange={this.handleCityChange} />
                    <DatePicker
                        placeholder="Date"
                        options={{
                            // Valeur par défaut
                            defaultDate: moment().toDate(),
                            // Se ferme automatiquement quand l'utilisateur clique
                            autoClose: true,
                            // Format utilisé pour l'affichage de la date
                            format: 'dd mmm yyyy',
                            // Current date
                            minDate: moment().toDate(),
                            // Current date + 15 days @see weatherapi
                            maxDate: moment().add(15, 'days').toDate(),
                            // Callback quand une date est sélectionnée
                            onSelect: this.handleDateSelect,
                        }}
                        autoComplete="off"
                        defaultValue={moment().format('DD MMM YYYY')}
                    />
                </Row>
                <Row>
                    <TextInput placeholder="Véhicule" id="CarInput" onChange={this.updateCarValue} />
                </Row>
                <Row>
                    <Button node="button" onClick={this.handleClickCity} waves="light">
                        Rechercher
                    </Button>
                </Row>
                {/*}<Row>
                    <Button node="button" onClick={this.handleClickCar} waves="light">
                        Rechercher
                    </Button>
                </Row>*/}
                {/*<Row>{query.car && <Vehicles car={query.car} />}</Row>*/}
                {/* <Row>{query.ville && city && <Museums ville={query.ville} />}</Row> */}
                {/* <Row>{query.ville && city && <HistoricalMonuments ville={query.ville} />}</Row> */}
                {/* <Row>{query.ville && query.date && city && <Weather ville={query.ville} lat={Number(city.centre.coordinates[1])} lon={Number(city.centre.coordinates[0])} date={query.date} />}</Row> */}
            </>
        )
    }
}

MainForm.propTypes = {
    cities: PropTypes.array.isRequired,
}

export default withRouter(MainForm)
