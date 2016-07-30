import React from 'react';
import {
  Image,
} from 'react-native';

import {pokemonDictionary} from 'datasets/pokemon';

var PokemonImage = React.createClass({
  render() {
    return (
      <Image style={this.props.style} source={pokemonDictionary[this.props.pokedexNumber].imageUrl} resizeMode={this.props.resizeMode}/>
    );
  }
});

export default PokemonImage;
