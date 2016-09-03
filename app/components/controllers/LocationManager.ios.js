import React from 'react';
import {DeviceEventEmitter, AppState, Alert} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux';
import Location from 'react-native-location';
import {throttle, get} from 'lodash';

import {setLocation} from 'actions/locationActions';

import MeRoute from 'routes/MeRoute';
import UpdateMeMutation from 'mutations/UpdateMeMutation';
import noop from 'hammer/noop';

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

    // component vars (not states)
    this.subscription = null;

    // bind custom methods
    this.handleAuthorization = this.handleAuthorization.bind(this);
    this.onAuthorizationDenied = this.onAuthorizationDenied.bind(this);
    this.onAuthorizationSuccess = this.onAuthorizationSuccess.bind(this);
    this.onLocationUpdate = this.onLocationUpdate.bind(this);
    this.commitUpdateMeMutation = this.commitUpdateMeMutation.bind(this);

    this.throttledCommitUpdateMeMutation = throttle(this.commitUpdateMeMutation, 3000);
  }

  componentWillMount() {
    // check location authorization every we we re-open app
    AppState.addEventListener('change', (currentState) => {
      if (currentState === ACTIVE) {
        this.handleAuthorization();
      }
    });
  }

  componentDidMount() {
    this.handleAuthorization();
  }

  handleAuthorization() {
    Location.getAuthorizationStatus((authorization) => {
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
    this.throttledCommitUpdateMeMutation(location);
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

  commitUpdateMeMutation(location) {
    var {latitude, longitude} = location.coords;

    var updateMeInput = {
      me: this.props.me,
      latitude,
      longitude,
    }

    Relay.Store.commitUpdate(
      new UpdateMeMutation(updateMeInput),
      {
        onSuccess: () => this.props.dispatch(setLocation(latitude, longitude)),
        onFailure: this.onMutationFailure,
      }
    )
  }

  onMutationFailure() {
    Alert.alert(
      'Location Update Failed',
      'We had some trouble updating your location. Sorry about that, we\'re looking into it.',
      [
        {text: 'OK', onPress: noop},
      ]
    );
  }

  render() {
    return null
  }
};

LocationManager = connect()(LocationManager);

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
