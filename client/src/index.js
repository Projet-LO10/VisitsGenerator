import React from 'react'
import ReactDOM from 'react-dom'
import App from 'components/App.jsx'
import './index.css'
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'
import 'animate.css/animate.min.css'

/*Juste pour voir la sortie*/
//fetch('https://api.weatherbit.io/v2.0/forecast/daily?city=Autun&lang=fr&key=e4669577bb74436e9dd4bba4fd820014')
//.then(response => response.json())
//.then(json => console.log(json))

// fetch('/api/test?ville=Montbard&date=07-Jun-2020').then(x => x.json()).then(console.log)

ReactDOM.render(<App />, document.getElementById('root'))
