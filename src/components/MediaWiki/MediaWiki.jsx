import React, { Component } from 'react'
import PropTypes from 'prop-types'

const proxyurl = 'https://cors-anywhere.herokuapp.com/'

class MediaWiki extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        infos: '',
    }

    /*Permet de gérer le component*/
    componentDidMount() {
        this.fetchMediaWiki()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.city !== this.props.city) {
            this.fetchMediaWiki()
        }
    }

    fetchMediaWiki = () => {
        fetch(
            proxyurl +
                `https://fr.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&exintro&titles=${this.props.city}&redirects=`
        )
            .then((response) => response.json())
            .then((result) => {
                console.log(result)
                if (Object.keys(result.query['pages']) == -1) {
                    this.setState({ infos: 'Pas de données' })
                } else {
                    this.setState({ infos: result.query['pages'][Object.keys(result.query['pages'])[0]]['extract'] })
                    console.log(this.state.infos)
                }
            })
    }

    render() {
        return (
            <div className="App">
                {/*CARD Générale ------------------------------------------*/}
                <div className="row">
                    <div className="card blue-grey darken-1">
                        <div className="card-content orange-text">
                            <span className="card-title">Informations générales</span>
                            {this.state.infos ? <h6>{this.state.infos}</h6> : <h6>Chargement...</h6>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MediaWiki
