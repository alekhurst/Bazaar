import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import {white, ghost, matterhorn, primaryBlue} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';

var LocationUpdatedBanner = ({onPressRefresh}) => (
  <View style={styles.container}>
    <Text style={styles.plainText}>Your location was updated!</Text>
    <TouchableOpacity style={styles.refreshButton} onPress={onPressRefresh}>
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
    top: 43,
    left: 0,
    width: vw(100),
    backgroundColor: 'rgba(250, 250, 250, 0.80)',
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
