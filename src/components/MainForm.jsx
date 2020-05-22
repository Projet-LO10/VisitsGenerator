import React, { Component } from 'react'
import Weather from 'components/Weather/Weather.jsx'
import { Row, Button, Autocomplete } from 'react-materialize'

class MainForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cityInputValue: '',
            city: '',
            autocompleteOption: {},
        }
    }

    /**
     * When the component mounts, the system fetches one time (only one) french cities in geo.api.gouv.fr API
     */
    componentDidMount() {
        this.fetchCities()
    }

    handleClick = () => this.setState({ city: this.state.cityInputValue })

    handleAutocomplete = value => {
        this.setState({ cityInputValue: value })
    }

    fetchCities = () => {
        fetch(`https://geo.api.gouv.fr/communes?fields=nom&format=json&geometry=centre`)
            .then((x) => x.json())
            .then((data) => {
                /*
                autocompleteOption should be :
                {
                    data: {
                        firstItem: null,
                        secondItem: null
                    },
                    limit: <any number>,
                    onAutocomplete: <a function>,
                }
                */
                const autocompleteData = data.reduce((previous, current) => {
                    previous[current.nom] = null
                    return previous
                }, {})
                this.setState({
                    autocompleteOption: {
                        data: autocompleteData,
                        limit: 10,
                        onAutocomplete: this.handleAutocomplete,
                    },
                })
            })
    }

    render() {
        return (
            <>
                <Row>
                    <Autocomplete
                        placeholder="Ville"
                        options={this.state.autocompleteOption}
                        onChange={(e) => this.handleAutocomplete(e.target.value)}
                        value={this.state.cityInputValue}
                    />
                </Row>
                <Row>
                    <Button node="button" onClick={this.handleClick} waves="light">
                        Rechercher
                    </Button>
                </Row>
                <Row>{this.state.city && <Weather city={this.state.city} />}</Row>
            </>
        )
    }
}

export default MainForm
