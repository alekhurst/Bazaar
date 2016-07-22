import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native';

import {white, primaryColor} from 'hammer/colors';

var ChatScreen = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <Text>Chat Screen</Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default ChatScreen;
