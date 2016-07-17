import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native';

import {white, primaryColor} from 'hammer/colors';

var MyPokemonScreen = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <Text>Feed Screen</Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue'
  }
});

export default MyPokemonScreen;
