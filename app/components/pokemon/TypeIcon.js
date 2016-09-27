import React from 'react';
import {
  Image,
} from 'react-native';

import {pokemonDictionary} from 'datasets/pokemon';

var TypeIcon = React.createClass({
  render() {
    let typeIcons = {
      bug: require('images/type_icons/Bug.png'),
      water: require('images/type_icons/Water.png'),
      fire: require('images/type_icons/Fire.png'),
      electric: require('images/type_icons/Electric.png'),
      normal: require('images/type_icons/Normal.png'),
      grass: require('images/type_icons/Grass.png'),
      rock: require('images/type_icons/Rock.png'),
      ice: require('images/type_icons/Ice.png'),
      poison: require('images/type_icons/Poison.png'),
      psychic: require('images/type_icons/Psychic.png'),
      ghost: require('images/type_icons/Ghost.png'),
      fighting: require('images/type_icons/Fighting.png'),
      ground: require('images/type_icons/Ground.png'),
      dragon: require('images/type_icons/Dragon.png'),
      flying: require('images/type_icons/Flying.png'),
    }

    return (
      <Image
        style={this.props.style}
        source={typeIcons[this.props.elementType.toLowerCase()]}
        resizeMode={this.props.resizeMode}
      />
    );
  }
});

export default TypeIcon;
