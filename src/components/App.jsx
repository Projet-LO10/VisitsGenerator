import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Weather from 'components/Weather/Weather.jsx'
import Navbar from 'components/Navbar/Navbar.jsx'

class App extends Component {
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
                        <Weather />
                    </Route>
                </Switch>

                {/* Footer */}
                <footer class="page-footer blue darken-3">
                    <div class="footer-copyright blue darken-4">
                        <div class="container"></div>
                    </div>
                </footer>
            </Router>
        )
    }
}

export default App
