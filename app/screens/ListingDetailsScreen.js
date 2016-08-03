import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import GoogleIcon from 'react-native-vector-icons/MaterialIcons';

import ListingRoute from 'routes/ListingRoute';
import {closeListingDetailsScreen} from 'actions/listingDetailsScreenActions';

import GenericErrorScreen from 'screens/GenericErrorScreen';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import PokemonImage from 'components/pokemon/PokemonImage';
import EnergyBar from 'components/pokemon/EnergyBar';
import NavigationBar from 'components/misc/NavigationBar';
import StatusBarBackground from 'components/misc/StatusBarBackground';
import {white, gray98, matterhorn, primaryColor, primaryBlue} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';

var ListingDetailsInner = React.createClass({
  render() {
    var listing = this.props.listing;
    var pokemon = this.props.listing.pokemon;
    var user = this.props.listing.user;

    var userName = user.displayName ? user.displayName : 'anonymous';
    var userDistance = Math.round(user.distanceFromMe)
    if (user.distanceFromMe < 1) {
      userDistance = '<1';
    } else if (user.distanceFromMe > 10) {
      userDistance = '>10';
    }

    var currentDateUTC = Date.parse(new Date().toUTCString());
    var locationUpdatedAtUTC = Date.parse(user.locationUpdatedAt)
    var locationUpdatedAt = Math.round(((currentDateUTC - locationUpdatedAtUTC) / 1000) / 60)

    if (locationUpdatedAt < 1) {
      locationUpdatedAt = '<1m';
    } else if (locationUpdatedAt < 60){
      locationUpdatedAt = locationUpdatedAt + 'm';
    } else if (locationUpdatedAt >= 60 && locationUpdatedAt < 1440) {
      locationUpdatedAt = Math.round(locationUpdatedAt / 60) + 'hr';
    } else if (locationUpdatedAt >= 1440 && locationUpdatedAt < 10080) {
      locationUpdatedAt = Math.round(locationUpdatedAt / 1440) + 'd';
    } else {
      locationUpdatedAt = '>7d';
    }

    var smallDevice = vw(100) <= 320 ? true : false; // iphone 5 or smaller
    var bottomTextFontSize = smallDevice ? {fontSize: 12} : {fontSize: 13};

    return (
      <View style={styles.container}>
        <View style={styles.topDetailsContainer}>
          <Text style={styles.cp}>CP <Text style={styles.cpValue}>{listing.cp}</Text></Text>
          <TouchableOpacity style={styles.wantButton}>
            <Text style={styles.wantButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.pokemonImageContainer}>
          <PokemonImage
            pokedexNumber={listing.pokemon.pokedexNumber}
            resizeMode='contain'
            style={styles.pokemonImage}
          />
        </View>
        <View style={styles.lowerDetailsContainer}>
          <View style={styles.attributesContainer}>
            <View style={[styles.attribute]}>
              <Text style={styles.attributeValue}>{listing.hp}</Text>
              <Text style={styles.attributeTitle}>HP</Text>
            </View>
            <View style={[styles.attribute]}>
              <Text style={styles.attributeValue}>{listing.weight}kg</Text>
              <Text style={styles.attributeTitle}>WEIGHT</Text>
            </View>
            <View style={[styles.attribute]}>
              <Text style={styles.attributeValue}>{listing.height}m</Text>
              <Text style={styles.attributeTitle}>HEIGHT</Text>
            </View>
            <View style={[styles.attribute]}>
              <Text style={styles.attributeValue}>{pokemon.elementTypes[0]}</Text>
              <Text style={styles.attributeTitle}>TYPE</Text>
            </View>
          </View>
          {listing.moves.map((move, i) => (
            <View style={styles.move} key={i}>
              <View style={styles.leftColumnDetails}>
                <Text style={styles.moveName}>{move.name}</Text>
                <View style={styles.secondRowDetails}>
                  <Text style={styles.moveType}>{move.elementType}</Text>
                  <EnergyBar energy={move.energy} style={styles.energyBar}/>
                </View>
              </View>
              <Text style={styles.moveDamage}>{move.damage}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <View style={{flex: 1, marginHorizontal: 10, marginVertical: 5, flexDirection: 'row', alignItems: 'center'}}>
            <IonIcon name='md-person' size={smallDevice ? 14 : 16} color={primaryColor}/>
            <Text style={{color: primaryColor, marginLeft: 5}}>{userName}</Text>
          </View>
          <View style={{flex: 1, marginHorizontal: 10, marginVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
            <GoogleIcon name='place' size={smallDevice ? 14 : 14} color={primaryColor}/>
            <Text style={{color: primaryColor}}>{userDistance}km away ({locationUpdatedAt} ago)</Text>
          </View>
        </View>
      </View>
    );
  }
});

ListingDetailsInner = Relay.createContainer(ListingDetailsInner, {
  fragments: {
    listing() {
      return Relay.QL`
        fragment on Listing {
          id,
          cp,
          hp,
          weight,
          height,
          moves {
            name,
            energy,
            damage,
            elementType,
          },
          pokemon {
            name,
            pokedexNumber,
            elementTypes,
          },
          user {
            displayName,
            distanceFromMe,
            locationUpdatedAt,
          }
        }
      `;
    },
  },
});

ListingDetailsScreen = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <StatusBarBackground />
        <NavigationBar>
          <Text style={styles.title}>{this.props.pokemonName}</Text>
          <TouchableOpacity style={styles.backButton} onPress={this.props.onPressClose}>
            <IonIcon name='ios-arrow-back' size={32} color={white} />
          </TouchableOpacity>
        </NavigationBar>
        {this.props.children}
      </View>
    )
  }
})

var ListingDetailsScreenWrapper = React.createClass({
  render() {
    return (
      <Relay.Renderer
        Container={ListingDetailsInner}
        environment={Relay.Store}
        queryConfig={new ListingRoute({listingId: this.props.listingDetailsScreen.listingId})}
        render={({done, error, props}) => {
          if (error) {
            return <GenericErrorScreen />
          } else if (props) {
            return (
              <ListingDetailsScreen
                pokemonName={this.props.listingDetailsScreen.pokemonName}
                onPressClose={() => this.props.dispatch(closeListingDetailsScreen())}>
                <ListingDetailsInner {...props} />
              </ListingDetailsScreen>
            )
          } else {
            return (
              <ListingDetailsScreen
                pokemonName={this.props.listingDetailsScreen.pokemonName}
                onPressClose={() => this.props.dispatch(closeListingDetailsScreen())}>
                <GenericLoadingScreen />
              </ListingDetailsScreen>
            )
          }
        }}
      />
    );
  },
});

function mapStateToProps(state) {
  return {listingDetailsScreen: state.listingDetailsScreen}
}

ListingDetailsScreenWrapper = connect(mapStateToProps)(ListingDetailsScreenWrapper);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },

  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    left: 10,
    top: 5,
  },

  title: {
    textAlign: 'center',
    color: white,
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },

  topDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: vw(100),
    height: 60,
  },

  cp: {
    fontSize: 16,
    marginTop: 17,
    color: matterhorn,
    fontWeight: '700',
  },

  cpValue: {
    fontSize: 22,
  },

  wantButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: primaryBlue,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 5,
  },

  wantButtonText: {
    color: white,
    fontSize: 16,
  },

  pokemonImageContainer: {
    width: vw(100),
    alignItems: 'center',
  },

  pokemonImage: {
    height: 180,
    width: 180,
    marginTop: 5,
    marginBottom: 10,
  },

  lowerDetailsContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: gray98,
    width: 290,
    alignSelf: 'center',
    borderRadius: 5,
  },

  attributesContainer: {
    flexDirection: 'row',
    flex: 1,
    width: 280,
    position: 'relative',
    left: -5,
    marginBottom: 7,
  },

  attribute: {
    flex: 1,
    alignItems: 'center',
  },

  attributeValue: {
    color: matterhorn,
    fontSize: 16,
    fontWeight: '300',
  },

  attributeTitle: {
    color: matterhorn,
    fontSize: 10,
  },

  move: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginTop: 10
  },

  leftColumnDetails: {
    flex: 1,
    paddingLeft: 0,
    alignItems: 'flex-start',
  },

  moveName: {
    color: matterhorn,
    fontSize: 16,
    fontWeight: '300',
  },

  secondRowDetails: {
    flexDirection: 'row',
  },

  moveType: {
    color: matterhorn,
    fontSize: 11,
  },

  energyBar: {
    position: 'relative',
    top: 3,
    left: 8,
    width: 90,
    height: 6,
  },

  moveDamage: {
    color: matterhorn,
    fontSize: 18,
    fontWeight: '300',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: vw(100),
    flexDirection: 'row',
  },

  footerItem: {
    position: 'absolute',
    bottom: 5,
    color: primaryColor,
  },

  leftFooterItem: {
    left: 10,
    width: vw(40) - 10,
  },

  rightFooterItem: {
    width: vw(60) - 10,
    right: 10,
  },

  leftJustified: {
    justifyContent: 'flex-start'
  },

  rightJustified: {
    justifyContent: 'flex-end',
  },

  centered: {
    justifyContent: 'center',
  },
});

export default ListingDetailsScreenWrapper;
