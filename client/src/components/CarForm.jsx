import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Button, Autocomplete, Select, TextInput } from 'react-materialize'

class CarForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    sendDataToMainForm = () => {
      this.props.onSelectModele(this.state.modeleSelected);
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
          {marques.map((message, i) => <div key={i}> message </div>)}
        </div>
      );
    }

    fetchVehicles = () => {
      fetch('https://public.opendatasoft.com/api/records/1.0/search/?&dataset=vehicules-commercialises&sort=puissance_maximale&facet=marque&facet=modele_utac&facet=carburant&facet=hybride&facet=puissance_administrative&facet=boite_de_vitesse&facet=annee&facet=carrosserie&facet=gamme')
      .then(response => response.json())
      .then((result) => {
          const forbiddenMakes = ['ALFA-ROMEO', 'ROLLS-ROYCE']
          var marques = result.facet_groups.find(element => element.name == "marque").facets;

          var res = [];
          marques.forEach(element => res.push(element.path));
          res = res.filter((marque) => !forbiddenMakes.includes(marque))

          this.setState({ marques: res.sort()});
      })
    }

    fetchModele = (marque) => {
      var tata = marque;
      fetch(`https://public.opendatasoft.com/api/records/1.0/search/?&dataset=vehicules-commercialises&sort=puissance_maximale&facet=marque&facet=modele_utac&facet=carburant&facet=hybride&facet=puissance_administrative&facet=boite_de_vitesse&facet=annee&facet=carrosserie&facet=gamme&refine.marque=${tata}`)
      .then(response => response.json())
      .then((result) => {
          var modeles = result.facet_groups.find(element => element.name == "modele_utac").facets;

          var res = [];
          modeles.forEach(element => {
            var firstWord = element.path.split(" ")[0];
            if(!res.includes(firstWord))
              res.push(firstWord);
          });

          this.setState({ modeles: res.sort()});
      })
    }

    selectMarqueCheck = (select) => {
        this.setState({ marqueSelected: select.target.value})

        this.fetchModele(select.target.value);
    }

    selectModeleCheck = (select) => {
        this.setState({ modeleSelected: select.target.value}, ()=>{
          this.sendDataToMainForm();
        });
    }

    render() {
        return (
          <div>
            <Select
              id="Select-marque"
              multiple={false}
              l={6}
              onChange={this.selectMarqueCheck}
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
                Marque
              </option>
              {this.state.marques ? this.state.marques.map((message, i) => <option key={i}> {message} </option>) : <option>Chargement...</option>}
            </Select>

            <Select
              id="Select-modele"
              multiple={false}
              l={6}
              onChange={this.selectModeleCheck}
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
                Modèle
              </option>
              {this.state.modeles ? this.state.modeles.map((message, i) => <option key={i}> {message} </option>) : <option disabled>Veuillez choisir une marque</option>}
            </Select>
          </div>
        )
    }
}

export default CarForm;
