import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux'

import {openEditListingScreen} from 'actions/editListingScreenActions';
import {white, matterhorn, primaryBlue} from 'hammer/colors';

var ZeroResultsPlaceholder = ({dispatch, onRefresh}) => (
  <View style={styles.container}>
    <Text style={styles.infoText}>There are no pokemon for trade in your area :(</Text>
    <TouchableOpacity onPress={() => onRefresh()}>
      <Text style={styles.reloadText}>Reload feed</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.createButton} onPress={() => dispatch(openEditListingScreen())}>
      <Text style={styles.createButtonText}>Be the first!</Text>
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
    marginBottom: 30,
    marginTop: -70,
  },

  reloadText: {
    width: 160,
    color: matterhorn,
    textAlign: 'center',
    marginBottom: 15
  },

  createButton: {
    backgroundColor: primaryBlue,
    borderRadius: 5,
    paddingVertical: 10,
    width: 160,
    alignItems: 'center',
  },

  createButtonText: {
    color: white,
  }
})

export default ZeroResultsPlaceholder
