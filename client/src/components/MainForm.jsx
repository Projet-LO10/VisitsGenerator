import React, { Component } from 'react'
import { Row, Button, DatePicker, TextInput } from 'react-materialize'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import PropTypes from 'prop-types'
import moment from 'moment'
import CitiesAutocomplete from 'components/CitiesAutocomplete.jsx'
import CarForm from 'components/CarForm.jsx'

class MainForm extends Component {
    constructor(props) {
        super(props)
        this.params = new URLSearchParams(window.location.search)
        this.state = {
            modeleSelect: undefined,
            car: undefined,
            cityName: this.params.has('ville') ? this.params.get('ville') : '',
            // date sera un objet moment()
            date: this.params.has('date') ? moment(this.params.get('date'),'DD-MMM-YYYY') : moment(),
        }
    }

    /*sendData = () => {
      this.props.parentCallback(this.state);
    }

    callbackFunctionVehicule = (childData) => {
      this.state.carProperty = childData;
      this.sendData();
    }*/

    handleModele = (modeleValue) => {
        this.setState({modeleSelect: modeleValue});
    }

    /**
     * Méthode appelée dès que l'utlisateur clique sur le bouton de recherche de ville
     * Ajoute la valeur de l'attribut "cityName" de l'état interne en tant que paramètre "nom" dans l'URI
     * Appelle automatiquement la fonction render
     */
    handleClickCity = () => {
        let query = {}
        const { cityName, date, car, modeleSelect } = this.state
        if (cityName) {
            query['ville'] = cityName
        }
        if (date) {
            query['date'] = date.format('DD-MMM-YYYY')
        }
        if (car) {
            query['vehicule'] = car
        }
        if(modeleSelect){
            query['modele'] = modeleSelect
        }

        this.props.history.push({
            pathname: '/',
            search: queryString.stringify(query),
        })
    }

    /**
     * Handler appelé dès qu'une nouvelle valeur est entrée dans l'autocomplete de villes
     * Change l'attribut "cityName" de l'état interne par la valeur de l'autocomplete et appelle automatiquement la fonction render()
     */
    handleCityChange = (cityName) => {
        this.setState({ cityName: cityName })
    }

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
        return (
            <div className="form">
                <div>
                  <h3>Quelle ville allez-vous découvrir aujourd'hui ? </h3>
                </div>
                <Row>
                    <CitiesAutocomplete placeholder="Ville" cities={this.props.cities} onCityChange={this.handleCityChange} />
                    <DatePicker
                        placeholder="Date"
                        options={{
                            // Valeur par défaut
                            //defaultDate: this.params.has('date') ? moment(this.params.get('date'),'DD-MMM-YYYY').toDate() : moment().toDate(),
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
                        defaultValue={moment(this.state.date).format('DD MMM YYYY')}
                        l={4}
                    />
                </Row>
                <div>
                  <h5> Calculer en un clic l'économie carbonne réalisée en vous déplaçant à pied </h5>
                </div>
                <Row>
                    <CarForm onSelectModele={this.handleModele} />
                    {/*<TextInput placeholder="Véhicule" id="CarInput" onChange={this.updateCarValue} />*/}
                </Row>
                <Row>
                    <Button node="button" onClick={this.handleClickCity} waves="light">
                        Rechercher
                    </Button>
                </Row>
            </div>
        )
    }
}

MainForm.propTypes = {
    cities: PropTypes.array.isRequired,
}

export default withRouter(MainForm)
