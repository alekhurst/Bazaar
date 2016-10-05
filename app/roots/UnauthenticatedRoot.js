import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  Linking,
  View,
  TouchableOpacity,
} from 'react-native';
import {GoogleSigninButton} from 'react-native-google-signin';

import {white, ghost, base, primaryColor} from 'hammer/colors';

var UnauthenticatedRoot = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('images/LogoAndName500px.png')}
          resizeMode='contain'
          style={styles.logo}
        />
        <GoogleSigninButton
          style={styles.signinButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={this.props.onPressLogin}
        />
        <TouchableOpacity onPress={() => Linking.openURL('http://bazaartheapp.com/termsofservice.html')}>
          <View style={styles.termsOfServiceContainer}>
            <Text style={styles.termsOfService}>By using this app you aknowledge and</Text>
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
    backgroundColor: white,
  },

  logo: {
    width: 240,
    height: 240,
    marginTop: -40,
  },

  title: {
    color: primaryColor,
    marginTop: 5,
    fontSize: 54,
    fontWeight: '200',
  },

  subtitle: {
    color: primaryColor,
    fontSize: 17,
    lineHeight: 17,
    fontWeight: '300',
  },

  signinButton: {
    width: 230,
    height: 48,
    marginTop: 70,
    backgroundColor: 'transparent'
  },

  termsOfServiceContainer: {
    marginTop: 10,
    width: 250,
  },

  termsOfService: {
    fontSize: 11,
    textAlign: 'center',
    color: base,
  }
});

export default UnauthenticatedRoot;
