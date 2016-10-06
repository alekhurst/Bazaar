import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

import {openEditListingScreen} from 'actions/editListingScreenActions';

import {vh} from 'hammer/viewPercentages';
import {white, matterhorn, primaryBlue} from 'hammer/colors';


var ZeroMyListingsPlaceholder = ({dispatch}) => (
  <View style={styles.container}>
    <Text style={styles.reloadText}>You haven't created any trade listings yet.</Text>
    <TouchableOpacity style={styles.createButton} onPress={() => dispatch(openEditListingScreen())}>
      <Text style={styles.createButtonText}>Create Listing</Text>
    </TouchableOpacity>
  </View>
)

ZeroMyListingsPlaceholder = connect()(ZeroMyListingsPlaceholder);

var styles = StyleSheet.create({
  container : {
    alignItems: 'center'
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
  },

  reloadText: {
    width: 240,
    marginTop: vh(20),
    color: matterhorn,
    textAlign: 'center',
    marginBottom: 20
  }
})

export default ZeroMyListingsPlaceholder;
