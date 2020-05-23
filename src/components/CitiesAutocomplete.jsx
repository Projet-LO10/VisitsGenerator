import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Autocomplete } from 'react-materialize'

class CitiesAutocomplete extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cityInputValue: '',
            currentCity: {},
            citiesRawData: [],
            autocompleteData: {},
        }
    }

    /**
     * When the component mounts, the system fetches one time (only one) french cities in geo.api.gouv.fr API
     */
    componentDidMount() {
        this.fetchCities()
    }

    /**
     * When a new value is entered in the autocomplete
     */
    handleAutocomplete = (value) => {
        const city = this.state.citiesRawData.find((entry) => entry.nom === value)
        this.updateParent(city)
        this.setState({ cityInputValue: value })
    }

    /**
     * If the autocomplete input matches a value in the raw datasource, the city is given back to the parent throughout a function
     */
    updateParent = (city) => {
        if (this.props.onCityChange) {
            this.props.onCityChange(city)
        }
    }

    fetchCities = () => {
        fetch(`https://geo.api.gouv.fr/communes?fields=nom,centre,codesPostaux&format=json&geometry=centre`)
            .then((x) => x.json())
            .then((data) => {
                /*
                autocompleteData should be :
                {
                    firstItem: null,
                    secondItem: null
                },
                */
                const autocompleteData = data.reduce((previous, current) => {
                    previous[current.nom] = null
                    return previous
                }, {})
                this.setState({
                    citiesRawData: data,
                    autocompleteData: autocompleteData,
                })
            })
    }

    render() {
        const options = {
            data: this.state.autocompleteData,
            limit: 10,
            onAutocomplete: this.handleAutocomplete,
        }
        return (
            <Autocomplete placeholder="Ville" options={options} onChange={(e) => this.handleAutocomplete(e.target.value)} value={this.state.cityInputValue} />
        )
    }
}

CitiesAutocomplete.propTypes = {
    placeholder: PropTypes.string,
    onCityChange: PropTypes.func,
}

export default CitiesAutocomplete
