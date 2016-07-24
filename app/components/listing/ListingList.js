import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Relay from 'react-relay';
import Icon from 'react-native-vector-icons/Ionicons';
import {get} from 'lodash';

import ListingListItem from 'components/listing/ListingListItem';
import {whiteSmoke} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';

var ListingList = React.createClass({
  propTypes: {
    listings: React.PropTypes.array.isRequired,
    onRefresh: React.PropTypes.func,
    refreshing: React.PropTypes.bool,
    editMode: React.PropTypes.bool,
    onPressEdit: React.PropTypes.func,
    onPressDelete: React.PropTypes.func,
  },

  render() {
    if (!this.props.listings.length) return null;

    return (
      <ScrollView
        refreshControl={
          this.props.onRefresh ?
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.props.onRefresh}
            />
            : null
        }
      >
        {this.props.listings.map((listing, i) => (
          <ListingListItem
            key={i}
            listing={listing}
            editMode={this.props.editMode}
            onPressEdit={this.props.onPressEdit}
            onPressDelete={this.props.onPressDelete}
          />
        ))}
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
  }
})

export default ListingList;
