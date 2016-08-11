import React from 'react';
import {AdMobInterstitial} from 'react-native-admob';

class AdManager extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    AdMobInterstitial.setAdUnitID('ca-app-pub-7832878148999755/2507833224');
    AdMobInterstitial.setTestDeviceID('EMULATOR');

    AdMobInterstitial.addEventListener('interstitialDidLoad',
      () => console.log('interstitialDidLoad event'));
    AdMobInterstitial.addEventListener('interstitialDidClose',
      this.interstitialDidClose);
    AdMobInterstitial.addEventListener('interstitialDidFailToLoad',
      () => console.log('interstitialDidFailToLoad event'));
    AdMobInterstitial.addEventListener('interstitialDidOpen',
      () => console.log('interstitialDidOpen event'));
    AdMobInterstitial.addEventListener('interstitialWillLeaveApplication',
      () => console.log('interstitalWillLeaveApplication event'));

    AdMobInterstitial.requestAd((error) => error && console.log(error));
  }

  componentWillUnmount() {
    AdMobInterstitial.removeAllListeners();
  }

  interstitialDidClose() {
    console.log('interstitialDidClose event');
    AdMobInterstitial.requestAd((error) => error && console.log(error));
  }

  render() {
    return null
  }
};

export default AdManager;
