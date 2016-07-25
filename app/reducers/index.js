import { combineReducers } from 'redux';
import userCredentials from 'reducers/userCredentials';
import listingDetailsScreen from 'reducers/listingDetailsScreen';
import editListingScreen from 'reducers/editListingScreen';

const bazaarStore = combineReducers({
  userCredentials,
  listingDetailsScreen,
  editListingScreen,
})

export default bazaarStore;
