import {GoogleSignin} from 'react-native-google-signin';
import axios from 'axios';
import {assign} from 'lodash';

import serverUrl from 'hammer/serverUrl';
import noop from 'hammer/noop';

GoogleSignin.configure({
  iosClientId: '655586204672-d0u8gh3a1llp8slh0pcag5vd6j2pc67o.apps.googleusercontent.com',
});

var userCredentialStore = {
  currentUserAsync(callback) {
    GoogleSignin.currentUserAsync().then(user => {
      if (user) {
        this.authenticateAgainstBazaarApi(user, callback);
      } else {
        callback(false, {user: null}); // user not signed in, send null user back
      }
    })
    .catch((err) => console.log('Error signing in: ', r))
    .done();
  },

  signOut() {
    GoogleSignin.signOut()
    .then(() => {
      noop(); // signed out successfully
    })
    .catch((err) => {
      console.log('Error signing out of Google: ', err)
    });
  },

  signIn(callback) {
    GoogleSignin.signIn()
    .then((user) => {
      // google signin worked, ping our sever
      console.log('User returned from Google Signin API: ', user);
      this.authenticateAgainstBazaarApi(user, callback);
    })
    .catch((err) => {
      // google signin failed
      console.log('Error signing into Google: ', err);
      callback(true, {user: null});
    })
    .done();
  },

  authenticateAgainstBazaarApi(user, callback) {
    axios.post(`${serverUrl}/api/login`, {
      id_token: user.idToken,
      email: user.email,
    })
    .then(res => {
      this.bazaarAccessToken = res.userToken;
      this.bazaarUserId = res.userId;

      console.log('User returned from Bazaar login API: ', res)
      var {bazaarAccessToken, bazaarUserId} = this;
      callback(false, {user: assign({}, res.data, {bazaarAccessToken, bazaarUserId})});
    })
    .catch(err => {
      console.log('Error sending request to Bazaar login API: ', err)
      this.signOut();
      callback(true, {user: null});
    })
    .done();
  },

  currentUser() {
    if(GoogleSignin.currentUser().isEmpty) return null;

    var {bazaarAccessToken, bazaarUserId} = this;
    return assign({}, GoogleSignin.currentUser(), {bazaarAccessToken, bazaarUserId});
  },

  bazaarAccessToken: null,
  userId: null,
}

export default userCredentialStore;
