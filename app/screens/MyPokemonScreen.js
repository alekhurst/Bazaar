import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import PokemonDetailsScreen from 'screens/PokemonDetailsScreen';
import ListingList from 'components/listing/ListingList';
import {white, primaryColor} from 'hammer/colors';
import noop from 'hammer/noop';

var MyPokemonScreen = React.createClass({
  getInitialState() {
    return {showingPokemonDetails: false}
  },

  onPressListing(uuid, name) {
    this.setState({showingPokemonDetails: true})
  },

  onPressDelete(pokemonName) {
    Alert.alert(
      `Delete`,
      'Are you sure you want to delete this pokemon?',
      [
        {text: 'Yes', onPress: () => console.log('Ask me later pressed')},
        {text: 'No', onPress: () => noop()}
      ]
    );
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topBarContainer}>
          <Text style={styles.myPokemonTitle}>My Pokemon</Text>
          <TouchableOpacity style={styles.addIcon}>
            <Icon name='md-add' size={26} color={white} />
          </TouchableOpacity>
        </View>
        <ListingList editMode onPressDelete={this.onPressDelete} onPressListing={this.onPressListing} />
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.showingPokemonDetails}
          onRequestClose={() => noop()}
        >
          <PokemonDetailsScreen onPressClose={() => this.setState({showingPokemonDetails: false})} />
        </Modal>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topBarContainer: {
    height: 43,
    backgroundColor: primaryColor,
    justifyContent: 'center',
  },

  myPokemonTitle: {
    textAlign: 'center',
    color: white,
    fontSize: 20,
  },

  addIcon: {
    position: 'absolute',
    right: 10,
    top: 8,
  }
});

export default MyPokemonScreen;
