import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from 'components/Navbar/Navbar'
import MainForm from 'components/MainForm'
import Vehicles from 'components/Vehicles/Vehicles'
import MapContainer from 'components/GMaps/GMaps'

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
                        <div className="container">
                            <MainForm />
                            {/*                             
                            <Vehicles />
                            <MapContainer /> 
                            */}
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
