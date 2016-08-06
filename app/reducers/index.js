import { combineReducers } from 'redux';
import userCredentials from 'reducers/userCredentials';
import listingDetailsScreen from 'reducers/listingDetailsScreen';
import editListingScreen from 'reducers/editListingScreen';
import chatScreen from 'reducers/chatScreen';
import location from 'reducers/location';

const bazaarStore = combineReducers({
  userCredentials,
  listingDetailsScreen,
  editListingScreen,
  chatScreen,
  location,
})

export default bazaarStore;
