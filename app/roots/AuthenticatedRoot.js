import React from 'react';
import { Text, View, Modal } from 'react-native';
import {connect} from 'react-redux';
import Relay, {
  DefaultNetworkLayer,
  RootContainer,
} from 'react-relay';
import RelayNetworkDebug from 'react-relay/lib/RelayNetworkDebug';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {Crashlytics} from 'react-native-fabric';
import FCM from 'react-native-fcm';

import {closeEditListingScreen} from 'actions/editListingScreenActions';
import {closeListingDetailsScreen} from 'actions/listingDetailsScreenActions';
import {closeChatScreen} from 'actions/chat/chatScreenActions';

import FeedTab from 'screens/FeedTab';
import MeTab from 'screens/MeTab';
import ChatTab from 'screens/ChatTab';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import ListingDetailsScreen from 'screens/ListingDetailsScreen';
import EditListingScreen from 'screens/EditListingScreen';
import StartChatScreen from 'screens/StartChatScreen';
import ChatScreen from 'screens/ChatScreen';
import TabBar from 'components/misc/TabBar';
import PushNotificationManager from 'components/controllers/PushNotificationManager';
import LocationManager from 'components/controllers/LocationManager';
import AdManager from 'components/controllers/AdManager';
import {serverUrl} from 'hammer/environment';

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
          'X-User-Token': bazaarAccessToken,
          'X-User-Email': userEmail,
        },
        fetchTimeout: 20000,
        retryDelays: [5000],
      })
    );

    RelayNetworkDebug.init();
  },

  componentDidMount() {
    Crashlytics.setUserEmail(this.props.userCredentials.userEmail);
    Crashlytics.setUserIdentifier(this.props.userCredentials.userId);
  },

  render() {
    return (
      <View style={{flex: 1}}>
        <LocationManager />
        <AdManager />
        <PushNotificationManager />
        <ScrollableTabView
          renderTabBar={() => <TabBar activeTab={0} setAnimationValue={0}/>}
          tabBarPosition='bottom'
          initialPage={0}
          prerenderingSiblingsNumber={2}
          scrollWithoutAnimation
        >
          {/*APPSTORE:<FeedTab />
          <MeTab />*/}
          <ChatTab />
        </ScrollableTabView>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.props.listingDetailsScreen.visible}
          onRequestClose={() => this.props.dispatch(closeListingDetailsScreen())}
        >
          <ListingDetailsScreen />
        </Modal>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.props.editListingScreen.visible}
          onRequestClose={() => this.props.dispatch(closeEditListingScreen())}
        >
          <EditListingScreen />
        </Modal>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.props.chatScreen.visible}
          onRequestClose={() => this.props.dispatch(closeChatScreen())}
        >
          <ChatScreen />
        </Modal>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.props.startChatScreen.visible}
          onRequestClose={() => this.props.dispatch(closeStartChatScreen())}
        >
          <StartChatScreen />
        </Modal>
      </View>
    )
  },
});

function mapStateToProps(state) {
  return {
    userCredentials: state.userCredentials,
    listingDetailsScreen: state.listingDetailsScreen,
    editListingScreen: state.editListingScreen,
    chatScreen: state.chatScreen,
    startChatScreen: state.startChatScreen,
  }
}

AuthenticatedRoot = connect(mapStateToProps)(AuthenticatedRoot);
export default AuthenticatedRoot;
