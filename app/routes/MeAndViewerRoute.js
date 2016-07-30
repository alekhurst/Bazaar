import Relay from 'react-relay';

class MeAndViewerRoute extends Relay.Route {
  static queries = {
    viewer: () => Relay.QL`query { viewer }`,
    me: () => Relay.QL`query { me }`,
  };

  static routeName = 'MeAndViewerRoute';
}

export default MeAndViewerRoute;
