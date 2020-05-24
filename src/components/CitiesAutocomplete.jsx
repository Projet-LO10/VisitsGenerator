import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Autocomplete, ProgressBar } from 'react-materialize'

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
        return this.state.citiesRawData.length ? (
            <Autocomplete
                placeholder={this.props.placeholder}
                options={options}
                // Callback déclanché quand l'utilisateur entre une valeur à la main dans l'input (pas quand il clique sur une suggestion d'autocomplete)
                onChange={(e) => this.handleAutocomplete(e.target.value)}
                // La valeur affichée dans l'input
                value={this.state.cityInputValue}
                // autocomplete="off" permet d'éviter que le navigateur propose lui-même l'autocomplétion pour les balises <input>
                autocomplete="off"
            />
        ) : (
            <Autocomplete placeholder="Loading..." disabled />
        )
    }
}

CitiesAutocomplete.propTypes = {
    placeholder: PropTypes.string,
    onCityChange: PropTypes.func,
}

export default CitiesAutocomplete
