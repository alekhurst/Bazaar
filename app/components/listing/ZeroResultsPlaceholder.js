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

var ZeroResultsPlaceholder = ({dispatch, onManualRefresh, searchText}) => (
  <View style={styles.container}>
    <Text style={styles.infoText}>
      This could be an error! Try this:
    </Text>
    <TouchableOpacity style={styles.button} onPress={onManualRefresh}>
      <Text style={styles.buttonText}>Reload feed</Text>
    </TouchableOpacity>
    <Text style={[styles.infoText, {marginTop: 30}]}>
      If not, there are no pokemon {!isEmpty(searchText) ? `matching the query "${searchText}" ` : ''}for trade in your area :(
    </Text>
    <TouchableOpacity style={[styles.button, styles.beTheFirstButton]} onPress={() => dispatch(openEditListingScreen())}>
      <Text style={{color: primaryBlue}}>Be the first!</Text>
    </TouchableOpacity>
  </View>
)

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

  beTheFirstButton: {
    borderColor: primaryBlue,
    borderWidth: 1,
    backgroundColor: white,
  },

  buttonText: {
    color: white,
  }
})

export default ZeroResultsPlaceholder
