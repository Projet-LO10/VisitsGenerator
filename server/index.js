const { program } = require('commander')
const fetch = require('node-fetch')
const startServer = require('./server')

// Fonction qui démarre le serveur lorsque le fetch est terminé et que les données sont prêtes
const run = async (port) => {
    const cities = await fetch('https://geo.api.gouv.fr/communes?fields=nom,centre,codesPostaux&format=json&geometry=centre').then((x) => x.json())
    startServer(port, cities)
}

// Indique qu'un paramètre -p ou --port peut être ajouté pour signifier le port du serveur
program.option('-p, --port <port>', 'Port du serveur')
program.parse(process.argv)

run(program.port || 8080)