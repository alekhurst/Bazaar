import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';

import {signOut} from 'actions/authenticationActions';
import {white, matterhorn, primaryBlue} from 'hammer/colors';

var GenericErrorScreen = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Oops! There was an error sending your request. Sorry about that, we’re looking into it.</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={() => this.props.dispatch(signOut())}>
          <Text style={styles.reloadButtonText}>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorText: {
    color: matterhorn,
    width: 220,
    textAlign: 'center',
  },

  reloadButton: {
    backgroundColor: primaryBlue,
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },

  reloadButtonText: {
    color: white,
  }
});

GenericErrorScreen = connect()(GenericErrorScreen);
export default GenericErrorScreen;
