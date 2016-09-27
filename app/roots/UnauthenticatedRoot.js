import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  View
} from 'react-native';
import {GoogleSigninButton} from 'react-native-google-signin';

import {white, ghost, steel, primaryColor} from 'hammer/colors';

var UnauthenticatedRoot = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('images/Logo400px.png')}
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
        <TouchableOpacity onPress={() => Linking.openURL('http://bazaartheapp.com/termsofservice.html')}>
          <View style={styles.termsOfServiceContainer}>
            <Text style={styles.termsOfService}>Before using this app you must</Text>
            <Text style={styles.termsOfService}>agree to our <Text style={{textDecorationLine: 'underline'}}>Terms of Service</Text></Text>
          </View>
        </TouchableOpacity>
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

  termsOfServiceContainer: {
    marginVertical: 5,
    width: 250,
  },

  termsOfService: {
    fontSize: 11,
    textAlign: 'center',
    color: steel,
  }
});

export default UnauthenticatedRoot;
