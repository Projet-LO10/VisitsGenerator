import React from 'react'
import ReactDOM from 'react-dom'
import { Jumbotron } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'

const thankUser = () => alert('Thanks for using VisitsGenerator!')

const App = () => (
    <div className="App">
        <Jumbotron>
            <h1>Hello from VisitsGenerator</h1>
            <button className="CustomButton" onClick={thankUser}>
                Click me...
            </button>
        </Jumbotron>
    </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
