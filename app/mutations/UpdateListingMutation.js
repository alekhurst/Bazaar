import Relay from 'react-relay';

class UpdateListingMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`
      mutation {
        UpdateListing
      }
    `;
  }

  getVariables() {
    return {
      id: this.props.listing.id,
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
      fragment on UpdateListingPayload {
        me {
          listings,
        }
        listing {
          moves,
          cp,
          hp,
          weight,
          height,
          pokemon {
            pokedexNumber
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        me: this.props.me.id,
        listing: this.props.listing.id,
      },
    }];
  }

  static fragments = {
    me() {
      return Relay.QL`
        fragment on User {
          id
        }
      `;
    },
    listing() {
      return Relay.QL`
        fragment on Listing {
          id
        }
      `;
    },
  };
}

export default UpdateListingMutation;
