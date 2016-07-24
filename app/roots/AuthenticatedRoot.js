import React from 'react';
import {View, Modal} from 'react-native';
import Relay, {
  DefaultNetworkLayer,
  RootContainer,
} from 'react-relay';
import RelayNetworkDebug from 'react-relay/lib/RelayNetworkDebug';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import userCredentialStore from 'stores/userCredentialStore';

import FeedScreen from 'screens/FeedScreen';
import MyPokemonScreen from 'screens/MyPokemonScreen';
import ChatScreen from 'screens/ChatScreen';
import ListingDetailsScreen from 'screens/ListingDetailsScreen';
import TabBar from 'components/misc/TabBar';
import serverUrl from 'hammer/serverUrl';

const AuthenticatedRoot = React.createClass({
  childContextTypes: {
    openListingDetailsScreen: React.PropTypes.func.isRequired,
    closeListingDetailsScreen: React.PropTypes.func.isRequired,
  },

  getChildContext() {
    return {
      openListingDetailsScreen: this.openListingDetailsScreen,
      closeListingDetailsScreen: this.closeListingDetailsScreen,
    }
  },

  getInitialState() {
    return {
      currentTabIndex: 0,
      showingListingDetailsScreen: false,
      listingId: null,
      listingPokemonName: null,
    }
  },

  openListingDetailsScreen(pokemonId, pokemonName) {
    this.setState({
      showingListingDetailsScreen: true,
      listingId: pokemonId,
      listingPokemonName: pokemonName,
    })
  },

  closeListingDetailsScreen() {
    this.setState({
      showingListingDetailsScreen: false,
      listingId: null,
      listingPokemonName: null,
    })
  },

  componentWillMount() {
    Relay.injectNetworkLayer(
      new Relay.DefaultNetworkLayer(`${serverUrl}/api/graph`, {
        headers: {
          'X-User-Token': 'DTKv_PbsVyaRol60nMEnDO2gJbhjgY80DPVQSmUYBJk',
          'X-User-Email': '123alekhurst@gmail.com',
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
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.showingListingDetailsScreen}
          onRequestClose={() => noop()}
        >
          <ListingDetailsScreen
            listingId={this.state.listingId}
            listingPokemonName={this.state.listingPokemonName}
            onPressClose={this.closeListingDetailsScreen}
            relay={this.props.relay}
          />
        </Modal>
      </View>
    )
  },
});

export default AuthenticatedRoot;
