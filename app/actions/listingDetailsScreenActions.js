export const closeListingDetailsScreen = () => {
  return {
    type: "CHANGE_LISTING_DETAILS_SCREEN_VISIBILITY",
    visible: false,
    listingId: null,
    pokemonName: null,
    pokemonGame: null,
  }
}

export const openListingDetailsScreen = (listingId, pokemonName, pokemonGame) => {
  return {
    type: "CHANGE_LISTING_DETAILS_SCREEN_VISIBILITY",
    visible: true,
    listingId,
    pokemonName,
    pokemonGame
  }
}
