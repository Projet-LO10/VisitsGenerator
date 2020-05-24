import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from 'components/Navbar/Navbar'
import MainForm from 'components/MainForm'
import Vehicles from 'components/Vehicles/Vehicles'
import MapContainer from 'components/GMaps/GMaps'
import MediaWikiForm from 'components/MediaWiki/MediaWikiForm'
import { Preloader } from 'react-materialize'

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
        /*
                autocompleteData should be :
                {
                    firstItem: null,
                    secondItem: null
                },
                */
        //     const autocompleteData = data.reduce((previous, current) => {
        //         previous[current.nom] = null
        //         return previous
        //     }, {})
        //     this.setState({
        //         citiesRawData: data,
        //         autocompleteData: autocompleteData,
        //     })
        // })
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
                            {/* <MapContainer /> */}
                            {/* <MediaWikiForm /> */}
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
