import Relay from 'react-relay';

class UpdateMeMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`
      mutation {
        UpdateMe,
      }
    `;
  }

  getVariables() {
    return {
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      displayName: this.props.displayName,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateMePayload {
        me {
          location {
            latitude,
            longitude,
          },
          displayName,
          listings(first: 25) {
            edges {
              node {
                user {
                  displayName,
                  location {
                    latitude,
                    longitude,
                  }
                }
              }
            }
          }
        }
      }
    `;
  }

  getOptimisticResponse() {
    return {
      me: {
        displayName: this.props.displayName ? this.props.displayName : this.props.me.displayName
      }
    }
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        me: this.props.me.id,
      },
    }];
  }

  static fragments = {
    me() {
      return Relay.QL`
        fragment on User {
          id,
          location {
            latitude,
            longitude,
          },
          displayName,
        }
      `;
    },
  };
}

export default UpdateMeMutation;
