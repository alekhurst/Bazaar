import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Navigator,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import Relay from 'react-relay';
import IonIcon from 'react-native-vector-icons/Ionicons';
import GoogleIcon from 'react-native-vector-icons/MaterialIcons';
import {get} from 'lodash';

import {openListingDetailsScreen} from 'actions/listingDetailsScreenActions';
import {openEditListingScreen} from 'actions/editListingScreenActions';

import TypeIcon from 'components/pokemon/TypeIcon';
import EnergyBar from 'components/pokemon/EnergyBar';
import {white, whiteSmoke, iron, matterhorn, primaryColor, primaryBlue, primaryRed} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';
import renderIf from 'hammer/renderIf';
import noop from 'hammer/noop';

var ListingListItem = React.createClass({
  propTypes: {
    editMode: React.PropTypes.bool,
    onPressConfirmDeleteListing: React.PropTypes.func
  },

  onPressListing() {
    this.props.dispatch(openListingDetailsScreen(this.props.listing.id, this.props.listing.pokemon.name))
  },

  onPressEdit() {
    this.props.dispatch(openEditListingScreen(this.props.listing.id))
  },

  onPressDelete() {
    Alert.alert(
      `Delete`,
      'Are you sure you want to delete this pokemon?',
      [
        {text: 'Yes', onPress: () => this.props.onPressConfirmDeleteListing(this.props.listing.id)},
        {text: 'No', onPress: noop}
      ]
    );
  },

  render() {
    var smallDevice = vw(100) <= 320 ? true : false; // iphone 5 or smaller

    var user = this.props.listing.user;
    var userDistance = Math.round(user.distanceFromMe)
    if (user.distanceFromMe < 1) {
      userDistance = '<1';
    } else if (user.distanceFromMe > 10) {
      userDistance = '>10';
    }

    // TODO: figure out the root of this... for now just return null
    // what's happening is there is only 1 move on a listing that's
    // being returned from listing search
    if (!this.props.listing.moves[1]) {
      console.log('this.props.losting: ', this.props.listing)
      return null
    }

    return (
      <TouchableOpacity
        onPress={this.onPressListing}
        style={styles.container}
      >
        <TypeIcon
          style={smallDevice ? styles.pokemonThumbnailSmall : styles.pokemonThumbnail}
          elementType={this.props.listing.pokemon.elementTypes[0]}
          resizeMode='contain'
        />
        <View style={styles.leftDetailsContainer}>
          <Text style={styles.pokemonName}>{this.props.listing.pokemon.name}</Text>
          <Text style={styles.cp}>{this.props.listing.cp ? `CP ${this.props.listing.cp }` : ''}</Text>
        </View>
        {renderIf(!this.props.editMode)(
          <View style={styles.middleDetailsContainer}>
            <Text style={styles.moveName}>{this.props.listing.moves[1].name}</Text>
            <View style={styles.moveDetailsContainer}>
              <Text style={styles.damage}>{this.props.listing.moves[1].damage}</Text>
              <EnergyBar energy={this.props.listing.moves[1].energy} style={styles.energyBar}/>
            </View>
          </View>
        )}
        {renderIf(!this.props.editMode)(
          <View style={styles.rightDetailsContainer}>
            <Text style={styles.distanceText}>{userDistance}km</Text>
          </View>
        )}
        {renderIf(this.props.editMode)(
          <View style={[styles.editModeRightDetailsContainer, {alignSelf: 'flex-end'}]}>
            <TouchableOpacity
              onPress={this.onPressDelete}
              style={styles.listingButton}
            >
              <IonIcon name='md-trash' style={styles.listingButtonIcon} size={30} color={matterhorn} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.onPressEdit}
              style={[styles.listingButton, {marginLeft: 5}]}
            >
              <IonIcon name='md-create' style={styles.listingButtonIcon} size={30} color={matterhorn} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  }
});

ListingListItem = connect()(ListingListItem);

ListingListItem = Relay.createContainer(ListingListItem, {
  fragments: {
    listing() {
      return Relay.QL`
        fragment on Listing {
          id,
          cp,
          moves {
            name,
            damage,
            energy,
          },
          pokemon {
            name,
            pokedexNumber,
            elementTypes,
          },
          user {
            distanceFromMe
          }
        }
      `;
    },
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomColor: whiteSmoke,
    borderBottomWidth: 1,
    marginHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: white,
  },

  pokemonThumbnail: {
    width: 50,
    height: 50,
    marginVertical: 3,
    marginHorizontal: 5,
  },

  pokemonThumbnailSmall: {
    width: 42,
    height: 42,
    marginHorizontal: 2,
  },

  leftDetailsContainer: {
    justifyContent: 'center',
    paddingLeft: 15,
  },

  pokemonName: {
    color: matterhorn,
    fontSize: 17,
    fontWeight: '500',
  },

  cp: {
    color: matterhorn,
    fontSize: 12,
    fontWeight: '300',
  },

  middleDetailsContainer: {
    justifyContent: 'center',
    paddingLeft: 15,
  },

  moveName: {
    color: iron,
    fontSize: 12,
    fontWeight: '300',
  },

  moveDetailsContainer: {
    flexDirection: 'row',
  },

  damage: {
    color: iron,
    fontSize: 14,
    fontWeight: '300',
  },

  energyBar: {
    width: 60,
    height: 5,
    marginLeft: 5,
    marginTop: 4,
  },

  rightDetailsContainer: {
    position: 'absolute',
    right: 5,
    top: 7,
    height: 15,
    width: 36,
  },

  editModeRightDetailsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    top: 12,
  },

  listingButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 45,
    borderRadius: 10,
  },

  distanceText: {
    alignSelf: 'flex-end',
    fontSize: 11,
    color: iron
  },
})

export default ListingListItem;
