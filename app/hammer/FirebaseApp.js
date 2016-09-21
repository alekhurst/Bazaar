import firebase from 'firebase';
var config = {
  apiKey: "AIzaSyBC9CfCfZ4Br-P-XK27QTLv2hfQGMTOVqc",
  authDomain: "fir-bazaar.firebaseapp.com",
  databaseURL: "https://fir-bazaar.firebaseio.com",
  storageBucket: "firebase-bazaar.appspot.com",
};

var firebaseApp = firebase.initializeApp(config);

export const SERVER_TIMESTAMP = firebase.database.ServerValue.TIMESTAMP;
export default firebaseApp.database();
