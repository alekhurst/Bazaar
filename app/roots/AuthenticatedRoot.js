import React from 'react';
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
import TabBar from 'components/misc/TabBar';
import serverUrl from 'hammer/serverUrl';

const AuthenticatedRoot = React.createClass({
  getInitialState() {
    return {
      currentTabIndex: 0,
    }
  },

  componentWillMount() {
    Relay.injectNetworkLayer(
      new Relay.DefaultNetworkLayer(`${serverUrl}/api/v1/graph`, {
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
    )
  },
});

export default AuthenticatedRoot;
