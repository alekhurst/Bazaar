import React from 'react';
import {
  Image,
} from 'react-native';

var pokemonImages = {
  '1': require('images/pokemon/Bulbasaur.png'),
  '2': require('images/pokemon/Ivysaur.png'),
  '3': require('images/pokemon/Venusaur.png'),
  '4': require('images/pokemon/Charmander.png'),
};

var PokemonImage = React.createClass({
  render() {
    return (
      <Image style={this.props.style} source={pokemonImages[this.props.pokedexNumber]} resizeMode={this.props.resizeMode}/>
    );
  }
});

export default PokemonImage;
