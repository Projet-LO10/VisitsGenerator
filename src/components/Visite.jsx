import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import { fetchAll } from 'model/fetch'

class Visite extends Component {
    mandatoryFields = []

    componentDidMount() {
        // fetchAll('Montbard').then(console.log)
    }

    render() {
        return <></>
    }
}

export default withRouter(Visite)
