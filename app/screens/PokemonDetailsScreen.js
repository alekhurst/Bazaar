import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import GoogleIcon from 'react-native-vector-icons/MaterialIcons'
import {times} from 'lodash';

import PokemonImage from 'components/pokemon/PokemonImage';
import PowerChargeBar from 'components/pokemon/PowerChargeBar';
import NavigationBar from 'components/misc/NavigationBar';
import StatusBarBackground from 'components/misc/StatusBarBackground';
import {white, gray98, gainsboro, matterhorn, primaryColor, primaryBlue} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';

var PokemonDetailsScreen = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <StatusBarBackground />
        <NavigationBar>
          <Text style={styles.title}>Zapdos</Text>
          <TouchableOpacity style={styles.backButton} onPress={this.props.onPressClose}>
            <IonIcon name='ios-arrow-back' size={32} color={white} />
          </TouchableOpacity>
        </NavigationBar>
        <View style={styles.topDetailsContainer}>
          <Text style={styles.cp}>CP <Text style={styles.cpValue}>106</Text></Text>
          <TouchableOpacity style={styles.wantButton}>
            <Text style={styles.wantButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.pokemonImageContainer}>
          <PokemonImage pokedexNumber={2} resizeMode='contain' style={styles.pokemonImage}/>
        </View>
        <View style={styles.lowerDetailsContainer}>
          <View style={styles.attributesContainer}>
            <View style={[styles.attribute]}>
              <Text style={styles.attributeValue}>56</Text>
              <Text style={styles.attributeTitle}>HP</Text>
            </View>
            <View style={[styles.attribute]}>
              <Text style={styles.attributeValue}>8.03kg</Text>
              <Text style={styles.attributeTitle}>WEIGHT</Text>
            </View>
            <View style={[styles.attribute]}>
              <Text style={styles.attributeValue}>54.74m</Text>
              <Text style={styles.attributeTitle}>HEIGHT</Text>
            </View>
            <View style={[styles.attribute]}>
              <Text style={styles.attributeValue}>Fire</Text>
              <Text style={styles.attributeTitle}>TYPE</Text>
            </View>
          </View>
          {times(2, m => (
            <View style={styles.move} key={m}>
              <View style={styles.leftColumnDetails}>
                <Text style={styles.moveName}>Lava Burst {m}</Text>
                <View style={styles.secondRowDetails}>
                  <Text style={styles.moveType}>Fire</Text>
                  <PowerChargeBar charges={3} style={styles.powerChargeBar}/>
                </View>
              </View>
              <Text style={styles.moveDamage}>45</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <View style={[styles.footerItem, styles.centered, {flex: 1}]}>
            <IonIcon name='md-person' size={16} color={primaryColor} />
            <Text style={[styles.footerItemText,  styles.trainerName]}>asdfsdf</Text>
          </View>
          <View style={[styles.footerItem, styles.centered, {flex: 2.5}]}>
            <GoogleIcon name='place' size={16} color={primaryColor} />
            <Text style={styles.footerItemText}>10km away (updated 11hr ago)</Text>
          </View>
        </View>
      </View>
    );
  }
});

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
    fontSize: 20,
    marginTop: 7,
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
    width: 280,
    alignSelf: 'center',
    borderRadius: 5,
  },

  attributesContainer: {
    flexDirection: 'row',
    flex: 1,
    width: 280,
    marginBottom: 7,
  },

  attribute: {
    flex: 1,
    alignItems: 'center',
  },

  attributeValue: {
    color: matterhorn,
    fontSize: 16,
  },

  attributeTitle: {
    color: matterhorn,
    fontSize: 10,
  },

  move: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginTop: 8
  },

  leftColumnDetails: {
    width: 220,
  },

  moveName: {
    color: matterhorn,
    fontSize: 16,
  },

  secondRowDetails: {
    flexDirection: 'row',
  },

  moveType: {
    color: matterhorn,
    fontSize: 11,
  },

  powerChargeBar: {
    position: 'relative',
    top: 3,
    left: 8,
    width: 90,
    height: 6,
  },

  moveDamage: {
    color: matterhorn,
    fontSize: 17,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: vw(100),
    flexDirection: 'row',
  },

  footerItem: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
  },

  footerItemText: {
    color: primaryColor,
    marginLeft: 2,
  },

  trainerName: {
    marginLeft: 5,
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

export default PokemonDetailsScreen;
