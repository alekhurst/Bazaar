import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {connect} from 'react-redux';
import Relay from 'react-relay'
import Icon from 'react-native-vector-icons/Ionicons';

import {openEditListingScreen} from 'actions/editListingScreenActions';
import DestroyListingMutation from 'mutations/DestroyListingMutation';

import MeRoute from 'routes/MeRoute';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import GenericErrorScreen from 'screens/GenericErrorScreen';
import ListingDetailsScreen from 'screens/ListingDetailsScreen';
import ListingList from 'components/listing/ListingList';
import {white, primaryColor} from 'hammer/colors';
import networkRequestFailedAlert from 'hammer/networkRequestFailedAlert';
import noop from 'hammer/noop';

var MyProfileScreen = React.createClass({
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
        <View style={styles.topBarContainer}>
          <Text style={styles.myPokemonTitle}>My Pokemon</Text>
          <TouchableOpacity style={styles.addIcon} onPress={() => this.props.dispatch(openEditListingScreen())}>
            <Icon name='md-add' size={26} color={white} />
          </TouchableOpacity>
        </View>
        <ListingList
          editMode
          onPressConfirmDeleteListing={this.onPressConfirmDeleteListing}
          onPressListing={this.onPressListing}
          listings={this.props.me.listings.edges.map(e => e.node)}
        />
      </View>
    );
  }
});

MyProfileScreen = connect()(MyProfileScreen);

MyProfileScreen = Relay.createContainer(MyProfileScreen, {
  fragments: {
    me() {
      return Relay.QL`
        fragment on User {
          id,
          listings(first: 25) {
            edges {
              node {
                ${ListingList.getFragment('listings')}
              }
            }
          }
          ${DestroyListingMutation.getFragment('me')}
        }
      `;
    },
  },
});

var MyProfileScreenWrapper = React.createClass({
  render() {
    return (
      <Relay.Renderer
        Container={MyProfileScreen}
        environment={Relay.Store}
        queryConfig={new MeRoute()}
        render={({done, error, props}) => {
          if (error) {
            return <GenericErrorScreen />
          } else if (props) {
            return <MyProfileScreen {...props} />
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

  topBarContainer: {
    height: 43,
    backgroundColor: primaryColor,
    justifyContent: 'center',
  },

  myPokemonTitle: {
    textAlign: 'center',
    color: white,
    fontSize: 16,
    fontWeight: '600'
  },

  addIcon: {
    position: 'absolute',
    right: 10,
    top: 8,
  }
});

export default MyProfileScreenWrapper;
