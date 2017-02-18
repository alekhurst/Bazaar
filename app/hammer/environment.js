const STAGING = 'STAGING';
const PRODUCTION = 'PRODUCTION';

/* ---- MODIFY THIS LINE ----------- */
const CURRENT_ENVIRONMENT = STAGING;
const APP_VERSION = '1.0.29';
/* ----------------------------------*/

let staging = {
  serverUrl: "https://bazaar-api-stg.herokuapp.com",
}

let production = {
  serverUrl: "https://bazaar-api-prod.herokuapp.com"
}

let both = {
  appVersion: APP_VERSION,
  firebaseConfig: {
    apiKey: "AIzaSyBC9CfCfZ4Br-P-XK27QTLv2hfQGMTOVqc",
    authDomain: "fir-bazaar.firebaseapp.com",
    databaseURL: "https://fir-bazaar.firebaseio.com",
    storageBucket: "firebase-bazaar.appspot.com",
  },
}

let envConfig = {};
switch (CURRENT_ENVIRONMENT) {
  case STAGING:
    envConfig = Object.assign({}, staging, both);
    break;
  case PRODUCTION:
    envConfig = Object.assing({}, production, both);
    break;
  default:
    envConfig = Object.assign({}, staging, both);
    break;
}

module.exports = envConfig;
