function location(state = {
  latitude: null,
  longitude: null,
  feedReflectingCurrentLocation: false,
}, action) {
  switch (action.type) {
    case 'SET_LOCATION':
      return {
        latitude: action.latitude,
        longitude: action.longitude,
        feedReflectingCurrentLocation: false,
      }
    case 'SET_FEED_REFLECTING_CURRENT_LOCATION':
      return {
        ...state,
        feedReflectingCurrentLocation: true,
      }
    default:
      return state
  }
}

export default location;
