import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Relay from 'react-relay';
import Icon from 'react-native-vector-icons/Ionicons';

import ViewerRoute from 'routes/ViewerRoute';

import NavigationBar from 'components/misc/NavigationBar';
import ListingList from 'components/listing/ListingList';
import ZeroResultsPlaceholder from 'components/listing/ZeroResultsPlaceholder';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import GenericErrorScreen from 'screens/GenericErrorScreen';
import {white, whiteSmoke, gainsboro, matterhorn, primaryColor} from 'hammer/colors';
import renderIf from 'hammer/renderIf';
import {vw} from 'hammer/viewPercentages';
import noop from 'hammer/noop';

var FeedScreen = React.createClass({
  getInitialState() {
    return {
      searchText: "",
      refreshing: false,
    }
  },

  onRefresh() {
    this.setState({refreshing: true})
    this.props.relay.forceFetch({}, ({ready, done, error}) => {
      if(error) {
        Alert.alert(
          `Feed Refresh Failed`,
          'Please try again momentarily',
          [
            {text: 'OK', onPress: noop},
          ]
        );
      } else if (done) {
        this.setState({refreshing: false});
      }
    });
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
        {renderIf(this.props.viewer.listingsSearch.edges.length === 0)(<ZeroResultsPlaceholder />)}
        {renderIf(this.props.viewer.listingsSearch.edges.length > 0)(
          <ListingList
            listings={this.props.viewer.listingsSearch.edges.map((edge) => edge.node)}
            onPressListing={this.onPressListing}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          >
            <View style={styles.resultsHeaderContainer}>
              <View style={styles.resultesHeaderLine} />
              <Text style={styles.resultsHeaderText}>Pokemon for trade near you</Text>
              <View style={styles.resultesHeaderLine} />
            </View>
          </ListingList>
        )}
      </View>
    );
  }
});

FeedScreen = Relay.createContainer(FeedScreen, {
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          listingsSearch(first: 30, radius: 10.0) {
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
  },

  resultsHeaderContainer: {
    width: vw(100),
    flexDirection: 'row',
    paddingTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resultesHeaderLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 10,
    backgroundColor: whiteSmoke,
  },

  resultsHeaderText: {
    fontSize: 12,
    color: matterhorn,
    fontWeight: '300',
    marginHorizontal: 10,
  }
});

export default FeedScreenWrapper;
