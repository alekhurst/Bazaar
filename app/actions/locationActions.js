export const setLocation = (latitude, longitude) => {
  return {
    type: "SET_LOCATION",
    latitude,
    longitude,
  }
}

export const setFeedReflectingCurrentLocation = () => {
  return {
    type: "SET_FEED_REFLECTING_CURRENT_LOCATION"
  }
}
