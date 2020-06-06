import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import Visite from 'components/Visite/Visite'

class VisiteController extends Component {
    render() {
        // Tableau contenant les champs obligatoires dans l'URI
        const mandatoryParams = ['ville', 'date']
        // Paramètres de l'URI sous la forme d'un objet javascript "clé": "valeur"
        const query = queryString.parse(this.props.location.search)
        // Vaut vrai si tous les paramètres obligatoires sont inclus dans l'URI
        // Vaut faux si pas assez de paramètres ou aucuns sont fournis
        // Autorise d'autres paramètres qui ne sont pas dans le tableau
        const URIContainsMandatoryParams = mandatoryParams.every((param) => typeof query[param] !== 'undefined')

        if (URIContainsMandatoryParams) {
            return <Visite query={query} />
        } else {
            // null indique qu'aucun composant React ne sera rendu
            return null
        }
    }
}

export default withRouter(VisiteController)
