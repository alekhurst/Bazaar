import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native';
import {GoogleSigninButton} from 'react-native-google-signin';

import {white, ghost, primaryColor} from 'hammer/colors';

var UnauthenticatedRoot = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('images/logo300px.png')}
          resizeMode='contain'
          style={styles.logo}
        />
        <Text style={styles.title}>Bazaar</Text>
        <Text style={styles.subtitle}>The Trading App</Text>
        <GoogleSigninButton
          style={styles.signinButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={this.props.onPressLogin}
        />
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ghost,
  },

  logo: {
    width: 160,
    height: 160,
  },

  title: {
    color: primaryColor,
    fontSize: 54,
    fontWeight: '200',
  },

  subtitle: {
    color: primaryColor,
    fontSize: 17,
    fontWeight: '300',
  },

  signinButton: {
    width: 230,
    height: 48,
    marginTop: 80,
    backgroundColor: 'transparent'
  },
});

export default UnauthenticatedRoot;
