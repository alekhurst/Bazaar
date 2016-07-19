import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
} from 'react-native';
import Relay from 'react-relay';
import Icon from 'react-native-vector-icons/Ionicons';

import DemoRoute from 'routes/DemoRoute';

import ListingList from 'components/listing/ListingList';
import {white, gainsboro, matterhorn, primaryColor} from 'hammer/colors';

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

FeedScreen = Relay.createContainer(FeedScreen, {
  fragments: {
    user() {
      return Relay.QL`
        fragment on User {
          id,
          name,
        }
      `;
    },
  },
});

var FeedScreenWrapper = React.createClass({
  render() {
    return (
      <Relay.Renderer
        Container={FeedScreen}
        environment={Relay.Store}
        queryConfig={new DemoRoute()}
        render={({done, error, props}) => {
          if (props) {
            return <FeedScreen {...props} />
          } else if (error) {
            console.log('Relay error in FeedScreen: ', error)
          } else {
            // loading
          }
        }}
      />
    );
  },
});

export default FeedScreenWrapper;
