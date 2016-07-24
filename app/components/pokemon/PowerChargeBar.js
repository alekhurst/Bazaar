import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {times} from 'lodash'

import {gainsboro} from 'hammer/colors';

var PowerChargeBar = React.createClass({
  render() {
    if(this.props.charges === 0) return null;

    return (
      <View style={[styles.container, this.props.style]}>
        {times(this.props.charges, c => <View style={styles.chargeBarPartition} key={c} />)}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },

  chargeBarPartition: {
    flex: 1,
    borderRadius: 3,
    marginRight: 2,
    backgroundColor: gainsboro
  },
})

export default PowerChargeBar;
