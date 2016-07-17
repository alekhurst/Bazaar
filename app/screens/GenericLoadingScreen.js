import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View
} from 'react-native';

import {matterhorn} from 'hammer/colors';

var GenericLoadingScreen = React.createClass({
  render() {
    return (
      <View style={[styles.container, this.props.style]} >
        <ActivityIndicator color={matterhorn} size='small' />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default GenericLoadingScreen;
