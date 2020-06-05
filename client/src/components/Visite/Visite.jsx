import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Preloader } from 'react-materialize'
import Weather from 'components/Weather/Weather'
import Museums from 'components/Museums/Museums'
import HistoricalMonuments from 'components/HistoricalMonuments/HistoricalMonuments'
import { fetchAll } from 'model/fetch'

class Visite extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                fetching: true,
            },
        }
    }

    componentDidMount() {
        this.loadData()
    }

    componentDidUpdate(prevProps) {
        const { ville, lat, lon } = this.props
        const { prevVille, prevLat, prevLon } = prevProps
        if (ville !== prevVille || lat !== prevLat || lon !== prevLon) {
            this.loadData()
        }
    }

    /**
     * Fetch toutes les API puis change l'état du composant quand la réponse est arrivée
     * Attend que toutes les réponses soient arrivées pour rentrer dans le then
     */
    loadData = () => {
        const { ville, lat, lon } = this.props
        fetchAll(ville, lat, lon).then((result) => {
            // L'objet "data" de l'état est rempli par l'objet récupéré par le fetch
            this.setState({ data: result })
        })
    }

    render() {
        // Si le composant charge
        if (this.state.data.fetching) {
            return <Preloader active flashing={false} size="big" />
        }

        const { ville, lat, lon, date } = this.props
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
    lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    lon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    date: PropTypes.string.isRequired,
}

export default Visite
