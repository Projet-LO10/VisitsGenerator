const fetch = require('node-fetch')
const moment = require('moment')

const mandatoryInformation = ['weather', 'museums', 'monuments']

const fetchMuseums = (ville) => {
    return fetch(
        `https://data.culture.gouv.fr/api/records/1.0/search/?dataset=liste-et-localisation-des-musees-de-france&q=&rows=-1&facet=departement&facet=region&refine.ville=${ville.toUpperCase()}`
    ).then((x) => x.json())
}

const fetchMonuments = (ville) => {
    const refine = ville.toUpperCase() === 'PARIS' ? 'dpt_lettre' : 'commune'
    return fetch(
        `https://data.culture.gouv.fr/api/records/1.0/search/?dataset=liste-des-immeubles-proteges-au-titre-des-monuments-historiques&q=&facet=reg&facet=dpt_lettre&refine.${refine}=${ville}`
    ).then((x) => x.json())
}

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

const fetchVehicle = (query) => {
    return fetch(
        `https://public.opendatasoft.com/api/records/1.0/search/?q=${query}&dataset=vehicules-commercialises&q=&sort=puissance_maximale&facet=marque&facet=modele_utac&facet=carburant&facet=hybride&facet=puissance_administrative&facet=boite_de_vitesse&facet=annee&facet=carrosserie&facet=gamme`
    )
        .then((x) => x.json())
        .then((dataSource) => dataSource.records[0].fields)
}

/**
 * Retourne une promesse :
 * resolve (then) quand tous les fetch ont été accomplis. Le premier paramètre du then est un objet content les résultats des différents fetch @see keys
 * reject (catch) quand le nombre de promesses n'est pas respecté
 * @param {*} ville
 * @param {*} lat
 * @param {*} lon
 */
const fetchAll = (ville, lat, lon, date, vehicle = undefined) => {
    // Les clés présentes dans l'objet présent dans le then
    let promises = [fetchWeather(lat, lon, date), fetchMuseums(ville), fetchMonuments(ville)]
    let information = mandatoryInformation
    if (vehicle) {
        promises.push(fetchVehicle(vehicle))
        information.push('vehicle')
    }
    return Promise.all(promises).then(
        (array) =>
            new Promise((resolve, reject) => {
                array.length !== promises.length && information.length != promises.length && reject('Nombre de promesses incorrect')
                resolve(
                    information.reduce((acc, curr, i) => {
                        acc[curr] = array[i]
                        return acc
                    }, {})
                )
            })
    )
}

module.exports = fetchAll
