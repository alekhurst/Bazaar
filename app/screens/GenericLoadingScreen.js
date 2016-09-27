import React from 'react';
import {
  StyleSheet,
  Image,
  View
} from 'react-native';
import {white, primaryColor} from 'hammer/colors';
import {vw, vh} from 'hammer/viewPercentages';

import Spinner from 'react-native-spinkit';

var GenericLoadingScreen = React.createClass({
  render() {
    return (
      <View style={[styles.container, this.props.style]} >
        <Spinner style={styles.spinner} isVisible size={45} type='Wave' color={primaryColor}/>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  spinner: {
    position: 'relative',
    top: -40,
  }
})

export default GenericLoadingScreen;
