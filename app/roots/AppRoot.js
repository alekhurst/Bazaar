import React from 'react';
import {View, Text, StatusBar, Platform, Alert, NetInfo} from 'react-native';
import {connect} from 'react-redux';

import {login, currentUserAsync, signOut} from 'actions/authenticationActions'
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import AuthenticatedRoot from 'roots/AuthenticatedRoot';
import UnauthenticatedRoot from 'roots/UnauthenticatedRoot';
import StatusBarBackground from 'components/misc/StatusBarBackground';
import {primaryColor} from 'hammer/colors';
import renderIf from 'hammer/renderIf';

var AppRoot = React.createClass({
  // componentWillMount() {
  //   // this.props.dispatch(signOut());
  //   NetInfo.isConnected.addEventListener('change', checkNetworkConnection.bind(this));
  //
  //   function checkNetworkConnection(isConnected) {
  //     if (!isConnected) {
  //       this.setState({loggingIn: false});
  //       Alert.alert('No Internet :(', 'You aren\'t connected to the interwebs');
  //     } else {
  //       this.props.dispatch(currentUserAsync());
  //     }
  //   }
  // },
  //
  // onPressLogin() {
  //   this.props.dispatch(login())
  // },
  //
  // onLoginError() {
  //   Alert.alert('Oops :(', 'Your sign in request to our server failed, check yo internet connection. We\'ll check ours too');
  // },

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
    // if (this.props.userCredentials.loginError) {
    //   this.onLoginError();
    // }

    var content;
    // if (this.props.userCredentials.loggingIn) {
    //   content = <GenericLoadingScreen />
    // } else if (this.props.userCredentials.loggedIn) {
      content = <AuthenticatedRoot />
    // } else if (!this.props.userCredentials.loggedIn) {
    //   content = <UnauthenticatedRoot onPressLogin={this.onPressLogin} />
    // } else {
    //   console.log('If you\'re here, you have magic powers');
    // }

    return this.wrapContent(content);
  }
});

function mapStateToProps(state) {
  return {userCredentials: state.userCredentials}
}

AppRoot = connect(mapStateToProps)(AppRoot);
export default AppRoot;
