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

import MeRoute from 'routes/MeRoute';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import GenericErrorScreen from 'screens/GenericErrorScreen';
import ListingDetailsScreen from 'screens/ListingDetailsScreen';
import ListingList from 'components/listing/ListingList';
import {white, gray98, gainsboro, matterhorn, primaryColor} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';
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
          <Text style={styles.title}>My Listings</Text>
          <TouchableOpacity style={styles.addIcon} onPress={() => this.props.dispatch(openEditListingScreen())}>
            <Icon name='md-add-circle' size={26} color={white} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container}>
          <View style={styles.disableAdsHeaderContainer}>
            <Text style={styles.disableAdsHeader}>DISABLE ADS</Text>
          </View>
          <View style={styles.disableAdsButtonContainer}>
            <TouchableOpacity style={styles.disableAdsButton} onPress={noop}>
              <Text style={styles.disableAdsButtonText}>Disable ads for $1.99</Text>
            </TouchableOpacity>
            <Text style={styles.nextAdTimer}>Next ad in 1:42</Text>
          </View>
          <ListingList
            editMode
            onPressConfirmDeleteListing={this.onPressConfirmDeleteListing}
            onPressListing={this.onPressListing}
            listings={this.props.me.listings.edges.map(e => e.node)}
          />
        </ScrollView>
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
          },
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

  disableAdsHeaderContainer: {
    backgroundColor: gray98,
    paddingTop: 6,
  },

  disableAdsHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: matterhorn,
    marginLeft: 8,
    marginBottom: 4,
  },

  disableAdsButtonContainer: {
    backgroundColor: gray98,
    paddingBottom: 8,
    marginBottom: 0
  },

  disableAdsButton: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: gainsboro
  },

  disableAdsButtonText: {
    color: matterhorn,
    alignSelf: 'center',
    fontSize: 16,
  },

  nextAdTimer: {
    alignSelf: 'center',
    fontWeight: '300',
    fontSize: 12,
    marginTop: 5,
  },
});

export default MyProfileScreenWrapper;
