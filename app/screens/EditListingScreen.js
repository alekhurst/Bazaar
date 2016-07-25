import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  View
} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux';
import IonIcon from 'react-native-vector-icons/Ionicons';

import {closeEditListingScreen} from 'actions/editListingScreenActions';
import CreateListingMutation from 'mutations/CreateListingMutation';
import UpdateListingMutation from 'mutations/UpdateListingMutation';
import MeAndListingRoute from 'routes/MeAndListingRoute';

import Pokemon from 'datasets/pokemon';

import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import StatusBarBackground from 'components/misc/StatusBarBackground';
import NavigationBar from 'components/misc/NavigationBar';
import {vw} from 'hammer/viewPercentages';
import {matterhorn, white, primaryColor} from 'hammer/colors';
import renderIf from 'hammer/renderIf';
import networkRequestFailedAlert from 'hammer/networkRequestFailedAlert';

var EditListingScreenInner = React.createClass({
  getInitialState() {
    if (!this.props.listing) {
      return {
        mutating: false,
        name: '',
        cp: '',
        moveOne: '',
        moveTwo: '',
        height: '',
        weight: '',
      }
    }

    return {
      mutating: false,
      name: this.props.listing.pokemon.name,
      cp: String(this.props.listing.cp),
      moveOne: this.props.listing.moves[0].name,
      moveTwo: this.props.listing.moves[1].name,
      height: String(this.props.listing.height),
      weight: String(this.props.listing.weight),
    }
  },

  onPressFinish() {
    this.setState({mutating: true})
    if (!this.props.listing) {
      this.onPressFinishCreate();
    } else {
      this.onPressFinishEdit();
    }
  },

  onPressFinishCreate() {
    var createListingInput = {
      me: this.props.me,
      pokedexNumber: 1,
      moves: ['Quick Attack', 'Octazooka'],
      cp: 101,
      hp: 102,
      weight: 12.4,
      height: 20.34,
    }

    Relay.Store.commitUpdate(
      new CreateListingMutation(createListingInput),
      {
        onSuccess: this.onMutationSuccess,
        onFailure: this.onMutationFailure,
      }
    )
  },

  onPressFinishEdit() {
    var updateMutationInput = {
      me: this.props.me,
      listing: this.props.listing,
      pokedexNumber: 9,
      moves: ['Octazooka', 'Quick Attack'],
      cp: 105,
      hp: 22,
      weight: 19.4,
      height: 95,
    }

    Relay.Store.commitUpdate(
      new UpdateListingMutation(updateMutationInput),
      {
        onSuccess: this.onMutationSuccess,
        onFailure: this.onMutationFailure,
      }
    )
  },

  onMutationSuccess() {
    this.setState({mutating: false});
    this.props.dispatch(closeEditListingScreen());
  },

  onMutationFailure() {
    this.setState({mutating: false});
    this.props.dispatch(closeEditListingScreen());
    networkRequestFailedAlert();
  },

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBarBackground />
        <NavigationBar>
          <Text style={styles.title}>Create Listing</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => this.props.dispatch(closeEditListingScreen())}>
            <IonIcon name='ios-arrow-back' size={32} color={white} />
          </TouchableOpacity>
          {renderIf(!this.state.mutating)(
            <TouchableOpacity style={styles.nextButton} onPress={() => this.onPressFinish()}>
              <IonIcon name='md-checkmark' size={32} color={white} />
            </TouchableOpacity>
          )}
          {renderIf(this.state.mutating)(
            <ActivityIndicator size='small' color={white} style={[styles.nextButton, {marginTop: 7}]} animating />
          )}
        </NavigationBar>
        <View style={styles.inputRow}>
          <View style={[styles.textInputWrapper, {flex: 3}]}>
            <TextInput
              style={styles.pokemonNameTextInput}
              onChangeText={(name) => this.setState({name})}
              placeholder="Pokemon Name"
              value={this.state.name}
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.pokemonCpTextInput}
              onChangeText={(cp) => this.setState({cp})}
              placeholder="CP"
              value={this.state.cp}
              keyboardType='numeric'
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.pokemonMoveTextInput}
              onChangeText={(moveOne) => this.setState({moveOne})}
              placeholder="Move #1"
              value={this.state.moveOne}
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={[styles.pokemonMoveTextInput, {backgroundColor: 'transparent'}]}
              onChangeText={(moveTwo) => this.setState({moveTwo})}
              placeholder="Move #2"
              value={this.state.moveTwo}
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.pokemonMoveTextInput}
              onChangeText={(height) => this.setState({height})}
              placeholder="Height"
              value={this.state.height}
              keyboardType='numeric'
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.pokemonMoveTextInput}
              onChangeText={(weight) => this.setState({weight})}
              placeholder="Weight"
              value={this.state.weight}
              keyboardType='numeric'
            />
          </View>
        </View>
      </View>
    );
  }
});

EditListingScreenInner = connect()(EditListingScreenInner);

EditListingScreenInner = Relay.createContainer(EditListingScreenInner, {
  fragments: {
    me() {
      return Relay.QL`
        fragment on User {
          ${CreateListingMutation.getFragment('me')}
          ${UpdateListingMutation.getFragment('me')}
        }
      `;
    },
    listing() {
      return Relay.QL`
        fragment on Listing {
          id,
          cp,
          hp,
          height,
          weight,
          pokemon {
            name,
          },
          moves {
            name,
          },
          ${UpdateListingMutation.getFragment('listing')}
        }
      `;
    }
  },
});

var EditListingScreenPlaceholder = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <StatusBarBackground />
        <NavigationBar>
          <Text style={styles.title}>Create Listing</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => this.props.dispatch(closeEditListingScreen())}>
            <IonIcon name='ios-arrow-back' size={32} color={white} />
          </TouchableOpacity>
        </NavigationBar>
        <GenericLoadingScreen />
      </View>
    )
  }
});

EditListingScreenPlaceholder = connect()(EditListingScreenPlaceholder);

var EditListingScreenWrapper = React.createClass({
  render() {
    return (
      <Relay.Renderer
        Container={EditListingScreenInner}
        environment={Relay.Store}
        queryConfig={new MeAndListingRoute({listingId: this.props.listingId})}
        render={({done, error, props}) => {
          if (error) {
            return <GenericErrorScreen />
          } else if (props) {
            return <EditListingScreenInner {...props}/>
          } else {
            return <EditListingScreenPlaceholder />
          }
        }}
      />
    )
  }
});

function mapStateToProps(state) {
  return {listingId: state.editListingScreen.listingId}
}

EditListingScreenWrapper = connect(mapStateToProps)(EditListingScreenWrapper);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },

  backButton: {
    position: 'absolute',
    top: 5,
    left: 10,
  },

  nextButton: {
    position: 'absolute',
    top: 5,
    right: 10,
  },

  title: {
    textAlign: 'center',
    color: white,
    fontSize: 20,
    marginTop: 7,
  },

  inputRow: {
    flexDirection: 'row',
    paddingRight: 10,
    marginTop: 10,
  },

  // HACK: Wrap <TextInput> in <View> to get bottomBorderX to display correctly
  textInputWrapper: {
    flex: 1,
    borderBottomColor: matterhorn,
    borderBottomWidth: 1,
    marginLeft: 10,
    marginBottom: 0,
    height: 30,
  },

  pokemonNameTextInput: {
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: matterhorn
  },

  pokemonCpTextInput: {
    height: 30,
    textAlign: 'center'
  },

  pokemonMoveTextInput: {
    flex: 1
  },
});

export default EditListingScreenWrapper;
