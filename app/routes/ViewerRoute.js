import Relay from 'react-relay';

class ViewerRoute extends Relay.Route {
  static queries = {
    viewer: () => Relay.QL`query { viewer }`,
  };

  static routeName = 'ViewerRoute';
}

export default ViewerRoute
