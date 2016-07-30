function location(state = {
  latitude: null,
  longitude: null,
}, action) {
  switch (action.type) {
    case 'SET_LOCATION':
      return {
        latitude: action.latitude,
        longitude: action.longitude
      }
    default:
      return state
  }
}

export default location;
