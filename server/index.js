const app = require('express')()
const fetch = require('node-fetch')
const moment = require('moment')
const contentTypeParser = require('content-type')
const js2xmlparser = require('js2xmlparser')
const yaml = require('yaml')
const fetchAll = require('./fetchAll.js')
const PORT = (process.argv[3] && typeof process.argv[3] === 'number') || 8080

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
        // Les constantes sont sauvegardées dans la variable "locals" pour qu'elles soient utilisées dans d'autres middlewares
        res.locals.city = city
        res.locals.date = date
        // Appel au prochain middleware
        next()
    } else {
        // Si les paramètres sont invalides, l'erreur 400 est renvoyée
        res.sendStatus(400)
    }
}

const fetchResults = (req, res, next) => {
    // Récupération de la constante city et date
    const { city, date } = res.locals
    // Récupération de la latitude et de la longitude
    const lat = city.centre.coordinates[1]
    const lon = city.centre.coordinates[0]

    fetchAll(city.nom, lat, lon, date).then((data) => {
        // Le résultat du fetch est sauvegardé dans la variable "locals" pour qu'il soit utilisé dans d'autres middlewares
        res.locals.result = data
        // Appel au prochain middleware
        next()
    })
}

const handleAccept = (req, res, next) => {
    // Récupération de la variable locals.result
    let { result } = res.locals
    // On récupère le header Content-Type de la requête
    const accept = req.get('Accept')

    // Si le header est renseigné
    if (accept) {
        switch (contentTypeParser.parse(accept).type) {
            case 'application/json':
                // Indique que le résultat de la requête sera au format JSON
                res.setHeader('Content-Type', 'application/json; charset=utf-8')
                break
            case 'application/xml':
                // Indique que le résultat de la requête sera au format XML
                res.setHeader('Content-Type', 'application/xml; charset=utf-8')
                // Conversion du json en xml
                result = js2xmlparser.parse('visite', result)
                break
            case 'application/x-yaml':
                // Indique que le résultat de la requête sera au format yaml
                res.setHeader('Content-Type', 'application/x-yaml')
                // Conversion du json en yaml
                result = yaml.stringify(result)
                break
            default:
                // Indique que le résultat de la requête sera au format JSON
                res.setHeader('Content-Type', 'application/json; charset=utf-8')
                break
        }
    } else {
        // Indique que le résultat de la requête sera au format JSON
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
    }

    // Retourne le résultat
    res.send(result)
}

const startServer = (cities) => {
    // Suppression du header "x-powered-by" pour des raisons de sécurité
    app.disable('x-powered-by')

    app.get('/api/test', verifyParametersPresence, verifyParametersValidity(cities), fetchResults, handleAccept)

    app.listen(PORT, () => {
        console.log(`Le serveur est démarré sur le port ${PORT}`)
    })
}

fetch('https://geo.api.gouv.fr/communes?fields=nom,centre,codesPostaux&format=json&geometry=centre')
    .then((x) => x.json())
    .then((result) => {
        startServer(result)
    })
