import Relay from 'react-relay';

class MeAndListingRoute extends Relay.Route {
  static queries = {
    listing: () => Relay.QL`query { listing(id: $listingId) }`,
    me: () => Relay.QL`query { me }`,
  };

  static paramDefinitions = {
    listingId: { required: true },
  };

  static routeName = 'MeAndListingRoute';
}

export default MeAndListingRoute;
