import Relay from 'react-relay';

class ListingRoute extends Relay.Route {
  static queries = {
    listing: () => Relay.QL`query { listing(id: $listingId) }`,
  };

  static paramDefinitions = {
    listingId: { required: true },
  };

  static routeName = 'ListingRoute';
}

export default ListingRoute;
