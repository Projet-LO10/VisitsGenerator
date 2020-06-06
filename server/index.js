const { program } = require('commander'),
    fetch = require('node-fetch'),
    path = require('path'),
    startServer = require('./server')

// Fonction qui démarre le serveur lorsque le fetch est terminé et que les données sont prêtes
const run = async (port, dist) => {
    const cities = await fetch('https://geo.api.gouv.fr/communes?fields=nom,centre,codesPostaux&format=json&geometry=centre').then((x) => x.json())
    startServer(port, dist, cities)
}

// Indique qu'un paramètre -p ou --port peut être ajouté pour signifier le port du serveur
program.option('-p, --port <port>', 'Port du serveur')
program.option('-s, --static <static>', 'Dossier contenant des fichiers statiques (doit être absolu)')
program.parse(process.argv)

const port = program.port || 8080
const dist = program.static || path.join(__dirname, '..', 'client', 'dist')

run(port, dist)
