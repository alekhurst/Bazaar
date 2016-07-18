import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import ListingList from 'components/listing/ListingList';
import {white, gainsboro, matterhorn, primaryColor} from 'hammer/colors';

var FeedScreen = React.createClass({
  getInitialState() {
    return {
      searchText: ""
    }
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topBarContainer}>
          <TextInput
            value={this.state.searchText}
            onChangeText={searchText => this.setState({searchText})}
            style={styles.searchInput}
            clearButtonMode='while-editing'
          />
          <Icon name='md-search' size={20} color={gainsboro} style={styles.searchIcon} />
        </View>
        <ListingList />
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topBarContainer: {
    height: 43,
    backgroundColor: primaryColor,
  },

  searchInput: {
    flex: 1,
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    paddingLeft: 30,
    paddingTop: 3,
    backgroundColor: white,
    color: matterhorn,
  },

  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 10,
    backgroundColor: 'transparent',
  }
});

export default FeedScreen;
