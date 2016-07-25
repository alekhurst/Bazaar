import Relay from 'react-relay';

class CreateListingMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`
      mutation {
        CreateListing
      }
    `;
  }

  getVariables() {
    return {
      pokedexNumber: this.props.pokedexNumber,
      moves: this.props.moves,
      cp: this.props.cp,
      hp: this.props.hp,
      weight: this.props.weight,
      height: this.props.height,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateListingPayload {
        me {
          listings
        }
      }
    `;
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
        }
      `;
    },
  };
}

export default CreateListingMutation;
