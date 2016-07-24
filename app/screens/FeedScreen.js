import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  Modal,
} from 'react-native';
import Relay from 'react-relay';
import Icon from 'react-native-vector-icons/Ionicons';

import ViewerRoute from 'routes/ViewerRoute';

import NavigationBar from 'components/misc/NavigationBar';
import ListingList from 'components/listing/ListingList';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import GenericErrorScreen from 'screens/GenericErrorScreen';
import {white, gainsboro, matterhorn, primaryColor} from 'hammer/colors';
import noop from 'hammer/noop';

var FeedScreen = React.createClass({
  getInitialState() {
    return { searchText: "" }
  },

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar>
          <TextInput
            value={this.state.searchText}
            onChangeText={searchText => this.setState({searchText})}
            style={styles.searchInput}
            clearButtonMode='while-editing'
          />
          <Icon name='md-search' size={20} color={gainsboro} style={styles.searchIcon} />
        </NavigationBar>
        <ListingList
          listings={this.props.viewer.listingsSearch.edges.map((edge) => edge.node)}
          onPressListing={this.onPressListing}
        />
      </View>
    );
  }
});

FeedScreen = Relay.createContainer(FeedScreen, {
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          listingsSearch(first: 10, radius: 10.0) {
            edges {
              node {
                ${ListingList.getFragment('listings')}
              }
            }
          }
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
        queryConfig={new ViewerRoute()}
        render={({done, error, props}) => {
          if (error) {
            return <GenericErrorScreen />
          } else if (props) {
            return <FeedScreen {...props} />
          } else {
            return <GenericLoadingScreen />
          }
        }}
      />
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default FeedScreenWrapper;
