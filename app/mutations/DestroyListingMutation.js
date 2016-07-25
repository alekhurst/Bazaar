import Relay from 'react-relay';

class DestoryListingMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`
      mutation {
        DestroyListing
      }
    `;
  }

  getVariables() {
    return {
      id: this.props.listingId,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DestroyListingPayload {
        me {
          listings
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'me',
      parentID: this.props.me.id,
      connectionName: 'ListingConnection',
      deletedIDFieldName: 'destroyedListingId',
    }];
  }

  static fragments = {
    me() {
      return Relay.QL`
        fragment on User {
          listings(first: 25) {
            edges {
              node {
                id
              }
            }
          }
        }
      `;
    },
  };
}

export default DestoryListingMutation;
