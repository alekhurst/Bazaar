import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {connect} from 'react-redux';
import Relay from 'react-relay'
import Icon from 'react-native-vector-icons/Ionicons';

import {openEditListingScreen} from 'actions/editListingScreenActions';
import DestroyListingMutation from 'mutations/DestroyListingMutation';

import ZeroMyListingsPlaceholder from 'components/listing/ZeroMyListingsPlaceholder';
import renderIf from 'hammer/renderIf';
import NavigationBar from 'components/misc/NavigationBar';
import MeRoute from 'routes/MeRoute';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import GenericErrorScreen from 'screens/GenericErrorScreen';
import ListingDetailsScreen from 'screens/ListingDetailsScreen';
import ListingList from 'components/listing/ListingList';
import {white, ghost, gainsboro, matterhorn, primaryColor} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';
import networkRequestFailedAlert from 'hammer/networkRequestFailedAlert';
import noop from 'hammer/noop';

var MeTab = React.createClass({
  onPressConfirmDeleteListing(listingId) {
    var destroyListingInput = {
      me: this.props.me,
      listingId,
    }

    Relay.Store.commitUpdate(
      new DestroyListingMutation(destroyListingInput),
      {
        onSuccess: noop,
        onFailure: networkRequestFailedAlert,
      }
    )
  },

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar style={{justifyContent: 'center'}}>
          <Text style={styles.title}>My Listings</Text>
          <TouchableOpacity
            style={styles.addIcon}
            onPress={() => this.props.dispatch(openEditListingScreen())}
            hitSlop={{top: 20, bottom: 20, left: 30, right: 20}}
          >
            <Icon name='md-add-circle' size={26} color={white} />
          </TouchableOpacity>
        </NavigationBar>
        <ListingList
          editMode
          onPressConfirmDeleteListing={this.onPressConfirmDeleteListing}
          onPressListing={this.onPressListing}
          listings={this.props.me.listings.edges.map(e => e.node)}
        />
        {renderIf(this.props.me.listings.edges.length === 0)(
          <View>
            <ZeroMyListingsPlaceholder></ZeroMyListingsPlaceholder>
          </View>
        )}
      </View>
    );
  }
});

MeTab = connect()(MeTab);

MeTab = Relay.createContainer(MeTab, {
  fragments: {
    me() {
      return Relay.QL`
        fragment on User {
          id,
          listings(first: 30) {
            edges {
              node {
                ${ListingList.getFragment('listings')}
              }
            }
          },
          ${DestroyListingMutation.getFragment('me')}
        }
      `;
    },
  },
});

var MeTabWrapper = React.createClass({
  render() {
    return (
      <Relay.Renderer
        Container={MeTab}
        environment={Relay.Store}
        queryConfig={new MeRoute()}
        render={({done, error, props, retry}) => {
          if (error) {
            return <GenericErrorScreen retry={retry} />
          } else if (props) {
            return <MeTab {...props} />
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
    backgroundColor: white,
  },

  title: {
    textAlign: 'center',
    color: white,
    fontSize: 16,
    fontWeight: '600'
  },

  addIcon: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
});

export default MeTabWrapper;
