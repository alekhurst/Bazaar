import Relay from 'react-relay';

class PokemonRoute extends Relay.Route {
  static queries = {
    pokemon: () => Relay.QL`query { pokemon(id: $pokemonId) }`,
  };

  static paramDefinitions = {
    pokemonId: { required: true },
  };

  static routeName = 'PokemonRoute';
}

export default PokemonRoute;
