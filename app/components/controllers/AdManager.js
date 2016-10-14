import React from 'react';
import {Platform} from 'react-native';
import {AdMobInterstitial} from 'react-native-admob';

if (Platform.OS === 'ios') {
  AdMobInterstitial.setAdUnitID('ca-app-pub-7832878148999755/8772752421');
} else if (Platform.OS === 'android') {
  AdMobInterstitial.setAdUnitID('ca-app-pub-7832878148999755/2726218823');
}

class AdManager extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    AdMobInterstitial.setTestDeviceID('EMULATOR');

    AdMobInterstitial.addEventListener('interstitialDidLoad',
      () => console.log('[ADMOB] interstitialDidLoad event'));
    AdMobInterstitial.addEventListener('interstitialDidClose',
      this.interstitialDidClose);
    AdMobInterstitial.addEventListener('interstitialDidFailToLoad',
      () => console.log('[ADMOB] interstitialDidFailToLoad event'));
    AdMobInterstitial.addEventListener('interstitialDidOpen',
      () => console.log('[ADMOB] interstitialDidOpen event'));
    AdMobInterstitial.addEventListener('interstitialWillLeaveApplication',
      () => console.log('[ADMOB] interstitalWillLeaveApplication event'));

    AdMobInterstitial.requestAd((error) => error && console.log(error));
  }

  componentWillUnmount() {
    AdMobInterstitial.removeAllListeners();
  }

  interstitialDidClose() {
    console.log('[ADMOB] interstitialDidClose event');
    AdMobInterstitial.requestAd((error) => error && console.log(error));
  }

  render() {
    return null
  }
};

export default AdManager;
