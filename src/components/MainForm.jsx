import React, { Component } from 'react'
import Weather from 'components/Weather/Weather.jsx'
import { Row, Button, Autocomplete } from 'react-materialize'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import CitiesAutocomplete from 'components/CitiesAutocomplete.jsx'
import Museums from 'components/Museums/Museums.jsx'

class MainForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            city: undefined,
        }
    }

    handleClick = () => {
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

    handleCityChange = (city) => {
        this.setState({ city: city })
    }

    render() {
        const query = queryString.parse(this.props.location.search)
        return (
            <>
                <Row>
                    <CitiesAutocomplete onCityChange={this.handleCityChange} />
                </Row>
                <Row>
                    <Button node="button" onClick={this.handleClick} waves="light">
                        Rechercher
                    </Button>
                </Row>
                <Row>
                    {query.nom && <Museums ville={query.nom} />}
                </Row>
                <Row>{query.lat && query.lon && query.nom && <Weather nom={query.nom} lat={Number(query.lat)} lon={Number(query.lon)} />}</Row>
            </>
        )
    }
}

export default withRouter(MainForm)
