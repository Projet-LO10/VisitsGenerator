import React, { Component } from 'react'
import Weather from 'components/Weather/Weather.jsx'
import { Row, Button, Col, TextInput } from 'react-materialize'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import CitiesAutocomplete from 'components/CitiesAutocomplete.jsx'
import Museums from 'components/Museums/Museums.jsx'
import Vehicles from 'components/Vehicles/Vehicles.jsx'

class MainForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            city: undefined,
            car: undefined,
        }
    }

    handleClickCity = () => {
        let query = {}
        if (this.state.city) {
            query['nom'] = this.state.city.nom
            query['lat'] = this.state.city.centre.coordinates[1]
            query['lon'] = this.state.city.centre.coordinates[0]
        }
        this.props.history.push({
            pathname: '/',
            search: queryString.stringify(query),
        })
    }

    handleClickCar = () => {
        let query = {}
        if (this.state.car) {
            query['car'] = this.state.car
        }
        this.props.history.push({
            pathname: '/',
            search: queryString.stringify(query),
        })
    }

    handleCityChange = (city) => {
        this.setState({ city: city })
    }

    updateCarValue = (e) => {
        this.setState({ car: e.target.value })
    }

    render() {
        const query = queryString.parse(this.props.location.search)
        return (
            <>
                <Row>
                    <Col s="4">
                        <CitiesAutocomplete placeholder="Ville" onCityChange={this.handleCityChange} />
                    </Col>
                </Row>
                <Row>
                    <Button node="button" onClick={this.handleClickCity} waves="light">
                        Rechercher
                    </Button>
                </Row>
                <Row>
                  <TextInput placeholder="Véhicule" id="CarInput" onChange={this.updateCarValue}/>
                </Row>
                <Row>
                    <Button node="button" onClick={this.handleClickCar} waves="light">
                        Rechercher
                    </Button>
                </Row>
                <Row>{query.car && <Vehicles car={query.car} />}</Row>
                <Row>{query.nom && <Museums ville={query.nom} />}</Row>
                <Row>{query.lat && query.lon && query.nom && <Weather nom={query.nom} lat={Number(query.lat)} lon={Number(query.lon)} />}</Row>
            </>
        )
    }
}

export default withRouter(MainForm)
