import React from 'react';
import {DeviceEventEmitter, AppState, Alert} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux';
import {throttle, get} from 'lodash';
import Permissions from 'react-native-permissions';

import {setLocation} from 'actions/locationActions';
import {setFeedReflectingCurrentLocation} from 'actions/locationActions';

import MeRoute from 'routes/MeRoute';
import UpdateMeMutation from 'mutations/UpdateMeMutation';
import noop from 'hammer/noop';

class LocationManager extends React.Component {
  constructor(props) {
    super(props)

    this.onLocationUpdate = this.onLocationUpdate.bind(this);
    this.commitUpdateMeMutation = this.commitUpdateMeMutation.bind(this);
    this.onPermissionDenied = this.onPermissionDenied.bind(this);
    this.startTrackingLocation = this.startTrackingLocation.bind(this);
    this.requestPermission = this.requestPermission.bind(this);
    this.getDistanceFromCurrentLocation = this.getDistanceFromCurrentLocation.bind(this);
    this.onLocationWatchError = this.onLocationWatchError.bind(this);

    this.throttledCommitUpdateMeMutation = throttle(this.commitUpdateMeMutation, 5000);
  }

  componentWillMount() {
    AppState.addEventListener('change', (currentState) => {
      if (currentState === 'active') {
        this.requestPermission();
      }
    });
  }

  componentDidMount() {
    this.requestPermission();
  }

  requestPermission() {
    Permissions.requestPermission('location')
      .then(response => {
        // response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        if (response === 'authorized') {
          this.startTrackingLocation();
        } else {
          this.onPermissionDenied();
        }
      });
  }

  onPermissionDenied() {
    Alert.alert(
      'Location Denied',
      'Bazaar uses your location to find nearby players, and cannot work without it. We do not expose your precise location to others. \n\nTo use this app:\n1. Open Settings\n2. Allow location while in use',
      [{text: 'Open Settings', onPress: Permissions.openSettings}]
    )
  }

  onLocationWatchError() {
    Alert.alert(
      'Error Reading Location',
      'Your device failed to provide a location.'
    )
  }

  startTrackingLocation() {
    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        this.onLocationUpdate(position);
      },
      (error) => console.log('[LOCATION] error watching position : ', error)
    )
  }

  onLocationUpdate(location) {
    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;

    var reduxLatitude = get(this.props, 'reduxLocation.latitude', null);
    var reduxLongitude = get(this.props, 'reduxLocation.longitude', null);
    var reduxLocationIsEmpty = !reduxLongitude || !reduxLatitude;

    console.log('[LOCATION] Location received. Distance from last sent location: ',
      this.getDistanceFromCurrentLocation(latitude, longitude));
    console.log('[LOCATION] Redux location empty? ', reduxLocationIsEmpty);

    if (reduxLocationIsEmpty) {
      if (this.getDistanceFromCurrentLocation(latitude, longitude) < 100) {
        // app was just started, but we're near the last location we submitted.
        // we need to set a redux location, but the feed tab will take care
        // of reflecting it
        this.props.dispatch(setLocation(latitude, longitude));
        this.props.dispatch(setFeedReflectingCurrentLocation());
      } else {
        // app just started, and we're far enough away from our last location.
        // set the redux location, but the feed tab will take care of reflecting
        // it, so on success setFeedReflectingCurrentLocation to true
        this.throttledCommitUpdateMeMutation(location, () => {
          this.props.dispatch(setFeedReflectingCurrentLocation());
        })
      }
    } else if (this.getDistanceFromCurrentLocation(latitude, longitude) < 100) {
      // the app was not just started, and we're already at a location
      // close enough this one
      return;
    } else {
      // the app was not just started, and we're >100 meters from where we were previously
      this.throttledCommitUpdateMeMutation(location)
    }
  }

  // found this at http://www.movable-type.co.uk/scripts/latlong.html
  getDistanceFromCurrentLocation(latitude, longitude) {
    // new location
    let lon2 = longitude;
    let lat2 = latitude;

    // current location
    let lon1 = this.props.me.location.longitude;
    let lat1 = this.props.me.location.latitude;

    var R = 6371e3; // metres
    var φ1 = lat1 * Math.PI / 180;
    var φ2 = lat2 * Math.PI / 180;
    var Δφ = (lat2-lat1) * Math.PI / 180;
    var Δλ = (lon2-lon1) * Math.PI / 180;

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  commitUpdateMeMutation(location, optionalSuccessCallback) {
    var {latitude, longitude} = location.coords;

    var updateMeInput = {
      me: this.props.me,
      latitude,
      longitude,
    }

    Relay.Store.commitUpdate(
      new UpdateMeMutation(updateMeInput),
      {
        onSuccess: () => {
          this.props.dispatch(setLocation(latitude, longitude));
          if (optionalSuccessCallback) optionalSuccessCallback();
        },
        onFailure: this.onMutationFailure,
      }
    )
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return null
  }
}

function mapStateToProps(state) {
  return {reduxLocation: state.location}
}

LocationManager = connect(mapStateToProps)(LocationManager);

LocationManager = Relay.createContainer(LocationManager, {
  fragments: {
    me() {
      return Relay.QL`
        fragment on User {
          location {
            latitude,
            longitude,
          }
          displayName,
          ${UpdateMeMutation.getFragment('me')}
        }
      `;
    },
  },
});

class LocationManagerWrapper extends React.Component {
  render() {
    return (
      <Relay.Renderer
        Container={LocationManager}
        environment={Relay.Store}
        queryConfig={new MeRoute()}
        render={({done, error, props}) => {
          if (props) {
            return <LocationManager {...props} />
          }
        }}
      />
    )
  }
}

export default LocationManagerWrapper;
