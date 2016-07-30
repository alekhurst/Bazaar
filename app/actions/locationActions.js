export const setLocation = (latitude, longitude) => {
  return {
    type: "SET_LOCATION",
    latitude,
    longitude,
  }
}
