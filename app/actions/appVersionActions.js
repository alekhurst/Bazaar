import axios from 'axios';
import {Platform} from 'react-native';
import {dispatch} from 'redux-thunk';
import semver from 'semver';

import {serverUrl, appVersion} from 'hammer/environment';

export const checkMinimumSupportedAppVersion = () => {
  return function(dispatch) {
    axios.get(`${serverUrl}/api/minimum_supported_app_version`)
    .then(res => {
      var minimumSupportedAppVersion;

      dispatch(checkedMinimumSupportedAppVersion())
      if (Platform.OS === 'ios') {
        minimumSupportedAppVersion = res.data.ios;
      } else if (Platform.OS === 'android') {
        minimumSupportedAppVersion = res.data.android;
      }

      if (semver.satisfies(appVersion, `<=${minimumSupportedAppVersion}`)) {
        dispatch(appVersionSupported())
      } else {
        dispatch(appVersionNotSupported())
      }
    })
    .catch(err => {
      console.log('Error fetching minimum supported app version: ', err)
      dispatch(checkedMinimumSupportedAppVersion())
    })
    .done();
  }
}

function checkedMinimumSupportedAppVersion() {
  return {
    type: 'CHECKED_MINIMUM_SUPPORTED_APP_VERSION',
  }
}

function appVersionSupported() {
  return {
    type: 'APP_VERSION_SUPPORTED',
  }
}

function appVersionNotSupported() {
  return {
    type: 'APP_VERSION_NOT_SUPPORTED',
  }
}
