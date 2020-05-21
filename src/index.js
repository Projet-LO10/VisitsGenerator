import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const thankUser = () => alert('Thanks for using VisitsGenerator!')

const App = () => (
    <div className="App">
        <h1>Hello from VisitsGenerator</h1>
        <button className="CustomButton" onClick={thankUser}>
            Click me...
        </button>
    </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
