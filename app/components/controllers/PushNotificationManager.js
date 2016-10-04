import React from 'react';
import {Platform, AppState} from 'react-native';
import {connect} from 'react-redux';
import FCM from 'react-native-fcm';

import FirebaseApp from 'hammer/FirebaseApp';

const ACTIVE = 'active';

class PushNotificationManager extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    AppState.addEventListener('change', (currentState) => {
      if (currentState === ACTIVE && Platform.OS === 'ios') {
        FCM.setBadgeNumber(0);
      }
    });
  }

  componentDidMount() {
    FCM.requestPermissions(); // for iOS
    FCM.getFCMToken().then(token => {
      console.log('Got FCM token: ', token)
      FirebaseApp.ref(`/userPushTokens/${this.props.userId}/${token}`).set(true)
    })

    this.refreshUnsubscribe = FCM.on('refreshToken', (token) => {
      console.log('Refreshed FCM token: ', token)
      FirebaseApp.ref(`/userPushTokens/${this.props.userId}/${token}`).set(true)
    });

    this.notificationUnsubscribe = FCM.on('notification', (notif) => {
      // not sure we need to do anything here
    });

    if (Platform.OS === 'ios') FCM.setBadgeNumber(0);
  }

  componentWillUnmount() {
    this.refreshUnsubscribe();
    this.notificationUnsubscribe();
  }

  render() {
    return null
  }
};

function mapStateToProps(state) {
  return {userId: state.userCredentials.userId}
}

PushNotificationManager = connect(mapStateToProps)(PushNotificationManager);

export default PushNotificationManager;
