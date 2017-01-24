import React from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  View,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux';
import {AdMobInterstitial} from 'react-native-admob';
import Icon from 'react-native-vector-icons/Ionicons';
import {get, isNumber, isEmpty, debounce} from 'lodash';

import ViewerRoute from 'routes/ViewerRoute';
import {setFeedReflectingCurrentLocation} from 'actions/locationActions';

import F8StyleSheet from 'hammer/F8StyleSheet';
import NavigationBar from 'components/misc/NavigationBar';
import ListingList from 'components/listing/ListingList';
import BazaarModalPicker from 'components/misc/BazaarModalPicker';
import ZeroResultsPlaceholder from 'components/listing/ZeroResultsPlaceholder';
import LocationUpdatedBanner from 'components/misc/LocationUpdatedBanner';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import GenericErrorScreen from 'screens/GenericErrorScreen';
import {white, whiteSmoke, base, gainsboro, matterhorn, primaryColor} from 'hammer/colors';
import networkRequestFailedAlert from 'hammer/networkRequestFailedAlert';
import renderIf from 'hammer/renderIf';
import {vw, vh} from 'hammer/viewPercentages';
import noop from 'hammer/noop';
import games from 'datasets/games';

const DEFAULT_SEARCH_TEXT = "";
const DEFAULT_FIRST_N = 12;

