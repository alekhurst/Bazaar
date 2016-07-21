import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native';
import {GoogleSigninButton} from 'react-native-google-signin';

import userCredentialStore from 'stores/userCredentialStore'
import {white, primaryColor} from 'hammer/colors';

var UnauthenticatedRoot = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('images/logo.png')}
          resizeMode='contain'
          style={styles.logo}
        />
        <Text style={styles.title}>Bazaar</Text>
        <Text style={styles.subtitle}>The Pokemon Go Trading App</Text>
        <GoogleSigninButton
          style={styles.signinButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={this.props.onPressSignIn}
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
    backgroundColor: primaryColor,
  },

  logo: {
    width: 180,
    height: 180,
  },

  title: {
    color: white,
    fontSize: 54,
    fontWeight: '200',
  },

  subtitle: {
    color: white,
    fontSize: 16,
    fontWeight: '400',
  },

  signinButton: {
    width: 230,
    height: 48,
    marginTop: 100,
    backgroundColor: 'transparent'
  },
});

export default UnauthenticatedRoot;
