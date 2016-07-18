import React from 'react';
import {View, Text, StatusBar, Platform, Alert, NetInfo} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {isEmpty} from 'lodash';

import SplashScreen from 'screens/SplashScreen';
import FeedScreen from 'screens/FeedScreen';
import MyPokemonScreen from 'screens/MyPokemonScreen';
import MeScreen from 'screens/MeScreen';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';

import TabBar from 'components/misc/TabBar';

import {primaryColor} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';
import renderIf from 'hammer/renderIf';

import userCredentialStore from 'stores/userCredentialStore';

var Bazaar = React.createClass({
  // getInitialState() {
  //   return {
  //     loggingIn: true,
  //     authenticated: false,
  //   }
  // },
  //
  // componentDidMount() {
  //   NetInfo.isConnected.addEventListener('change', checkNetworkConnection.bind(this));
  //
  //   function checkNetworkConnection(isConnected) {
  //     if (!isConnected) {
  //       this.setState({loggingIn: false});
  //       Alert.alert('No Internet :(', 'You aren\'t connected to the interwebs');
  //     } else {
  //       checkUserAuth.apply(this);
  //     }
  //   }
  //
  //   function checkUserAuth() {
  //     userCredentialStore.currentUserAsync((err, data) => {
  //       if (err) { // network error, inform them
  //         this.setState({loggingIn: false});
  //         this.onSigninError();
  //       } else if (!data.user) { // no network error, but we're not logged in
  //         this.setState({loggingIn: false});
  //       } else if (data.user) { // we are logged in
  //         this.setState({loggingIn: false, authenticated: true});
  //       } else {
  //         console.log('If you made it here you broke something');
  //       }
  //     })
  //   }
  // },
  //
  // onPressSignIn() {
  //   this.setState({loggingIn: true});
  //   userCredentialStore.signIn((err, data) => {
  //     if (err) {
  //       this.setState({loggingIn: false});
  //       this.onSigninError();
  //     } else {
  //       this.setState({authenticated: true, loggingIn: false});
  //     }
  //   })
  // },
  //
  // onSigninError() {
  //   Alert.alert('Oops :(', 'Your sign in request to our server failed, check yo internet connection. We\'ll check ours too');
  // },

  wrapContentWithStatusBar(content) {
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
        {renderIf(Platform.OS === 'ios')(
          <View style={{height: 20, width: vw(100), backgroundColor: primaryColor}} />
        )}
        {content}
      </View>
    )
  },

  render() {
    // userCredentialStore.signOut();
    var content;
    // if (this.state.loggingIn) {
    //   content = <GenericLoadingScreen />
    // } else if (this.state.authenticated) {
      content = (
        <ScrollableTabView
          renderTabBar={() => <TabBar activeTab={0} setAnimationValue={0}/>}
          tabBarPosition='bottom'
          initialPage={0}
          prerenderingSiblingsNumber={2}
          scrollWithoutAnimation
        >
          <FeedScreen />
          <MyPokemonScreen />
          <MeScreen />
        </ScrollableTabView>
      )
    // } else if (!this.state.authenticated) {
    //   content = <SplashScreen onPressSignIn={this.onPressSignIn} />
    // } else {
    //   console.log('If you\'re here, you have magic powers');
    // }

    return this.wrapContentWithStatusBar(content);
  }
});

export default Bazaar;
