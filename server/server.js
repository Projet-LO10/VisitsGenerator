const express = require('express')
const app = express()
const moment = require('moment')
const js2xmlparser = require('js2xmlparser')
const yaml = require('yaml')
const path = require('path')
const fetchAll = require('./fetchAll')

/**
 * Middleware qui vérifie que les paramètres obligatoires sont bien présents dans la requête
 */
const verifyParametersPresence = (req, res, next) => {
    // Tableau contenant les champs obligatoires dans l'URI
    const mandatoryParams = ['ville', 'date']
    // Vaut vrai si tous les paramètres obligatoires sont inclus dans l'URI
    // Vaut faux si pas assez de paramètres ou aucuns sont fournis
    // Autorise d'autres paramètres qui ne sont pas dans le tableau
    // req.query contient les paramètres de l'URI
    const URIContainsMandatoryParams = mandatoryParams.every((param) => typeof req.query[param] !== 'undefined')

    if (URIContainsMandatoryParams) {
        // Appel au prochain middleware
        next()
    } else {
        // Si les paramètres sont invalides, l'erreur 400 est renvoyée
        res.sendStatus(400)
    }
}

/**
 * Middleware qui vérifie que les paramètres ont un format correct et qu'ils sont valides
 */
const verifyParametersValidity = (cities) => (req, res, next) => {
    const { ville, date } = req.query
    // S'il existe un paramètre nom dans l'URI et qu'il correspond à une ville connue
    // la variable city prend l'objet correspondant avec son nom, ses coordonées, etc.
    // sinon la variable vaut undefined
    const city = cities.find((city) => city.nom === ville)
    // Vaut vrai si la date dans l'URI a le pattern passé en paramètre
    const isValidDate =
        moment(date, 'DD-MMM-YYYY', true).isValid() && moment(date, 'DD-MMM-YYYY').isBetween(moment().subtract(1, 'days'), moment().add(15, 'days'))

    if (city && isValidDate) {
        // Cette ligne copie le contenu de req.query dans settings
        let settings = { ...req.query }
        // On ajoute la latitude et la longitude
        settings.lat = city.centre.coordinates[1]
        settings.lon = city.centre.coordinates[0]
        // Les constantes sont sauvegardées dans la variable "locals" pour qu'elles soient utilisées dans d'autres middlewares
        res.locals.settings = settings
        // Appel au prochain middleware
        next()
    } else {
        // Si les paramètres sont invalides, l'erreur 400 est renvoyée
        res.sendStatus(400)
    }
}

/**
 * Middleware qui fetch les données sur les API
 */
const fetchResults = (req, res, next) => {
    const { settings } = res.locals

    fetchAll(settings)
        // Lorsque les données sont correctement fetch
        .then((data) => {
            // Le résultat du fetch est sauvegardé dans la variable "locals" pour qu'il soit utilisé dans d'autres middlewares
            res.locals.result = data
            // Appel au prochain middleware
            next()
        })
        // En cas d'erreur de logique interne, le serveur renvoie l'erreur 500
        .catch((e) => {
            console.log(`Error - [Serveur Express] ${e}`)
            res.sendStatus(500)
        })
}

/**
 * Middleware qui traduit le résultat des API dans un format demandé par le Header "Accept" et qui inscrit le header "Content-Type" en header de réponse
 */
const handleAccept = (req, res, next) => {
    // Récupération de la variable locals.result
    let { result } = res.locals
    // En fonction du header 'Accept'
    res.format({
        'application/json': () => {
            // Indique que le résultat de la requête sera au format JSON
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
        },
        'application/xml': () => {
            // Indique que le résultat de la requête sera au format XML
            res.setHeader('Content-Type', 'application/xml; charset=utf-8')
            // Conversion du json en xml
            result = js2xmlparser.parse('visite', result)
        },
        'application/x-yaml': () => {
            // Indique que le résultat de la requête sera au format yaml
            res.setHeader('Content-Type', 'application/x-yaml')
            // Conversion du json en yaml
            result = yaml.stringify(result)
        },
        default: () => {
            // Indique que le résultat de la requête sera au format JSON
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
        },
    })

    // Retourne le résultat
    res.send(result)
}

/**
 * Démarre le serveur Express
 * @param {*} port port du serveur
 * @param {*} cities résultat de l'API communes avec toutes les villes gérées par le système
 */
const startServer = (port, dist, cities) => {
    // Suppression du header "x-powered-by" pour des raisons de sécurité
    app.disable('x-powered-by')
    app.use(express.static(dist))
    app.get('/api/visite', verifyParametersPresence, verifyParametersValidity(cities), fetchResults, handleAccept)
    app.get('*', (req, res) => {
        res.sendFile(path.join(dist, 'index.html'))
    })
    app.listen(port, () => {
        console.log(`[Serveur Express] Le serveur est démarré sur le port ${port}`)
    })
}

module.exports = startServer
