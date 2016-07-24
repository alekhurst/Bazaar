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
import Relay from 'react-relay'
import Icon from 'react-native-vector-icons/Ionicons';

import MeRoute from 'routes/MeRoute';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import GenericErrorScreen from 'screens/GenericErrorScreen';
import ListingDetailsScreen from 'screens/ListingDetailsScreen';
import ListingList from 'components/listing/ListingList';
import {white, primaryColor} from 'hammer/colors';
import noop from 'hammer/noop';

var MyPokemonScreen = React.createClass({
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
        <ListingList
          editMode
          onPressDelete={this.onPressDelete}
          onPressListing={this.onPressListing}
          listings={this.props.me.listings.edges.map(e => e.node)}
        />
      </View>
    );
  }
});

MyPokemonScreen = Relay.createContainer(MyPokemonScreen, {
  fragments: {
    me() {
      return Relay.QL`
        fragment on User {
          id,
          listings(first: 10) {
            edges {
              node {
                ${ListingList.getFragment('listings')}
              }
            }
          }
        }
      `;
    },
  },
});


var MyPokemonScreenWrapper = React.createClass({
  render() {
    return (
      <Relay.Renderer
        Container={MyPokemonScreen}
        environment={Relay.Store}
        queryConfig={new MeRoute()}
        render={({done, error, props}) => {
          if (error) {
            return <GenericErrorScreen />
          } else if (props) {
            return <MyPokemonScreen {...props} />
          } else {
            return <GenericLoadingScreen />
          }
        }}
      />
    );
  },
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

export default MyPokemonScreenWrapper;
