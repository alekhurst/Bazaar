import { combineReducers } from 'redux';
import userCredentials from 'reducers/userCredentials';
import listingDetailsScreen from 'reducers/listingDetailsScreen';
import editListingScreen from 'reducers/editListingScreen';
import location from 'reducers/location';

const bazaarStore = combineReducers({
  userCredentials,
  listingDetailsScreen,
  editListingScreen,
  location,
})

export default bazaarStore;
