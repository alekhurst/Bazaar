import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {isEmpty} from 'lodash';

import {openEditListingScreen} from 'actions/editListingScreenActions';
import {white, matterhorn, primaryColor, primaryBlue} from 'hammer/colors';

var ZeroResultsPlaceholder = ({dispatch, onManualRefresh, searchText, gameFilter}) => {
  console.log("game filter: ", gameFilter)
  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        {'There are no listings '}
        {!isEmpty(searchText) ? `matching the query "${searchText}" ` : ' '}
        {'in your area '}
        {!isEmpty(gameFilter) ? `for ${gameFilter} 🙁... Try clearing the game filter` : '🙁'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => dispatch(openEditListingScreen())}>
        <Text style={styles.buttonText}>Be the first!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.reloadButton]} onPress={onManualRefresh}>
        <Text style={{color: primaryBlue}}>Reload feed</Text>
      </TouchableOpacity>
    </View>
  )
}

ZeroResultsPlaceholder = connect()(ZeroResultsPlaceholder)

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoText: {
    width: 160,
    color: matterhorn,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: -70,
  },

  reloadText: {
    width: 160,
    color: matterhorn,
    textAlign: 'center',
    marginBottom: 15
  },

  button: {
    backgroundColor: primaryBlue,
    borderRadius: 5,
    paddingVertical: 10,
    width: 160,
    alignItems: 'center',
  },

  reloadButton: {
    borderColor: primaryBlue,
    borderWidth: 1,
    backgroundColor: white,
    marginTop: 10,
  },

  buttonText: {
    color: white,
  }
})

export default ZeroResultsPlaceholder
