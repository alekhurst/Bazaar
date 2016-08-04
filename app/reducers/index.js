import { combineReducers } from 'redux';
import userCredentials from 'reducers/userCredentials';
import listingDetailsScreen from 'reducers/listingDetailsScreen';
import editListingScreen from 'reducers/editListingScreen';
import conversationScreen from 'reducers/conversationScreen';
import location from 'reducers/location';

const bazaarStore = combineReducers({
  userCredentials,
  listingDetailsScreen,
  editListingScreen,
  conversationScreen,
  location,
})

export default bazaarStore;
