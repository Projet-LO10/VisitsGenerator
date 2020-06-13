const fetch = require('node-fetch')
const moment = require('moment')

const maxPOI = 5;

const fetchRoads = (dataMuseums) => {
    const museums = dataMuseums.records.filter((museum) => museum.hasOwnProperty('geometry'))
    let coordinates = [];
    let noms = [];
    museums.map((museum) => {
        // Certains musées sont dôtés de coordonnées, d'autres noms:
        // Ceux-ci ont un objet geometry
        // avec un champ coordinates [longitude, latitude]
        noms.push(museum['fields']['nom_du_musee']);
        coordinates.push(museum.geometry['coordinates']);
    });
    let origin = '';
    let path = '';
    coordinates.map((coordinate, index) => {
      if(index <= 5){
        if(index == 1){
          origin = coordinate[1] + ',' + coordinate[0];
        }
        path += "via:" + coordinate[1] + ',' + coordinate[0];
        if(index != 5 && index != (coordinates.length - 1)){
          path += '|';
        }
      }
    });
    return fetch(
      'https://maps.googleapis.com/maps/api/directions/json?origin=' + origin + '&destination=' + origin + '&waypoints=' + path + '&language=fr&mode=walking&key=AIzaSyC2EbNhEBrOMzZFk4vbwpm6h-GTrfXTwH0'
      //'https://maps.googleapis.com/maps/api/directions/json?origin=48.87396223516477,2.295111042446485&destination=48.87396223516477,2.295111042446485&waypoints=via:48.86612446131622,2.312576404506803|via:48.87198647229124,2.3316210022659334&key=AIzaSyC2EbNhEBrOMzZFk4vbwpm6h-GTrfXTwH0'
    )
    .then((response) => response.json())
    .then((result) => {
        var res = {};
        res.coordinates = coordinates;
        res.noms = noms;
        res.roads = result['routes'][0]['legs'][0];
        let temp = []
        temp.push({ lat: res.roads['start_location']['lat'], lng: res.roads['start_location']['lng'] })
        for (var i = 0; i < res.roads['steps'].length; i++) {
            temp.push(res.roads['steps'][i]['end_location'])
        }
        temp.push({ lat: res.roads['end_location']['lat'], lng: res.roads['end_location']['lng'] })
        res.pathCoordinates = temp;
        return res;
    });
}

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
 * @param {string} name
 */
const fetchVehicle = (name, modele) => {
    var fetchURI = "";
    if(modele){
      fetchURI = `https://public.opendatasoft.com/api/records/1.0/search/?&dataset=vehicules-commercialises&sort=puissance_maximale&facet=marque&facet=modele_utac&facet=carburant&facet=hybride&facet=puissance_administrative&facet=boite_de_vitesse&facet=annee&facet=carrosserie&facet=gamme&refine.modele_utac=${modele}`;
    }
    else if(name){
      fetchURI = `https://public.opendatasoft.com/api/records/1.0/search/?q=${name}&dataset=vehicules-commercialises&q=&sort=puissance_maximale&facet=marque&facet=modele_utac&facet=carburant&facet=hybride&facet=puissance_administrative&facet=boite_de_vitesse&facet=annee&facet=carrosserie&facet=gamme`;
    }

     return fetch(
        fetchURI
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
    if (settings.vehicule || settings.modele) {
        promises.vehicle = fetchVehicle(settings.vehicule, settings.modele)
    }
}

const shuffle = (arr) => {
  var array = [...arr];
  for (let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
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
    ).then((result) => {
      if (result.museums){
        result.museums.records = shuffle(result.museums.records)
        if (result.museums.records.length > maxPOI){
          result.museums.records = result.museums.records.slice(0, maxPOI);
        }
      }
      if (result.monuments){
        result.monuments.records = shuffle(result.monuments.records)
        if (result.monuments.records.length > maxPOI){
          result.monuments.records = result.monuments.records.slice(0, maxPOI);
        }
      }
      let choix;
      if (result.weather.weather.code.toString().substr(0,1) == 8) {
        choix = result.monuments;
        result.museums = [];
      } else {
        choix = result.museums;
        result.monuments = [];
      }
      return fetchRoads(choix).then((res)=>{
        result.roads = res;
        if(result && res.vehicule && result.vehicle.co2_g_km) {
          console.log(result.roads.roads.distance.value);
          console.log(result.vehicle.co2_g_km);
          result.eco = result.roads.roads.distance.value/1000 * result.vehicle.co2_g_km;
        }
        return result;
      });
    })
}

module.exports = fetchAll
