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
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {get, isNumber, isEmpty} from 'lodash';

import ViewerRoute from 'routes/ViewerRoute';

import NavigationBar from 'components/misc/NavigationBar';
import ListingList from 'components/listing/ListingList';
import ZeroResultsPlaceholder from 'components/listing/ZeroResultsPlaceholder';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import GenericErrorScreen from 'screens/GenericErrorScreen';
import {white, whiteSmoke, gainsboro, matterhorn, primaryColor} from 'hammer/colors';
import networkRequestFailedAlert from 'hammer/networkRequestFailedAlert';
import renderIf from 'hammer/renderIf';
import {vw} from 'hammer/viewPercentages';
import noop from 'hammer/noop';

const DEFAULT_SEARCH_TEXT = "";
const DEFAULT_FIRST_N = 9;

var FeedScreen = React.createClass({
  getInitialState() {
    return {
      searchText: "",
      pullRefreshing: false,
      manualRefreshing: false,
      endReachedFetching: false,
    }
  },

  onPullToRefresh() {
    this.setState({pullRefreshing: true})
    this.onRefresh();
  },

  onManualRefresh() {
    this.setState({manualRefreshing: true})
    this.onRefresh();
  },

  onRefresh() {
    this.props.relay.forceFetch({firstN: DEFAULT_FIRST_N}, ({ready, done, error}) => {
      if(error) {
        Alert.alert(
          `Feed Refresh Failed`,
          'Please try again momentarily',
          [
            {text: 'OK', onPress: noop},
          ]
        );
        this.setState({pullRefreshing: false, manualRefreshing: false});
      } else if (done && ready) {
        this.setState({pullRefreshing: false, manualRefreshing: false});
      }
    });
  },

  onSubmitSearchQuery() {
    /**
     * Very weird behavior with updating this search text... if you change the minimum
     * length to >= 1, you get 'performUpdateIfNecessary: Unexpected batch number(current 24, pending 23)'.
     * Waiting for react or relay to fix this one...
     */
    if (this.state.searchText.length > 1 || this.state.searchText === "") {
      this.setState({manualRefreshing: true})
      this.props.relay.setVariables({searchText: this.state.searchText}, ({done, error}) => {
        if (done) {
          this.setState({manualRefreshing: false})
        } else if (error) {
          networkRequestFailedAlert();
        }
      });
    }
  },

  onEndReached() {
    this.setState({endReachedFetching: true})
    this.props.relay.setVariables(
      {firstN: this.props.relay.variables.firstN + DEFAULT_FIRST_N},
      ({done, error}) => {
        if (done) {
          this.setState({endReachedFetching: false})
        } else if (error) {
          networkRequestFailedAlert();
        }
      }
    );
  },

  render() {
    var searchResultsLength = get(this.props.viewer, 'listingsSearch.edges.length', null);
    var latitude = get(this.props, 'location.latitude', null);
    var longitude = get(this.props, 'location.longitude', null);
    var locationIsEmpty = !isNumber(latitude) || !isNumber(longitude);

    return (
      <View style={styles.container}>
        <NavigationBar>
          <TextInput
            value={this.state.searchText}
            onChangeText={searchText => this.setState({searchText})}
            style={styles.searchInput}
            clearButtonMode='while-editing'
            autoCorrect={false}
            onSubmitEditing={() => this.onSubmitSearchQuery()}
            returnKeyType='search'
          />
          <Icon name='md-search' size={20} color={gainsboro} style={styles.searchIcon} />
        </NavigationBar>
        {renderIf(!searchResultsLength && (locationIsEmpty || this.state.manualRefreshing))(
          <GenericLoadingScreen />
        )}
        {renderIf(!searchResultsLength && (!locationIsEmpty && !this.state.manualRefreshing))(
          <ZeroResultsPlaceholder
            onManualRefresh={this.onManualRefresh}
            searchText={this.props.relay.variables.searchText}
          />
        )}
        {renderIf(searchResultsLength)(
          <ListingList
            listings={this.props.viewer.listingsSearch.edges.map((edge) => edge.node)}
            onPressListing={this.onPressListing}
            pullRefreshing={this.state.pullRefreshing}
            onPullToRefresh={this.onPullToRefresh}
            onEndReached={this.onEndReached}
            maxResultsShowing={searchResultsLength === this.props.relay.variables.firstN}
            endReachedFetching={this.state.endReachedFetching}
            haveScrolledPastFirstPage={searchResultsLength >= DEFAULT_FIRST_N}
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

function mapStateToProps(state) {
  return {location: state.location}
}

FeedScreen = connect(mapStateToProps)(FeedScreen);

FeedScreen = Relay.createContainer(FeedScreen, {
  initialVariables: {
    searchText: DEFAULT_SEARCH_TEXT,
    firstN: DEFAULT_FIRST_N,
  },

  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          listingsSearch(first: $firstN, q: $searchText, radius: 10) {
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
    var latitude = get(this.props, 'location.latitude', null);
    var longitude = get(this.props, 'location.longitude', null);
    var locationIsEmpty = !isNumber(latitude) || !isNumber(longitude);

    if (locationIsEmpty) {
      return <GenericLoadingScreen />
    }

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

function mapStateToProps(state) {
  return {location: state.location}
}

FeedScreenWrapper = connect(mapStateToProps)(FeedScreenWrapper);

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
    backgroundColor: white,
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
