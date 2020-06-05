import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Preloader } from 'react-materialize'
import Weather from 'components/Weather/Weather'
import Museums from 'components/Museums/Museums'
import HistoricalMonuments from 'components/HistoricalMonuments/HistoricalMonuments'

class Visite extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.loadData()
    }

    componentDidUpdate(prevProps) {
        const { ville, date } = this.props
        if (ville !== prevProps.ville || date !== prevProps.date) {
            this.loadData()
        }
    }

    /**
     * Fetch l'API proposée puis change l'état du composant quand la réponse est arrivée
     * Attend que toutes les réponses soient arrivées pour rentrer dans le then
     */
    loadData = () => {
        const { ville, date } = this.props
        console.log('Data is fetching')
        fetch(`/api/test?ville=${ville}&date=${date}`)
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

        const { ville, date } = this.props
        const { weather, museums, monuments } = this.state.data
        return (
            <div>
                <Weather dataSource={weather} ville={ville} date={date} />
                <Museums dataSource={museums} ville={ville} />
                <HistoricalMonuments dataSource={monuments} ville={ville} />
                {/* Ajouter les composants React ici */}
            </div>
        )
    }
}

Visite.propTypes = {
    ville: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
}

export default Visite
