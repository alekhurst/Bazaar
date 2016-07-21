import React from 'react';
import Relay, {
  DefaultNetworkLayer,
  RootContainer,
} from 'react-relay';
// import RelayNetworkDebug from 'react-relay/lib/RelayNetworkDebug';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import userCredentialStore from 'stores/userCredentialStore';

import FeedScreen from 'screens/FeedScreen';
import MyPokemonScreen from 'screens/MyPokemonScreen';
import MeScreen from 'screens/MeScreen';
import TabBar from 'components/misc/TabBar';

const AuthenticatedRoot = React.createClass({
  getInitialState() {
    return {
      currentTabIndex: 0,
    }
  },

  componentWillMount() {
    Relay.injectNetworkLayer(
      new Relay.DefaultNetworkLayer('https://www.zeemee.com/api/graph.json', {
        headers: {
          // 'X-USER-TOKEN': userCredentialStore.bazaarAccessToken,
          // 'X-USER-ID': userCredentialStore.bazaarUserId,
          'X-ZeeMee-Application-Details': 'iOS',
          'X-User-Token': 'Nm8jrVvZcdoPDKMti121',
          'X-User-Email': 'alek@zeemee.com',
        },
      })
    );

    // RelayNetworkDebug.init();
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
        <MeScreen />
      </ScrollableTabView>
    )
  },
});

export default AuthenticatedRoot;
