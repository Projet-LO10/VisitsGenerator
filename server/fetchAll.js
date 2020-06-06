const fetch = require('node-fetch')
const moment = require('moment')

/**
 * Fetch l'API des musées
 * @param {string} ville Nom de la ville
 */
const fetchMuseums = (ville) => {
    return fetch(
        `https://data.culture.gouv.fr/api/records/1.0/search/?dataset=liste-et-localisation-des-musees-de-france&q=&rows=-1&facet=departement&facet=region&refine.ville=${ville.toUpperCase()}`
    ).then((x) => x.json())
}

/**
 * Fetch l'API des monuments
 * @param {string} ville Nom de la ville
 */
const fetchMonuments = (ville) => {
    const refine = ville.toUpperCase() === 'PARIS' ? 'dpt_lettre' : 'commune'
    return fetch(
        `https://data.culture.gouv.fr/api/records/1.0/search/?dataset=liste-des-immeubles-proteges-au-titre-des-monuments-historiques&q=&facet=reg&facet=dpt_lettre&refine.${refine}=${ville}`
    ).then((x) => x.json())
}

/**
 * Fetch l'API de météo
 * @param {*} lat Latitude
 * @param {*} lon Longitude
 * @param {string} date Date
 */
const fetchWeather = (lat, lon, date) => {
    return fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&country=FR&lang=fr&key=83f8cad20c1b48b6b4060efa4ee22176`)
        .then((x) => x.json())
        .then((dataSource) => {
            const params = ['city_name', 'lon', 'lat', 'timezone', 'country_code', 'state_code']
            const formatedDate = moment(date, 'DD-MMM-YYYY').format('YYYY-MM-DD')
            let weatherOfDate = dataSource.data.find((entry) => entry.valid_date === formatedDate)
            params.forEach((elt) => {
                weatherOfDate[elt] = dataSource[elt]
            })
            return weatherOfDate
        })
}

/**
 * Fetch l'API des véhicules
 * @param {string} query
 */
const fetchVehicle = (query) => {
    return fetch(
        `https://public.opendatasoft.com/api/records/1.0/search/?q=${query}&dataset=vehicules-commercialises&q=&sort=puissance_maximale&facet=marque&facet=modele_utac&facet=carburant&facet=hybride&facet=puissance_administrative&facet=boite_de_vitesse&facet=annee&facet=carrosserie&facet=gamme`
    )
        .then((x) => x.json())
        .then((dataSource) => dataSource.records[0].fields)
}

/**
 * Méthode appelée par fetchAll
 * Son rôle est de gérer les paramètres non obligatoires de la requête
 * @param {object} settings
 * @param {object} promises
 */
const handleOptionalParameters = (settings, promises) => {
    if (settings.vehicule) {
        promises.vehicle = fetchVehicle(settings.vehicule)
    }
}

/**
 * Retourne une promesse :
 * resolve (then) quand tous les fetch ont été accomplis. Le premier paramètre du then est un objet content les résultats des différents fetch @see keys
 * reject (catch) quand le nombre de promesses n'est pas respecté
 * @param {object} settings
 */
const fetchAll = (settings) => {
    const { ville, lat, lon, date } = settings
    // Liste des promesses qui vont être lancées puis synchronisées
    // Les clés présentes dans cet objet seront les mêmes que celles du résultat de la requête
    let promises = {
        weather: fetchWeather(lat, lon, date),
        museums: fetchMuseums(ville),
        monuments: fetchMonuments(ville),
    }
    // On gère les paramètres optionnels
    handleOptionalParameters(settings, promises)
    // Toutes les promesses sont exécutées, rentre dans le then lorsque toutes sont terminées
    return Promise.all(Object.values(promises)).then(
        (array) =>
            //Lorsque toutes les requêtes sont terminées on retourne une promesse (pour que l'utilisation soit la même qu'avec un fetch standard)
            new Promise((resolve, reject) => {
                resolve(
                    Object.keys(promises).reduce((acc, curr, i) => {
                        acc[curr] = array[i]
                        return acc
                    }, {})
                )
            })
    )
}

module.exports = fetchAll
