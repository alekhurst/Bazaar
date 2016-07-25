function editListingScreen(state = {
  visible: false,
  listingId: null,
}, action) {
  switch (action.type) {
    case 'CHANGE_EDIT_LISTING_SCREEN_VISIBILITY':
      return {
        visible: action.visible,
        listingId: action.listingId
      }
    default:
      return state
  }
}

export default editListingScreen;
