import firebase from 'firebase';
import {firebaseConfig} from 'hammer/environment'

var firebaseApp = firebase.initializeApp(firebaseConfig);

export const SERVER_TIMESTAMP = firebase.database.ServerValue.TIMESTAMP;
export default firebaseApp.database();
