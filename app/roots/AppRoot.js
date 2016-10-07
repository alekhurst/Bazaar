import React from 'react';
import {View, Text, StatusBar, Platform, Alert, NetInfo, AppState} from 'react-native';
import {connect} from 'react-redux';
import {GoogleSignin} from 'react-native-google-signin';

import {checkMinimumSupportedAppVersion} from 'actions/appVersionActions';
import {login, currentUserAsync, signOut} from 'actions/authenticationActions';

import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import AuthenticatedRoot from 'roots/AuthenticatedRoot';
import UnauthenticatedRoot from 'roots/UnauthenticatedRoot';
import StatusBarBackground from 'components/misc/StatusBarBackground';
import {primaryColor} from 'hammer/colors';
import renderIf from 'hammer/renderIf';
import noop from 'hammer/noop';

var AppRoot = React.createClass({
  componentWillMount() {
    // this.props.dispatch(signOut());

    NetInfo.isConnected.addEventListener('change', this.checkNetworkConnection);
    AppState.addEventListener('change', this.handleAppStateChange);
  },

  checkNetworkConnection(isConnected) {
    if (!isConnected) {
      this.setState({loggingIn: false});
      Alert.alert('No Internet :(', 'You aren\'t connected to the interwebs');
    } else {
      this.onConnectedToNetwork();
    }
  },

  onConnectedToNetwork() {
    this.props.dispatch(checkMinimumSupportedAppVersion());
    // begin google signin setup...
    GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
      // play services are available. can now configure library
      GoogleSignin.configure({
        iosClientId: '655586204672-d0u8gh3a1llp8slh0pcag5vd6j2pc67o.apps.googleusercontent.com',
        webClientId: '655586204672-itvtoo5sfdgud1nfteqnrcavi9irotf8.apps.googleusercontent.com'
      }).then(() => {
        // now we're ready to ask for current user
        this.props.dispatch(currentUserAsync());
      });
    })
    .catch((err) => {
      console.log("Play services error", err.code, err.message);
    })
  },

  handleAppStateChange(currentAppState) {
    if (currentAppState === 'active') {
      this.props.dispatch(checkMinimumSupportedAppVersion());
    }
  },

  onPressLogin() {
    this.props.dispatch(login())
  },

  onLoginError() {
    Alert.alert(
      'Oops :(',
      'Your sign in request to our server failed',
      [{text: 'OK', onPress: noop}]
    );
  },

  showUnsupportedAppVersionAlert() {
    Alert.alert(
      'Update Your App',
      'Your app version is no longer supported, please update from the app store',
      [{text: 'OK', onPress: noop}]
    );
  },

  wrapContent(content) {
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
        {renderIf(Platform.OS === 'ios')(<StatusBarBackground />)}
        {content}
      </View>
    )
  },

  render() {
    if (this.props.userCredentials.loginError) {
      this.onLoginError();
    }

    var content;
    if (!this.props.appVersion.checked) {
      content = <GenericLoadingScreen />
    } else if (this.props.appVersion.supported === false) {
      content = <GenericLoadingScreen />
      this.showUnsupportedAppVersionAlert();
    } else if (this.props.userCredentials.loggingIn) {
      content = <GenericLoadingScreen />
    } else if (this.props.userCredentials.loggedIn) {
      content = <AuthenticatedRoot />
    } else if (!this.props.userCredentials.loggedIn) {
      content = <UnauthenticatedRoot onPressLogin={this.onPressLogin} />
    } else {
      console.log('If you\'re here, you have magic powers');
    }

    return this.wrapContent(content);
  }
});

function mapStateToProps(state) {
  return {
    userCredentials: state.userCredentials,
    appVersion: state.appVersion,
  }
}

AppRoot = connect(mapStateToProps)(AppRoot);
export default AppRoot;
