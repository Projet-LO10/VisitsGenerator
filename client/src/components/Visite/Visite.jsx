import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Preloader } from 'react-materialize'
import queryString from 'query-string'
import Weather from 'components/Weather/Weather'
import Museums from 'components/Museums/Museums'
import HistoricalMonuments from 'components/HistoricalMonuments/HistoricalMonuments'
import GMaps from 'components/GMaps/GMaps'
import Vehicles from 'components/Vehicles/Vehicles.jsx'
import Ecology from 'components/Ecology/Ecology.jsx'

class Visite extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.loadData()
    }

    componentDidUpdate(prevProps) {
        const { ville, date, vehicule } = this.props.query
        if (ville !== prevProps.query.ville || date !== prevProps.query.date || vehicule !== prevProps.query.vehicule) {
            this.loadData()
        }
    }

    /**
     * Fetch l'API proposée puis change l'état du composant quand la réponse est arrivée
     * Attend que toutes les réponses soient arrivées pour rentrer dans le then
     */
    loadData = () => {
        fetch(`/api/visite?${queryString.stringify(this.props.query)}`)
            .then((result) => result.json())
            .then((result) => {
                // L'objet "data" de l'état est rempli par l'objet récupéré par le fetch
                this.setState({ data: result })
            })
    }

    render() {
        // Si le composant charge
        if (!this.state.data) {
            return <Preloader active flashing={false} size="big" />
        }

        // Ces constantes reçoivent les paramètres présents dans la requête
        const { ville, date } = this.props.query
        // Ces constantes sont les données qui ont été fetch par l'API
        // Attention, certaines peuvent être nulles (ex: vehicle)
        const { weather, museums, monuments, vehicle, roads, eco } = this.state.data
        return (
            <div className="animate__animated animate__backInDown">
                <GMaps eco={eco} dataSource={roads} ville={ville} />
                {/*vehicle && <Vehicles car={vehicle} />*/}
                {/*vehicle && <Ecology eco={eco} car={vehicle} />*/}
                <Weather dataSource={weather} ville={ville} date={date} />
                {museums.length != 0 && <Museums dataSource={museums} ville={ville} />}
                {monuments.length != 0 && <HistoricalMonuments dataSource={monuments} ville={ville} />}
            </div>
        )
    }
}

Visite.propTypes = {
    query: PropTypes.object.isRequired,
}

export default Visite
