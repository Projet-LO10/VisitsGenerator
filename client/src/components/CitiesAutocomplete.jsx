import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Autocomplete, ProgressBar } from 'react-materialize'

class CitiesAutocomplete extends Component {
    constructor(props) {
        super(props)
        const params = new URLSearchParams(window.location.search)
        this.state = {
            cityInputValue: params.has('ville') ? params.get('ville') : '',
            currentCity: {},
            autocompleteData: {},
        }
    }

    componentDidMount() {
        // autocompleteData should be :
        // {
        //     firstItem: null,
        //     secondItem: null
        // },
        const autocompleteData = this.props.cities.reduce((previous, current) => {
            previous[current.nom] = null
            return previous
        }, {})
        this.setState({ autocompleteData: autocompleteData })
    }

    /**
     * When a new value is entered in the autocomplete
     */
    handleAutocomplete = (value) => {
        const city = this.props.cities.find((entry) => entry.nom === value)
        this.updateParent(city)
        this.setState({ cityInputValue: value })
    }

    /**
     * If the autocomplete input matches a value in the raw datasource, the city is given back to the parent throughout a function
     */
    updateParent = (city) => {
        if (this.props.onCityChange) {
            this.props.onCityChange(city ? city.nom : '')
        }
    }

    render() {
        const options = {
            data: this.state.autocompleteData,
            limit: 10,
            onAutocomplete: this.handleAutocomplete,
        }
        return (
            <Autocomplete
                placeholder={this.props.placeholder}
                options={options}
                // Callback déclanché quand l'utilisateur entre une valeur à la main dans l'input (pas quand il clique sur une suggestion d'autocomplete)
                onChange={(e) => this.handleAutocomplete(e.target.value)}
                // La valeur affichée dans l'input
                value={this.state.cityInputValue}
                // autoComplete="off" permet d'éviter que le navigateur propose lui-même l'autocomplétion pour les balises <input>
                autoComplete="off"
                s={12}
                m={7}
                l={8}
            />
        )
    }
}

CitiesAutocomplete.propTypes = {
    placeholder: PropTypes.string,
    onCityChange: PropTypes.func,
    cities: PropTypes.array.isRequired,
}

export default CitiesAutocomplete
