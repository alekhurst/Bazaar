import React from 'react';
import {View, Modal} from 'react-native';
import {connect} from 'react-redux';
import Relay, {
  DefaultNetworkLayer,
  RootContainer,
} from 'react-relay';
import RelayNetworkDebug from 'react-relay/lib/RelayNetworkDebug';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import FeedScreen from 'screens/FeedScreen';
import MyPokemonScreen from 'screens/MyPokemonScreen';
import ChatScreen from 'screens/ChatScreen';
import ListingDetailsScreen from 'screens/ListingDetailsScreen';
import TabBar from 'components/misc/TabBar';
import LocationManager from 'components/misc/LocationManager';
import serverUrl from 'hammer/serverUrl';

const AuthenticatedRoot = React.createClass({
  getInitialState() {
    return { currentTabIndex: 0 }
  },

  componentWillMount() {
    var {bazaarAccessToken, userEmail} = this.props.userCredentials;
    // console.log('access token: ', bazaarAccessToken);
    // console.log('user email: ', userEmail);
    
    Relay.injectNetworkLayer(
      new Relay.DefaultNetworkLayer(`${serverUrl}/api/graph`, {
        headers: {
          'X-User-Token': 'DTKv_PbsVyaRol60nMEnDO2gJbhjgY80DPVQSmUYBJk', //bazaarAccessToken,
          'X-User-Email': '123alekhurst@gmail.com', //userEmail,
        },
      })
    );

    RelayNetworkDebug.init();
  },

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollableTabView
          renderTabBar={() => <TabBar activeTab={0} setAnimationValue={0}/>}
          tabBarPosition='bottom'
          initialPage={0}
          prerenderingSiblingsNumber={2}
          scrollWithoutAnimation
        >
          <FeedScreen />
          <MyPokemonScreen />
          <ChatScreen />
        </ScrollableTabView>
        <LocationManager />
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.props.listingDetailsScreen.visible}
          onRequestClose={() => noop()}
        >
          <ListingDetailsScreen
            listingId={this.props.listingDetailsScreen.listingId}
            listingPokemonName={this.props.listingDetailsScreen.pokemonName}
            onPressClose={this.props.listingDetailsScreen.closeListingDetailsScreen}
          />
        </Modal>
      </View>
    )
  },
});

function mapStateToProps(state) {
  return {
    userCredentials: state.userCredentials,
    listingDetailsScreen: state.listingDetailsScreen,
  }
}

AuthenticatedRoot = connect(mapStateToProps)(AuthenticatedRoot);
export default AuthenticatedRoot;
