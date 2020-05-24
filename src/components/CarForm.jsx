import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Button, Autocomplete, Select, TextInput } from 'react-materialize'

class CarForm extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        post: undefined,
    }

    /*Permet de gérer le component*/
    componentDidMount() {
        this.fetchVehicles();
    }

    updateOptions(marques) {
      var description = <></>;

      marques.forEach((element) => {
        description += <strong>element</strong>
      });

      return (
        <div>
          {marques.map((message) => <div> message </div>)}
        </div>
      );
    }

    fetchVehicles = () => {
      fetch('https://public.opendatasoft.com/api/records/1.0/search/?&dataset=vehicules-commercialises&sort=puissance_maximale&facet=marque&facet=modele_utac&facet=carburant&facet=hybride&facet=puissance_administrative&facet=boite_de_vitesse&facet=annee&facet=carrosserie&facet=gamme')
      .then(response => response.json())
      .then((result) => {
          var toto = result.facet_groups.find(element => element.name == "marque").facets;

          var array1 = [];
          toto.forEach(element => array1.push(element.path));

          this.setState({ marques: array1});

          return array1;
      }).then((result)=>{
          this.setState({ post: this.updateOptions(result) });
      })
    }

    noRefCheck = (select) => {
        //this.setState({ car: select.target.options[select.target.value].text })
    }

    render() {
        return (
          <Select
            id="Select-9"
            multiple={false}
            onChange={this.noRefCheck}
            options={{
              classes: '',
              dropdownOptions: {
                alignment: 'left',
                autoTrigger: true,
                closeOnClick: true,
                constrainWidth: true,
                coverTrigger: true,
                hover: false,
                inDuration: 150,
                onCloseEnd: null,
                onCloseStart: null,
                onOpenEnd: null,
                onOpenStart: null,
                outDuration: 250
              }
            }}
            value=""
            >
            <option
              disabled
              value=""
            >
              Choose your option
            </option>
            {this.state.marques ? this.state.marques.map((message) => <option> {message} </option>) : <option>a</option>}
          </Select>
        )
    }
}

export default CarForm;
