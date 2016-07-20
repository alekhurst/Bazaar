import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';

import StatusBarBackground from 'components/misc/StatusBarBackground';
import {white, primaryColor} from 'hammer/colors';

var PokemonDetailsScreen = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <StatusBarBackground />
        <TouchableOpacity onPress={this.props.onPressClose} style={{paddingTop: 40}}><Text>back</Text></TouchableOpacity>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  }
});

export default PokemonDetailsScreen;
