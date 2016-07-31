import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Relay from 'react-relay';
import Icon from 'react-native-vector-icons/Ionicons';
import {get} from 'lodash';

import ListingListItem from 'components/listing/ListingListItem';
import {whiteSmoke, matterhorn} from 'hammer/colors';
import renderIf from 'hammer/renderIf';
import {vw, vh} from 'hammer/viewPercentages';

var ListingList = React.createClass({
  propTypes: {
    listings: React.PropTypes.array.isRequired,
    onPullToRefresh: React.PropTypes.func,
    pullRefreshing: React.PropTypes.bool,
    editMode: React.PropTypes.bool,
    onEndReached: React.PropTypes.func,
    maxResultsShowing: React.PropTypes.bool,
    endReachedFetching: React.PropTypes.bool,
    haveScrolledPastFirstPage: React.PropTypes.bool,
  },

  onScroll(event) {
    if (!this.props.onEndReached) {
      return;
    }

    if (event.nativeEvent.contentOffset.y > event.nativeEvent.contentSize.height - (vh(100) - 100)
      && this.props.maxResultsShowing) {
      this.props.onEndReached();
    }
  },

  render() {
    if (!this.props.listings.length) return null;

    return (
      <ScrollView
        refreshControl={
          this.props.onPullToRefresh ?
            <RefreshControl
              refreshing={this.props.pullRefreshing}
              onRefresh={this.props.onPullToRefresh}
            />
            : null
        }
        onScroll={this.onScroll}
        scrollEventThrottle={400}
      >
        {this.props.children}
        {this.props.listings.map((listing, i) => (
          <ListingListItem
            key={i}
            listing={listing}
            editMode={this.props.editMode}
            onPressConfirmDeleteListing={this.props.onPressConfirmDeleteListing}
            keyboardDismissMode='interactive'
          />
        ))}
        {renderIf(this.props.endReachedFetching)(
          <View style={styles.lastItemContent}>
            <ActivityIndicator size='large' color={matterhorn} animating />
          </View>
        )}
        {renderIf(!this.props.endReachedFetching && this.props.haveScrolledPastFirstPage)(
          <View style={styles.lastItemContent}>
            <Text style={styles.noMoreResults}>That is all.</Text>
          </View>
        )}
      </ScrollView>
    );
  }
});

ListingList = Relay.createContainer(ListingList, {
  fragments: {
    listings() {
      return Relay.QL`
        fragment on Listing @relay(plural: true) {
          id,
          ${ListingListItem.getFragment('listing')}
        }
      `;
    },
  },
});

var styles = StyleSheet.create({
  container: {
    height: 60,
    width: vw(100),
  },

  listingListItem: {
    width: 40,
    height: 40,
  },

  lastItemContent: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noMoreResults: {
    color: matterhorn,
    fontSize: 12,
  }
})

export default ListingList;
