import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import {white, ghost, matterhorn, primaryBlue} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';

var LocationUpdatedBanner = ({onPress}) => (
  <View style={styles.container}>
    <Text style={styles.plainText}>Your location was updated!</Text>
    <TouchableOpacity style={styles.refreshButton} onPress={onPress}>
      <Text style={styles.refreshButtonText}>Refresh Feed</Text>
    </TouchableOpacity>
  </View>
)

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    position: 'absolute',
    bottom: 10,
    left: 10,
    borderRadius: 5,
    width: vw(100) - 20,
    backgroundColor: ghost,
  },

  plainText: {
    color: matterhorn,
    marginLeft: 10,
  },

  refreshButton: {
    backgroundColor: primaryBlue,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 5,
  },

  refreshButtonText: {
    color: white,
  }
})

export default LocationUpdatedBanner
