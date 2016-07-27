import React from 'react';
import {DeviceEventEmitter, AppState, Alert} from 'react-native';
import Relay from 'react-relay';
import Location from 'react-native-location';

import MeRoute from 'routes/MeRoute';

const AUTHORIZED_WHEN_IN_USE = 'authorizedWhenInUse';
const AUTHORIZED_ALWAYS = 'authorizedAlways';
const DENIED = 'denied';
const NOT_DETERMINED = 'notDetermined';
const RESTRICTED = 'restricted';

const ACTIVE = 'active';
const BACKGROUND = 'background';
const INACTIVE = 'inactive';

class LocationManager extends React.Component {
  constructor() {
    super();

    this.subscription = null;
    this.getAuthorization = this.getAuthorization.bind(this);
    this.handleAuthorization = this.handleAuthorization.bind(this);
    this.onAuthorizationDenied = this.onAuthorizationDenied.bind(this);
    this.onAuthorizationSuccess = this.onAuthorizationSuccess.bind(this);
    this.onLocationUpdate = this.onLocationUpdate.bind(this);
  }

  componentDidMount() {
    // check location authorization every we we re-open app
    AppState.addEventListener('change', (currentState) => {
      if (currentState === ACTIVE) {
        this.handleAuthorization();
      }
    });

    Location.requestWhenInUseAuthorization();
  }

  getAuthorization(callback) {
    Location.requestWhenInUseAuthorization();
    Location.getAuthorizationStatus(authorization => callback(authorization));
  }

  handleAuthorization() {
    this.getAuthorization((authorization) => {
      if (authorization === AUTHORIZED_ALWAYS || authorization === AUTHORIZED_WHEN_IN_USE) {
        if (!this.subscription) {
          this.onAuthorizationSuccess();
        }
      } else {
        this.onAuthorizationDenied();
      }
    });
  }

  onAuthorizationDenied() {
    Alert.alert(
      'Location Denied',
      'Bazaar uses your location to find nearby pokemon, and cannot work without it.\n\nTo use this app:\n1. Open Settings\n2. Scroll down to Bazaar\n3. Allow location while in use',
    )
  }

  onAuthorizationSuccess() {
    Location.setDesiredAccuracy(30);
    Location.setDistanceFilter(30);
    Location.startUpdatingLocation();

    this.subscription = DeviceEventEmitter.addListener(
      'locationUpdated',
      this.onLocationUpdate,
    );
  }

  onLocationUpdate(location) {
    console.log('Previous location: ', this.props.me.location)
    console.log('New location: ', location)
    /* Example location returned
    {
      coords: {
        speed: -1,
        longitude: -0.1337,
        latitude: 51.50998,
        accuracy: 5,
        heading: -1,
        altitude: 0,
        altitudeAccuracy: -1
      },
      timestamp: 1446007304457.029
    }
    */
  }

  render() {
    return null
  }
};

LocationManager = Relay.createContainer(LocationManager, {
  fragments: {
    me() {
      return Relay.QL`
        fragment on User {
          location {
            latitude,
            longitude,
          }
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
