export const closeListingDetailsScreen = () => {
  return {
    type: "CHANGE_LISTING_DETAILS_SCREEN_VISIBILITY",
    visible: false,
    listingId: null,
    pokemonName: null,
  }
}

export const openListingDetailsScreen = (listingId, pokemonName) => {
  return {
    type: "CHANGE_LISTING_DETAILS_SCREEN_VISIBILITY",
    visible: true,
    listingId,
    pokemonName,
  }
}
