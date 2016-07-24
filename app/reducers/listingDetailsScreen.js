function listingDetailsScreen(state = {
  visible: false,
  pokemonName: null,
  listingId: null,
}, action) {
  switch (action.type) {
    case 'CHANGE_LISTING_DETAILS_SCREEN_VISIBILITY':
      return {
        visible: action.visible,
        pokemonName: action.pokemonName,
        listingId: action.listingId,
      }
    default:
      return state
  }
}

export default listingDetailsScreen;
