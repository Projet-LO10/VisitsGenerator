import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Preloader, Container } from 'react-materialize'
import Navbar from 'components/Navbar/Navbar'
import MainForm from 'components/MainForm'
import VisiteController from 'components/Visite/VisiteController'

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

    render() {
        const { cities } = this.state
        return (
            <Router>
                {/* Header */}
                <header>
                    <Navbar />
                </header>

                {/* Swith pour router l'URI */}
                <main>
                    <Container>
                        {cities ? <MainForm cities={cities} /> : <Preloader active flashing={false} size="big" />}
                        <Switch>
                            {/* L'attribut 'path' représente l'URI concernée */}
                            <Route path="/visite">
                                <VisiteController />
                            </Route>
                        </Switch>
                    </Container>
                </main>

                {/* Footer */}
                <footer className="page-footer blue darken-3">
                    <div className="footer-copyright blue darken-4">
                        <div className="container">Made with ❤️ by Axel, Damien and Victor</div>
                    </div>
                </footer>
            </Router>
        )
    }
}

export default App
