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
import ModalPicker from 'react-native-modal-picker';
import {isEmpty, indexOf} from 'lodash';

import {closeEditListingScreen} from 'actions/editListingScreenActions';
import CreateListingMutation from 'mutations/CreateListingMutation';
import UpdateListingMutation from 'mutations/UpdateListingMutation';
import MeAndListingRoute from 'routes/MeAndListingRoute';

import {pokemonList, pokemonDictionary} from 'datasets/pokemon';
import {quickMoves, specialMoves} from 'datasets/moves';

import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import GenericErrorScreen from 'screens/GenericErrorScreen';
import StatusBarBackground from 'components/misc/StatusBarBackground';
import NavigationBar from 'components/misc/NavigationBar';
import {vw} from 'hammer/viewPercentages';
import {matterhorn, white, primaryColor, primaryRed} from 'hammer/colors';
import renderIf from 'hammer/renderIf';
import networkRequestFailedAlert from 'hammer/networkRequestFailedAlert';

var EditListingScreenInner = React.createClass({
  componentWillMount() {
    this.pokemonModalData = pokemonList.slice().sort().map((pokemon, i) => {return {key: i, label: pokemon}})
    this.quickMoveModalData = quickMoves.slice().sort().map((move, i) => {return {key: i, label: move}});
    this.specialMoveModalData = specialMoves.slice().sort().map((move, i) => {return {key: i, label: move}});
  },

  getInitialState() {
    if (!this.props.listing) {
      return {
        errorMessage: '',
        mutating: false,
        pokemonName: '',
        cp: '',
        hp: '',
        quickMove: '',
        specialMove: '',
        height: '',
        weight: '',
      }
    }

    return {
      errorMessage: '',
      mutating: false,
      pokemonName: this.props.listing.pokemon.name,
      cp: String(this.props.listing.cp),
      hp: String(this.props.listing.hp),
      quickMove: this.props.listing.moves[0].name,
      specialMove: this.props.listing.moves[1].name,
      height: String(this.props.listing.height),
      weight: String(this.props.listing.weight),
    }
  },

  onPressFinish() {
    if(!this.validInput()) {
      return;
    }

    this.setState({mutating: true, errorMessage: ''})

    var mutationInput = {
      listing: this.props.listing,
      me: this.props.me,
      pokedexNumber: indexOf(pokemonList, this.state.pokemonName) + 1,
      moves: [this.state.quickMove, this.state.specialMove],
      cp: Number(Number(this.state.cp).toFixed()),
      hp: Number(Number(this.state.hp).toFixed()),
      weight: Number(Number(this.state.weight).toFixed(2)),
      height: Number(Number(this.state.height).toFixed(2)),
    }

    if (!this.props.listing) {
      this.onPressFinishCreate(mutationInput);
    } else {
      this.onPressFinishEdit(mutationInput);
    }
  },

  validInput() {
    if(isEmpty(this.state.pokemonName)
      || isEmpty(this.state.cp)
      || isEmpty(this.state.hp)
      || isEmpty(this.state.quickMove)
      || isEmpty(this.state.specialMove)
      || isEmpty(this.state.height)
      || isEmpty(this.state.weight)
    ) {
      this.setState({errorMessage: 'No fields can be left empty'})
      return false;
    }

    if(Number.isNaN(this.state.cp)
      || Number.isNaN(this.state.hp)
      || Number.isNaN(this.state.weight)
      || Number.isNaN(this.state.weight)
      || Number(this.state.cp) > 9999
      || Number(this.state.hp) > 9999
      || Number(this.state.weight) > 9999
      || Number(this.state.height) > 9999
    ) {
      this.setState({errorMessage: 'Invalid values'})
      return false;
    }

    return true;
  },

  onPressFinishCreate(mutationInput) {
    Relay.Store.commitUpdate(
      new CreateListingMutation(mutationInput),
      {
        onSuccess: this.onMutationSuccess,
        onFailure: this.onMutationFailure,
      }
    )
  },

  onPressFinishEdit(mutationInput) {
    Relay.Store.commitUpdate(
      new UpdateListingMutation(mutationInput),
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
          <Text style={styles.title}>{this.props.listing ? 'Edit Pokemon' : 'Create Pokemon'}</Text>
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
          <View style={[styles.modalPickerWrapper, {flex: 3}]}>
            <ModalPicker
              data={this.pokemonModalData}
              initValue={isEmpty(this.state.pokemonName) ? "Pokemon" : this.state.pokemonName}
              onChange={(option) => this.setState({pokemonName: option.label})}
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <View style={styles.modalPickerWrapper}>
            <ModalPicker
              data={this.quickMoveModalData}
              initValue={isEmpty(this.state.quickMove) ? "Quick Move" : this.state.quickMove}
              onChange={(option)=> this.setState({quickMove: option.label})}
            />
          </View>
          <View style={styles.modalPickerWrapper}>
            <ModalPicker
              data={this.specialMoveModalData}
              initValue={isEmpty(this.state.specialMove) ? "Special Move" : this.state.specialMove}
              onChange={(option)=> this.setState({specialMove: option.label})}
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              onChangeText={(cp) => this.setState({cp})}
              placeholder="CP"
              value={this.state.cp}
              keyboardType='numeric'
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              onChangeText={(hp) => this.setState({hp})}
              placeholder="HP"
              value={this.state.hp}
              keyboardType='numeric'
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              onChangeText={(height) => this.setState({height})}
              placeholder="Height"
              value={this.state.height}
              keyboardType='numeric'
            />
          </View>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              onChangeText={(weight) => this.setState({weight})}
              placeholder="Weight"
              value={this.state.weight}
              keyboardType='numeric'
            />
          </View>
        </View>
        {renderIf(!isEmpty(this.state.errorMessage))(
          <View style={styles.errorContainer}>
            <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
          </View>
        )}
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
        render={({done, error, props, retry}) => {
          if (error) {
            return <GenericErrorScreen retry={retry} />
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
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
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
    marginBottom: 5,
    height: 30,
  },

  modalPickerWrapper: {
    flex: 1,
    marginLeft: 10,
    marginBottom: 5,
    height: 30,
  },

  textInput: {
    height: 30,
    textAlign: 'center'
  },

  errorContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  errorMessage: {
    color: primaryRed,
  }
});

export default EditListingScreenWrapper;
