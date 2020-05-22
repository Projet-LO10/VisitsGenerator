import React from 'react'
import ReactDOM from 'react-dom'
import App from 'components/App.jsx'
import './index.css'

/*Juste pour voir la sortie*/
fetch('https://api.weatherbit.io/v2.0/forecast/daily?city=Autun&lang=fr&key=e4669577bb74436e9dd4bba4fd820014')
.then(response => response.json())
.then(json => console.log(json))

ReactDOM.render(<App />, document.getElementById('root'))
