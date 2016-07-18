import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {times} from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons';

import {gainsboro} from 'hammer/colors';
import renderIf from 'hammer/renderIf';

var DistanceIndicator = React.createClass({
  render() {
    var pawPrintCount = null;
    var maxDistance = false;

    if (this.props.distance > 3) {
      pawPrintCount = 3;
      maxDistance = true;
    } else {
      pawPrintCount = this.props.distance;
    }

    return (
      <View style={[styles.container, this.props.style]}>
        {times(
          pawPrintCount,
          x => <Icon name='md-paw' style={styles.pawPrint} size={12} color={gainsboro} key={x} />
        )}
        {renderIf(maxDistance)(
          <Icon name='md-add' style={styles.pawPrint} size={12} color={gainsboro} />
        )}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'flex-end',
  },

  pawPrint: {
    margin: 0,
    marginLeft: 2,
  },
})

export default DistanceIndicator;
