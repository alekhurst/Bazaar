import React from 'react';
import {View, Modal} from 'react-native';
import {connect} from 'react-redux';
import Relay, {
  DefaultNetworkLayer,
  RootContainer,
} from 'react-relay';
import RelayNetworkDebug from 'react-relay/lib/RelayNetworkDebug';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Firebase from 'firebase';
import {get, isNumber} from 'lodash';

import FeedTab from 'screens/FeedTab';
import MeTab from 'screens/MeTab';
import ChatTab from 'screens/ChatTab';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import ListingDetailsScreen from 'screens/ListingDetailsScreen';
import EditListingScreen from 'screens/EditListingScreen';
import ChatScreen from 'screens/ChatScreen';
import TabBar from 'components/misc/TabBar';
import LocationManager from 'components/controllers/LocationManager';
import AdManager from 'components/controllers/AdManager';
import serverUrl from 'hammer/serverUrl';

const AuthenticatedRoot = React.createClass({
  getInitialState() {
    return { currentTabIndex: 0 }
  },

  componentWillMount() {
    var {bazaarAccessToken, userEmail} = this.props.userCredentials;
    // console.log('access token: ', bazaarAccessToken);
    // console.log('user email: ', userEmail);

    Firebase.initializeApp({
      apiKey: "AIzaSyC907RJrC4ylrAZRNbayrmRnyjTN3C69eM",
      authDomain: "bazaar-ff292.firebaseapp.com",
      databaseURL: "https://bazaar-ff292.firebaseio.com",
      storageBucket: "bazaar-ff292.appspot.com",
    })

    Relay.injectNetworkLayer(
      new Relay.DefaultNetworkLayer(`${serverUrl}/api/graph`, {
        headers: {
          'X-User-Token': bazaarAccessToken,
          'X-User-Email': userEmail,
        },
        fetchTimeout: 20000,
        retryDelays: [5000],
      })
    );

    RelayNetworkDebug.init();
  },

  render() {
    var latitude = get(this.props, 'location.latitude', null);
    var longitude = get(this.props, 'location.longitude', null);
    var locationIsEmpty = !isNumber(latitude) || !isNumber(longitude);

    console.log('location is empty, rendering loading screen')
    if (locationIsEmpty) {
      return (
        <View style={{flex: 1}}>
          <GenericLoadingScreen />
          <LocationManager />
        </View>
      )
    }

    console.log('location exists, rendering app')
    return (
      <View style={{flex: 1}}>
        <LocationManager />
        <AdManager />
        <ScrollableTabView
          renderTabBar={() => <TabBar activeTab={0} setAnimationValue={0}/>}
          tabBarPosition='bottom'
          initialPage={0}
          prerenderingSiblingsNumber={2}
          scrollWithoutAnimation
        >
          <FeedTab />
          <MeTab />
          <ChatTab />
        </ScrollableTabView>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.props.listingDetailsScreen.visible}
          onRequestClose={() => noop()}
        >
          <ListingDetailsScreen />
        </Modal>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.props.editListingScreen.visible}
          onRequestClose={() => noop()}
        >
          <EditListingScreen />
        </Modal>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.props.chatScreen.visible}
          onRequestClose={() => noop()}
        >
          <ChatScreen />
        </Modal>
      </View>
    )
  },
});

function mapStateToProps(state) {
  return {
    userCredentials: state.userCredentials,
    location: state.location,
    listingDetailsScreen: state.listingDetailsScreen,
    editListingScreen: state.editListingScreen,
    chatScreen: state.chatScreen,
  }
}

AuthenticatedRoot = connect(mapStateToProps)(AuthenticatedRoot);
export default AuthenticatedRoot;
