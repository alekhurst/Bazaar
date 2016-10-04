import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  View,
  Modal,
} from 'react-native';
import {GoogleSigninButton} from 'react-native-google-signin';

import {white, ghost, whiteSmoke, iron, base, steel, primaryColor, primaryYellow} from 'hammer/colors';
import BazaarSignupScreen from 'components/misc/BazaarSignupScreen';
import BazaarLoginScreen from 'components/misc/BazaarLoginScreen';

var UnauthenticatedRoot = React.createClass({
  getInitialState() {
    return {
      bazaarSignupScreenVisible: false,
      bazaarLoginScreenVisible: false,
    }
  },

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
          color={GoogleSigninButton.Color.Dark}
          onPress={this.props.onPressLogin}
        />
        <View style={styles.signinMethodSplitterContainer}>
          <View style={styles.signinMethodSplitterLine} />
          <Text style={styles.signinMethodSplitterText}>or</Text>
          <View style={styles.signinMethodSplitterLine} />
        </View>
        <View style={styles.bazaarSigninButtonsContainer}>
          <TouchableOpacity
            style={[styles.bazaarSigninButton, {marginRight: 5}]}
            onPress={() => this.setState({bazaarSignupScreenVisible: true})}
          >
            <Text style={styles.bazaarSigninButtonText}>sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bazaarSigninButton, {marginLeft: 5}]}
            onPress={() => this.setState({bazaarLoginScreenVisible: true})}
          >
            <Text style={styles.bazaarSigninButtonText}>log in</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => Linking.openURL('http://bazaartheapp.com/termsofservice.html')}>
          <View style={styles.termsOfServiceContainer}>
            <Text style={styles.termsOfService}>By using this app you aknowledge and</Text>
            <Text style={styles.termsOfService}>agree to our <Text style={{textDecorationLine: 'underline'}}>Terms of Service</Text></Text>
          </View>
        </TouchableOpacity>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.bazaarSignupScreenVisible}
          onRequestClose={() => noop()}
        >
          <BazaarSignupScreen onPressClose={() => this.setState({bazaarSignupScreenVisible: false})}/>
        </Modal>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.bazaarLoginScreenVisible}
          onRequestClose={() => noop()}
        >
          <BazaarLoginScreen onPressClose={() => this.setState({bazaarLoginScreenVisible: false})}/>
        </Modal>
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
    width: 220,
    height: 220,
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
    marginTop: 50,
    backgroundColor: 'transparent'
  },

  signinMethodSplitterContainer: {
    width: 165,
    flexDirection: 'row',
    paddingTop: 5,
    marginVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: white,
  },

  signinMethodSplitterLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 5,
    backgroundColor: iron,
  },

  signinMethodSplitterText: {
    fontSize: 12,
    color: base,
    fontWeight: '300',
    marginHorizontal: 5,
  },

  bazaarSigninButtonsContainer: {
    flexDirection: 'row',
    height: 35,
    width: 225,
    marginTop: 5,
  },

  bazaarSigninButton: {
    backgroundColor: base,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bazaarSigninButtonText: {
    color: white,
  },

  termsOfServiceContainer: {
    marginTop: 15,
    width: 250,
  },

  termsOfService: {
    fontSize: 11,
    textAlign: 'center',
    color: base,
  }
});

export default UnauthenticatedRoot;
