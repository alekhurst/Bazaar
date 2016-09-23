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
        <View style={styles.content}>
          <Image source={require('images/logo300px.png')} style={styles.logo} resizeMode={'contain'} />
          <Spinner style={styles.spinner} isVisible size={37} type='Bounce' color='#ffc296'/>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  content: {
    position: 'absolute',
    top: vh(30),
    left: vw(50) - 70,
    alignItems: 'center',
    height: 140,
    width: 140,
  },

  logo: {
    width: 138,
    height: 138,
  },

  spinner: {
    position: 'relative',
    top: -88,
    left: -0.5,
  }
})

export default GenericLoadingScreen;
