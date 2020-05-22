import React, { Component } from 'react'
import Weather from './Weather'

class WeatherForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputValue: '',
            city: undefined,
        }
    }

    updateInputValue = (e) => {
        this.setState({ inputValue: e.target.value })
    }

    handleClick = (e) => {
        this.setState({ city: this.state.inputValue })
    }

    render() {
        return (
            <>
                <div className="input-field">
                    <input id="city" type="text" className="validate" value={this.state.value} onChange={this.updateInputValue} />
                    <label htmlFor="city">City</label>
                </div>
                <button className="btn waves-effect waves-light" onClick={this.handleClick}>
                    Submit
                </button>
                {this.state.city && <Weather city={this.state.city} />}
            </>
        )
    }
}

export default WeatherForm
