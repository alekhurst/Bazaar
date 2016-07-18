import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {times} from 'lodash';

import ListingListItem from 'components/listing/ListingListItem';
import {whiteSmoke} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';

var ListingList = React.createClass({
  propTypes: {
    editMode: React.PropTypes.bool,
    onPressEdit: React.PropTypes.func,
    onPressDelete: React.PropTypes.func,
  },

  render() {
    return (
      <ScrollView>
        {times(10, i => (
          <ListingListItem
            key={i}
            editMode={this.props.editMode}
            onPressEdit={this.props.onPressEdit}
            onPressDelete={this.props.onPressDelete}
          />
        ))}
      </ScrollView>
    );
  }
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
