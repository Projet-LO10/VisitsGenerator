import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Preloader } from 'react-materialize'
import Weather from 'components/Weather/Weather'
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
        const { ville, lat, lon } = this.props
        fetchAll(ville, lat, lon).then((result) => {
            // L'objet "data" de l'état est rempli par l'objet récupéré par le fetch
            this.setState({ data: result })
        })
    }

    render() {
        console.log(this.state.data)

        if (this.state.data.fetching) {
            return <Preloader active flashing={false} size="big" />
        }

        const query = queryString.parse(this.props.location.search)
        const { ville, lat, lon } = this.props
        const { weather, museums, monuments } = this.state.data
        return (
            <div>
                <Weather dataSource={weather} ville={ville} date={query.date} />
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

export default withRouter(Visite)
