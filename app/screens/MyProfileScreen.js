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
import UpdateMeMutation from 'mutations/UpdateMeMutation';

import MeRoute from 'routes/MeRoute';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import GenericErrorScreen from 'screens/GenericErrorScreen';
import ListingDetailsScreen from 'screens/ListingDetailsScreen';
import ListingList from 'components/listing/ListingList';
import {white, whiteSmoke, matterhorn, primaryColor} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';
import networkRequestFailedAlert from 'hammer/networkRequestFailedAlert';
import noop from 'hammer/noop';

var MyProfileScreen = React.createClass({
  getInitialState() {
    return {
      displayName: this.props.me.displayName ? this.props.me.displayName : ""
    }
  },

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

  onFinishEditingDisplayName() {
    if (this.state.displayName === this.props.me.displayName) {
      return;
    }

    var updateMeInput = {
      me: this.props.me,
      displayName: this.state.displayName
    }

    Relay.Store.commitUpdate(
      new UpdateMeMutation(updateMeInput),
      {
        onSuccess: () => Alert.alert(
          `Success`,
          'Your chat display name was successfully updated',
          [
            {text: 'OK', onPress: noop},
          ]
        ),
        onFailure: () => {
          Alert.alert(
            `Failure`,
            'This display name has already been taken',
            [
              {text: 'OK', onPress: noop},
            ]
          )
        },
      }
    )
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topBarContainer}>
          <Text style={styles.title}>My Profile</Text>
          <TouchableOpacity style={styles.addIcon} onPress={() => this.props.dispatch(openEditListingScreen())}>
            <Icon name='md-add-circle' size={26} color={white} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container}>
          <View style={{backgroundColor: whiteSmoke, paddingTop: 10}}>
            <Text style={[styles.sectionHeader, ]}>ADS</Text>
          </View>
          <View style={[styles.sectionContainer, {backgroundColor: whiteSmoke, paddingBottom: 15, marginBottom: 10}]}>
            <TouchableOpacity style={styles.disableAdsButton} onPress={noop}>
              <Text style={styles.disableAdsButtonText}>Disable ads for $1.99</Text>
            </TouchableOpacity>
            <Text style={styles.nextAdTimer}>Next ad in 1:42</Text>
          </View>
          <Text style={styles.sectionHeader}>MY CHAT DISPLAY NAME</Text>
          <View style={[styles.sectionContainer]}>
            <View style={styles.displayNameInputWrapper}>
              <TextInput
                onChangeText={(displayName) => this.setState({displayName})}
                onSubmitEditing={() => this.onFinishEditingDisplayName()}
                placeholder="Anonymous"
                value={this.state.displayName}
                style={styles.displayNameTextInput}
                autoCorrect={false}
              />
            </View>
          </View>
          <View style={{width: vw(100)}}>
            <Text style={styles.sectionHeader}>MY POKEMON</Text>
            <TouchableOpacity style={styles.addListingButton} onPress={() => this.props.dispatch(openEditListingScreen())}>
              <Icon name='md-add-circle' size={20} color={matterhorn} />
            </TouchableOpacity>
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
          displayName,
          ${DestroyListingMutation.getFragment('me')}
          ${UpdateMeMutation.getFragment('me')}
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

  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: matterhorn,
    marginLeft: 10,
    marginBottom: 10,
  },

  sectionContainer: {
    marginBottom: 20,
  },

  disableAdsButton: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    marginTop: 0,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: matterhorn,
    borderWidth: 1,
  },

  disableAdsButtonText: {
    color: matterhorn,
    alignSelf: 'center',
    fontSize: 16,
  },

  nextAdTimer: {
    alignSelf: 'center',
    fontWeight: '300',
    fontSize: 13,
  },

  displayNameInputWrapper: {
    width: vw(65),
    alignSelf: 'center',
    borderBottomColor: matterhorn,
    borderBottomWidth: 1,
    marginLeft: 10,
    marginBottom: 5,
    height: 30,
  },

  displayNameTextInput: {
    height: 30,
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '300',
  },

  addListingButton: {
    flexDirection: 'row',
    position: 'absolute',
    right: 10,
    top: 0,
    width: 20,
    height: 20,
  }
});

export default MyProfileScreenWrapper;
