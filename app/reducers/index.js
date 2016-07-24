import { combineReducers } from 'redux';
import userCredentials from 'reducers/userCredentials';
import listingDetailsScreen from 'reducers/listingDetailsScreen';

const bazaarStore = combineReducers({
  userCredentials,
  listingDetailsScreen,
})

export default bazaarStore;