var FeedTab = React.createClass({
  componentWillMount() {
    // can assume location is in redux because wrapper won't
    // let us in otherwise
    this.props.dispatch(setFeedReflectingCurrentLocation());

    this.setState({manualRefreshing: true});
    this.props.relay.setVariables({
      latitude: this.props.reduxLocation.latitude,
      longitude: this.props.reduxLocation.longitude,
    }, ({done, error}) => {
      if (done) {
        this.setState({manualRefreshing: false})
      } else if (error) {
        networkRequestFailedAlert();
      }
    })

    this.games = games.slice().map((game, i) => {
      if (game === 'Pokemon Go (coming soon!)') {
        return {key: i, label: game, section: true};
      }
      return {key: i, label: game}
    });
    this.games.unshift({
      key: 11,
      label: "None (Show All Results)",
    });

    debouncedOnSubmitSearchQuery = debounce(this.onSubmitSearchQuery, 300);
  },

  getInitialState() {
    return {
      searchText: "",
      pullRefreshing: false,
      manualRefreshing: false,
      endReachedFetching: false,
      endReachedCount: 0,
      showingGameFilter: false,
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
    this.props.dispatch(setFeedReflectingCurrentLocation());
    this.setState({endReachedCount: 0}); // for edge case: accumulated enough
     // endReaches for endReachedCount % 2 === 0. Now pulling to refresh, and it
     // will another ad (when it shouldn't) if we don't do this
    this.props.relay.forceFetch({
      firstN: DEFAULT_FIRST_N,
      latitude: this.props.reduxLocation.latitude,
      longitude: this.props.reduxLocation.longitude,
    }, ({ready, done, error}) => {
      if(error) {
        Alert.alert(
          `Feed Refresh Failed`,
          'Please try again momentarily',
          [
            {text: 'OK', onPress: noop},
          ]
        );
        this.setState({pullRefreshing: false, manualRefreshing: false, endReachedCount: 0});
      } else if (done && ready) {
        this.setState({pullRefreshing: false, manualRefreshing: false, endReachedCount: 0});
      }
    });
  },

  onChangeSearchText(searchText) {
    this.setState({searchText});
    debouncedOnSubmitSearchQuery();
  },

  onChangeGameFilterSelection(item) {
    this.props.dispatch(setFeedReflectingCurrentLocation());
    this.setState({
      endReachedCount: 0,
      manualRefreshing: true
    });

    this.props.relay.setVariables({
      game: item.label === 'None (Show All Results)' ? "" : item.label,
    }, ({done, error}) => {
      if (done) {
        this.setState({manualRefreshing: false})
      } else if (error) {
        networkRequestFailedAlert();
      }
    });
  },

  onSubmitSearchQuery() {
    this.props.dispatch(setFeedReflectingCurrentLocation());
    this.setState({endReachedCount: 0});
    /**
     * Very weird behavior with updating this search text... if you change the minimum
     * length to >= 1, you get 'performUpdateIfNecessary: Unexpected batch number(current 24, pending 23)'.
     * Waiting for react or relay to fix this one...
     */
    if (this.state.searchText.length > 1 || this.state.searchText === "") {
      this.setState({manualRefreshing: true})
      this.props.relay.setVariables({
        searchText: this.state.searchText,
        latitude: this.props.reduxLocation.latitude,
        longitude: this.props.reduxLocation.longitude,
      }, ({done, error}) => {
        if (done) {
          this.setState({manualRefreshing: false})
        } else if (error) {
          networkRequestFailedAlert();
        }
      });
    }
  },

  onScroll(offset, contentHeight) {
    if (this.state.endReachedCount !== 0 && this.state.endReachedCount % 2 === 0) {
      // if we're on a third onEndReached
      let searchResultsLength = get(this.props.viewer, 'listingsSearch.edges.length', null);
      if (offset > contentHeight - (vh(100) + 500)
        && searchResultsLength === this.props.relay.variables.firstN) {
        // if we're midway through the most recently loaded listings
        // && max possible listings are showing
        this.setState({endReachedCount: 0})
        AdMobInterstitial.showAd((error) => error && console.log('[ADMOB] Error showing ad: ', error));
      }
    }
  },

  onEndReached() {
    this.setState({endReachedFetching: true})
    this.props.relay.setVariables(
      {firstN: this.props.relay.variables.firstN + DEFAULT_FIRST_N},
      ({done, error}) => {
        if (done) {
          this.setState({
            endReachedFetching: false,
            endReachedCount: this.state.endReachedCount + 1,
          });
        } else if (error) {
          networkRequestFailedAlert();
        }
      }
    );
  },

  render() {
    var searchResultsLength = get(this.props.viewer, 'listingsSearch.edges.length', null);
    var content = null;

    if (this.state.manualRefreshing) {
      content = <GenericLoadingScreen />
    } else if (!searchResultsLength) {
      content = (
        <ZeroResultsPlaceholder
          onManualRefresh={this.onManualRefresh}
          searchText={this.props.relay.variables.searchText}
        />
      )
    } else {
      content = (
        <ListingList
          listings={this.props.viewer.listingsSearch.edges.map((edge) => edge.node)}
          onPressListing={this.onPressListing}
          pullRefreshing={this.state.pullRefreshing}
          onPullToRefresh={this.onPullToRefresh}
          onScroll={this.onScroll}
          onEndReached={this.onEndReached}
          maxResultsShowing={searchResultsLength === this.props.relay.variables.firstN}
          endReachedFetching={this.state.endReachedFetching}
        >
          <View style={styles.resultsHeaderContainer}>
            <View style={styles.resultesHeaderLine} />
            <Text style={styles.resultsHeaderText}>For trade near you</Text>
            <View style={styles.resultesHeaderLine} />
          </View>
        </ListingList>
      )
    }

    return (
      <View style={styles.container}>
        <NavigationBar style={{flexDirection: 'row'}}>
          <TextInput
            value={this.state.searchText}
            onChangeText={this.onChangeSearchText}
            style={styles.searchInput}
            clearButtonMode='while-editing'
            underlineColorAndroid='transparent'
            autoCorrect={false}
            returnKeyType='search'
          />
          <Icon name='md-search' size={20} color={gainsboro} style={styles.searchIcon} />
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={() => this.setState({ showingGameFilter: true })}
          >
            <Icon name='ios-game-controller-b' size={24} color={white} style={styles.gameIcon} />
          </TouchableOpacity>
        </NavigationBar>
        {content}
        {renderIf(!this.props.reduxLocation.feedReflectingCurrentLocation)(
          <LocationUpdatedBanner onPressRefresh={this.onManualRefresh}/>
        )}
        <BazaarModalPicker
          data={this.games}
          modalVisible={this.state.showingGameFilter}
          onPressClose={() => this.setState({ showingGameFilter: false })}
          sectionTextStyle={{color: base}}
          sectionStyle={{paddingVertical: 10}}
          onChange={this.onChangeGameFilterSelection}
        />
      </View>
    );
  }
});

function mapStateToProps(state) {
  return {reduxLocation: state.location}
}

FeedTab = connect(mapStateToProps)(FeedTab);

FeedTab = Relay.createContainer(FeedTab, {
  initialVariables: {
    searchText: DEFAULT_SEARCH_TEXT,
    firstN: DEFAULT_FIRST_N,
    latitude: null,
    longitude: null,
    game: "",
  },

  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          listingsSearch(
            first: $firstN,
            q: $searchText,
            radius: 10,
            latitude: $latitude,
            longitude: $longitude,
            game: $game,
          ) {
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

var FeedTabWrapper = React.createClass({
  render() {
    var latitude = get(this.props, 'reduxLocation.latitude', null);
    var longitude = get(this.props, 'reduxLocation.longitude', null);
    var locationIsEmpty = !latitude || !longitude;

    if (locationIsEmpty) {
      return <GenericLoadingScreen />
    }

    return (
      <Relay.Renderer
        Container={FeedTab}
        environment={Relay.Store}
        queryConfig={new ViewerRoute()}
        render={({done, error, props, retry}) => {
          if (error) {
            return <GenericErrorScreen retry={retry} />
          } else if (props) {
            return <FeedTab {...props} />
          } else {
            return <GenericLoadingScreen />
          }
        }}
      />
    );
  },
});

function mapStateToProps(state) {
  return {reduxLocation: state.location}
}

FeedTabWrapper = connect(mapStateToProps)(FeedTabWrapper);

const styles = F8StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },

  searchInput: {
    flex: 1,
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    paddingLeft: 30,
    backgroundColor: white,
    color: matterhorn,
    ios: {
      paddingTop: 3,
    },
    android: {
      paddingTop: 0,
      paddingBottom: 0,
    }
  },

  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 10,
    backgroundColor: 'transparent',
  },

  gameIcon: {
    marginTop: 7,
    marginRight: 8,
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

export default FeedTabWrapper;
