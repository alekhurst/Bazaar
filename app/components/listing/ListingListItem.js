import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Navigator,
} from 'react-native';
import {connect} from 'react-redux';
import Relay from 'react-relay';
import IonIcon from 'react-native-vector-icons/Ionicons';
import GoogleIcon from 'react-native-vector-icons/MaterialIcons';

import {openListingDetailsScreen} from 'actions/listingDetailsScreenActions';

import PokemonImage from 'components/pokemon/PokemonImage';
import PowerChargeBar from 'components/pokemon/PowerChargeBar';
import {white, whiteSmoke, gainsboro, matterhorn, primaryColor, primaryBlue, primaryRed} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';
import renderIf from 'hammer/renderIf';

var ListingListItem = React.createClass({
  propTypes: {
    editMode: React.PropTypes.bool,
    onPressEdit: React.PropTypes.func,
    onPressDelete: React.PropTypes.func,
  },

  onPressListing() {
    this.props.dispatch(openListingDetailsScreen(this.props.listing.id, this.props.listing.pokemon.name))
  },

  render() {
    var smallDevice = vw(100) <= 320 ? true : false; // iphone 5 or smaller

    return (
      <TouchableOpacity
        onPress={this.onPressListing}
        style={styles.container}
      >
        <PokemonImage
          style={smallDevice ? styles.pokemonThumbnailSmall : styles.pokemonThumbnail}
          pokedexNumber={this.props.listing.pokemon.pokedexNumber}
          resizeMode='contain'
        />
        <View style={styles.leftDetailsContainer}>
          <Text style={styles.pokemonName}>{this.props.listing.pokemon.name}</Text>
          <Text style={styles.cp}>CP {this.props.listing.cp}</Text>
        </View>
        {renderIf(!this.props.editMode)(
          <View style={styles.middleDetailsContainer}>
            <Text style={styles.moveName}>{this.props.listing.moves[0].name}</Text>
            <View style={styles.moveDetailsContainer}>
              <Text style={styles.power}>{this.props.listing.moves[0].power}</Text>
              <PowerChargeBar charges={this.props.listing.moves[0].charges} style={styles.powerChargeBar}/>
            </View>
          </View>
        )}
        {renderIf(!this.props.editMode)(
          <View style={styles.rightDetailsContainer}>
            <GoogleIcon name='place' size={14} color={gainsboro}/>
            <Text style={styles.distanceText}>8km</Text>
          </View>
        )}
        {renderIf(this.props.editMode)(
          <View style={[styles.editModeRightDetailsContainer, {alignSelf: 'flex-end'}]}>
            <TouchableOpacity
              onPress={this.props.onPressDelete}
              style={[styles.listingButton, {backgroundColor: primaryRed}]}
            >
              <IonIcon name='md-trash' style={styles.listingButtonIcon} size={30} color={white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.props.onPressEdit}
              style={[styles.listingButton, {backgroundColor: primaryBlue, marginLeft: 5}]}
            >
              <IonIcon name='md-create' style={styles.listingButtonIcon} size={30} color={white} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  }
});

ListingListItem = Relay.createContainer(ListingListItem, {
  fragments: {
    listing() {
      return Relay.QL`
        fragment on Listing {
          id,
          cp,
          moves {
            name,
            power,
            charges,
          },
          pokemon {
            name,
            pokedexNumber,
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
    width: 45,
    height: 45,
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
    color: gainsboro,
    fontSize: 12,
    fontWeight: '300',
  },

  moveDetailsContainer: {
    flexDirection: 'row',
  },

  power: {
    color: gainsboro,
    fontSize: 14,
    fontWeight: '300',
  },

  powerChargeBar: {
    width: 60,
    height: 5,
    marginLeft: 5,
    marginTop: 4,
  },

  rightDetailsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    top: 7,
    height: 15,
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
    width: 45,
    height: 45,
    borderRadius: 10,
  },

  distanceText: {
    fontSize: 11,
    color: gainsboro
  },
})

ListingListItem = connect()(ListingListItem);
export default ListingListItem;
