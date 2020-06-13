import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Card } from 'react-materialize'

class Weather extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { dataSource, date, ville } = this.props

        return (
            <div>
                <h4>Voici les données météo à {ville}</h4>
                <Row>
                  <Col l={6}>
                    <Card className="center card-meteo">
                        <span className="card-title">Informations générales</span>
                        <h6>Ville : {ville}</h6>
                        <h6>Timezone : {dataSource.timezone}</h6>
                        <h6>Pays : {dataSource.country_code}</h6>
                    </Card>
                  </Col>
                  <Col l={6}>
                    <Card className="center">
                        <div className="card-image" style={{ width: '10%', margin: 'auto' }}>
                            {/* <img src={'src/images/weather/' + dataSource['weather']['icon'] + '.png'}></img> */}
                            <img src={`/images/weather/${dataSource['weather']['icon']}.png`} />
                        </div>
                        <span className="card-title">Météo le {date}</span>
                        <h6>Température : {dataSource['temp']} degrés</h6>
                        <h6>Description : {dataSource['weather']['description']}</h6>
                    </Card>
                  </Col>
                </Row>
            </div>
        )
    }
}

Weather.propTypes = {
    dataSource: PropTypes.object.isRequired,
    ville: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
}

export default Weather
