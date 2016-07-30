import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {times} from 'lodash'

import {gainsboro} from 'hammer/colors';

var EnergyBar = React.createClass({
  render() {
    if(this.props.energy === 0) return null;

    return (
      <View style={[styles.container, this.props.style]}>
        {times(this.props.energy, c => <View style={styles.energyBarPartition} key={c} />)}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },

  energyBarPartition: {
    flex: 1,
    borderRadius: 3,
    marginRight: 2,
    backgroundColor: gainsboro
  },
})

export default EnergyBar;
