import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Preloader, CardPanel } from 'react-materialize'
import queryString from 'query-string'
import moment from 'moment'
import Navbar from 'components/Navbar/Navbar'
import MainForm from 'components/MainForm'
import Visite from 'components/Visite'
import MapContainer from 'components/GMaps/GMaps'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cities: undefined,
        }
    }

    componentDidMount() {
        this.fetchCities()
    }

    fetchCities = () => {
        fetch(`https://geo.api.gouv.fr/communes?fields=nom,centre,codesPostaux&format=json&geometry=centre`)
            .then((data) => data.json())
            .then((data) => this.setState({ cities: data }))
    }

    getComponentForURI = () => {
        // Tableau contenant les champs obligatoires dans l'URI
        const mandatoryParams = ['ville', 'date']
        // Paramètres de l'URI sous la forme d'un objet javascript "clé": "valeur"
        const query = queryString.parse(window.location.search)
        // Vaut vrai si tous les paramètres obligatoires sont inclus dans l'URI
        // Vaut faux si pas assez de paramètres ou aucuns sont fournis
        // Autorise d'autres paramètres qui ne sont pas dans le tableau
        const URIContainsMandatoryParams = mandatoryParams.every((param) => typeof query[param] !== 'undefined')

        if (URIContainsMandatoryParams) {
            // Equivaut à const cities = this.state.cities
            const { cities } = this.state
            // Si les villes sont chargées
            if (cities) {
                // S'il existe un paramètre nom dans l'URI et qu'il correspond à une ville connue
                // la variable city prend l'objet correspondant avec son nom, ses coordonées, etc.
                // sinon la variable vaut undefined
                const city = cities.find((city) => city.nom === query.ville)
                // Vaut vrai si la date dans l'URI a le pattern passé en paramètre
                const isValidDate =
                    moment(query.date, 'DD-MMM-YYYY', true).isValid() &&
                    moment(query.date, 'DD-MMM-YYYY').isBetween(moment().subtract(1, 'days'), moment().add(15, 'days'))
                // Si la ville est trouvée et que la date est valide
                return city && isValidDate ? (
                    <Visite ville={city.nom} lat={city.centre.coordinates[1]} lon={city.centre.coordinates[0]} date={query.date} />
                ) : (
                    <CardPanel className="red accent-1">Oups... something went wrong !</CardPanel>
                )
            } else {
                // Si les villes nes sont pas encore chargées on affiche un spinner
                return <Preloader active flashing={false} size="big" />
            }
        } else {
            // null indique qu'aucun composant React ne sera rendu
            return null
        }
    }

    render() {
        return (
            <Router>
                {/* Header */}
                <header>
                    <Navbar />
                </header>

                {/* Swith pour router l'URI */}
                <Switch>
                    {/* L'attribut 'path' représente l'URI concernée */}
                    <Route path="/">
                        <div className="container">
                            {this.state.cities ? <MainForm cities={this.state.cities} /> : <Preloader active flashing={false} size="big" />}
                            {/* <Visite lat={47.6596} lon={4.3496} ville="Montbard" /> */}
                            {this.getComponentForURI()}
                            {/* <MapContainer /> */}
                        </div>
                    </Route>
                </Switch>

                {/* Footer */}
                <footer className="page-footer blue darken-3">
                    <div className="footer-copyright blue darken-4">
                        <div className="container"></div>
                    </div>
                </footer>
            </Router>
        )
    }
}

export default App
