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
import Icon from 'react-native-vector-icons/Ionicons';

import PokemonImage from 'components/pokemon/PokemonImage';
import PowerChargeBar from 'components/pokemon/PowerChargeBar';
import DistanceIndicator from 'components/pokemon/DistanceIndicator';
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
    this.props.onPressListing("uuid", "Zapdos");
  },

  render() {
    var smallDevice = vw(100) <= 320 ? true : false; // iphone 5 or smaller

    return (
      <TouchableOpacity style={styles.container} onPress={this.onPressListing}>
        <PokemonImage
          style={smallDevice ? styles.pokemonThumbnailSmall : styles.pokemonThumbnail}
          pokedexNumber={2}
          resizeMode='contain'
        />
        <View style={styles.leftDetailsContainer}>
          <Text style={styles.pokemonName}>Zapdos</Text>
          <Text style={styles.cp}>CP 105</Text>
        </View>
        {renderIf(!this.props.editMode)(
          <View style={styles.middleDetailsContainer}>
            <Text style={styles.moveName}>Lava Burst</Text>
            <View style={styles.moveDetailsContainer}>
              <Text style={styles.power}>45</Text>
              <PowerChargeBar charges={5} style={styles.powerChargeBar}/>
            </View>
          </View>
        )}
        {renderIf(!this.props.editMode)(
          <View style={styles.rightDetailsContainer}>
            <DistanceIndicator distance={2} />
          </View>
        )}
        {renderIf(this.props.editMode)(
          <View style={[styles.editModeRightDetailsContainer, {alignSelf: 'flex-end'}]}>
            <TouchableOpacity
              onPress={this.props.onPressDelete}
              style={[styles.listingButton, {backgroundColor: primaryRed}]}
            >
              <Icon name='md-trash' style={styles.listingButtonIcon} size={30} color={white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.props.onPressEdit}
              style={[styles.listingButton, {backgroundColor: primaryBlue, marginLeft: 5}]}
            >
              <Icon name='md-create' style={styles.listingButtonIcon} size={30} color={white} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  }
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
    flex: 1,
    paddingTop: 0,
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
})

export default ListingListItem;
