export const closeEditListingScreen = () => {
  return {
    type: "CHANGE_EDIT_LISTING_SCREEN_VISIBILITY",
    visible: false,
    listingId: null,
  }
}

export const openEditListingScreen = (listingId) => {
  return {
    type: "CHANGE_EDIT_LISTING_SCREEN_VISIBILITY",
    visible: true,
    listingId: listingId, // optional -- will be undefined when opening in create mode
  }
}
