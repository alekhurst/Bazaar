import {GoogleSignin} from 'react-native-google-signin';
import {Platform} from 'react-native';
import axios from 'axios';
import {dispatch} from 'redux-thunk';
import {assign} from 'lodash';

import {serverUrl} from 'hammer/environment';

/* EXPORTED ACTIONS */

export const login = () => {
  return function(dispatch) {
    dispatch(loggingIn());

    return GoogleSignin.signIn()
    .then((user) => {
      // google signin worked, ping our sever
      console.log('[AUTHENTICATION] User returned from Google Signin API: ', user);
      _authenticateAgainstBazaarApi(user, dispatch);
    })
    .catch((err) => {
      // google signin failed
      console.log('[AUTHENTICATION] Error signing into Google: ', err);
      dispatch(loginError())
    })
    .done();
  }
}

export const currentUserAsync = () => {
  return function(dispatch) {
    dispatch(loggingIn());
    GoogleSignin.currentUserAsync().then((user) => {
      if (user) {
        _authenticateAgainstBazaarApi(user, dispatch);
      } else {
        dispatch(notLoggedIn())
      }
    })
    .catch((err) => {
      console.log('[AUTHENTICATION] Error singing in with GoogleSignin library: ', err)
      dispatch(loginError());
    })
    .done();
  }
}

export const signOut = () => {
  return function(dispatch) {
    _signOut(dispatch);
  }
}

/* PRIVATE METHODS */

function _authenticateAgainstBazaarApi(user, dispatch) {
  axios.post(`${serverUrl}/api/login`, {
    id_token: user.idToken,
    email: user.email,
  })
  .then(res => {
    this.bazaarAccessToken = res.data.bazaarAccessToken;
    this.userId = res.data.id;
    this.userEmail = res.data.email;

    console.log('[AUTHENTICATION] User returned from Bazaar login API: ', res)
    var {bazaarAccessToken, userId, userEmail} = this;
    dispatch(loginSuccess(assign({}, {bazaarAccessToken, userId, userEmail})));
  })
  .catch(err => {
    console.log('[AUTHENTICATION] Error sending request to Bazaar login API: ', err)
    _signOut(dispatch);
    dispatch(loginError());
  })
  .done();
}

function _signOut(dispatch) {
  GoogleSignin.signOut()
  .then(() => {
    dispatch(notLoggedIn()); // signed out successfully
  })
  .catch((err) => {
    console.log('[AUTHENTICATION] Error signing out of Google: ', err)
    dispatch(loginError());
  });
}

/* RETURNED ACTIONS */

function loggingIn() {
  return {
    type: 'LOGGING_IN'
  }
}

function loginSuccess(user) {
  return {
    type: 'LOGIN_SUCCESS',
    ...user
  }
}

function notLoggedIn() {
  return {
    type: 'NOT_LOGGED_IN'
  }
}

function loginError() {
  return {
    type: 'LOGIN_ERROR'
  }
}
