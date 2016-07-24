import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Image,
  View
} from 'react-native';
import {primaryColor} from 'hammer/colors';
import {vw, vh} from 'hammer/viewPercentages';

var GenericLoadingScreen = React.createClass({
  render() {
    return (
      <View style={[styles.container, this.props.style]} >
        <View style={styles.content}>
          <Image source={require('images/logo-white-background-no-center.png')} style={styles.logo} resizeMode={'contain'} />
          <Image source={require('images/ripple.gif')} style={styles.spinner} resizeMode={'contain'} />
        </View>
        {/*<ActivityIndicator color={primaryColor} size='small' style={styles.spinner}/>*/}
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
    width: 140,
    height: 140,
  },

  spinner: {
    position: 'relative',
    top: -90,
    left: -1,
    margin: 0,
    padding: 0,
    width: 43,
    height: 43
  }
})

export default GenericLoadingScreen;
