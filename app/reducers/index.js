import { combineReducers } from 'redux';
import userCredentials from 'reducers/userCredentials';
import appVersion from 'reducers/appVersion';
import listingDetailsScreen from 'reducers/listingDetailsScreen';
import editListingScreen from 'reducers/editListingScreen';
import chatScreen from 'reducers/chatScreen';
import startChatScreen from 'reducers/startChatScreen';
import location from 'reducers/location';
import chat from 'reducers/chat';

const bazaarStore = combineReducers({
  userCredentials,
  appVersion,
  listingDetailsScreen,
  editListingScreen,
  chatScreen,
  startChatScreen,
  location,
  chat,
})

export default bazaarStore;
