import React from 'react';
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import FCM from 'react-native-fcm';

import FirebaseApp from 'hammer/FirebaseApp';

class PushNotificationManager extends React.Component {
  constructor(props) {
    super(props)
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
      // FCM.setBadgeNumber(10); doesn't work
      // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
    });
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
