import React from 'react';
import {View, Image, TextInput, Text, StyleSheet} from 'react-native';

import {whtie, primaryColor} from 'hammer/colors';

class BazaarLoginScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('images/WhiteLogo512px.png')}
          style={styles.logo}
          resizeMode='contain'
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 160,
    height: 160,
  }
})

export default BazaarLoginScreen;
