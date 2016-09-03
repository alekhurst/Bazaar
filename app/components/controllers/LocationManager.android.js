import React from 'react';
import {DeviceEventEmitter, AppState, Alert} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux';
import {throttle, get} from 'lodash';

import {setLocation} from 'actions/locationActions';

import MeRoute from 'routes/MeRoute';
import UpdateMeMutation from 'mutations/UpdateMeMutation';
import noop from 'hammer/noop';

class LocationManager extends React.Component {
  constructor(props) {
    super(props)

    this.onLocationUpdate = this.onLocationUpdate.bind(this);
    this.commitUpdateMeMutation = this.commitUpdateMeMutation.bind(this);

    this.throttledCommitUpdateMeMutation = throttle(this.commitUpdateMeMutation, 180000);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.onLocationUpdate(position)
      },
      (error) => console.log('error getting initial position: ', error),
      {enableHighAccuracy: false, timeout: 10000, maximumAge: 10000}
    )

    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        this.onLocationUpdate(position)
      },
      (error) => console.log('error watching position : ', error),
      {enableHighAccuracy: false, timeout: 10000, maximumAge: 10000}
    )
  }

  onLocationUpdate(location) {
    this.throttledCommitUpdateMeMutation(location)
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

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return null
  }
}

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
