import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  Modal,
} from 'react-native';
import Relay from 'react-relay';
import Icon from 'react-native-vector-icons/Ionicons';

import ViewerRoute from 'routes/ViewerRoute';

import NavigationBar from 'components/misc/NavigationBar';
import PokemonDetailsScreen from 'screens/PokemonDetailsScreen';
import ListingList from 'components/listing/ListingList';
import {white, gainsboro, matterhorn, primaryColor} from 'hammer/colors';
import noop from 'hammer/noop';

var FeedScreen = React.createClass({
  getInitialState() {
    return {
      searchText: "",
      showingPokemonDetails: false,
    }
  },

  onPressListing(uuid, name) {
    this.setState({showingPokemonDetails: true})
  },

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar>
          <TextInput
            value={this.state.searchText}
            onChangeText={searchText => this.setState({searchText})}
            style={styles.searchInput}
            clearButtonMode='while-editing'
          />
          <Icon name='md-search' size={20} color={gainsboro} style={styles.searchIcon} />
        </NavigationBar>
        <ListingList onPressListing={this.onPressListing} />
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.showingPokemonDetails}
          onRequestClose={() => noop()}
        >
          <PokemonDetailsScreen onPressClose={() => this.setState({showingPokemonDetails: false})} />
        </Modal>
      </View>
    );
  }
});

FeedScreen = Relay.createContainer(FeedScreen, {
  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          listings(first: 10) {
            edges {
              node
            }
          }
        }
      `;
    },
  },
});

var FeedScreenWrapper = React.createClass({
  render() {
    return (
      <Relay.Renderer
        Container={FeedScreen}
        environment={Relay.Store}
        queryConfig={new ViewerRoute()}
        render={({done, error, props}) => {
          if (props) {
            return <FeedScreen {...props} />
          } else if (error) {
            console.log('Relay error in FeedScreen: ', error)
          } else {
            // loading
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

  searchInput: {
    flex: 1,
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    paddingLeft: 30,
    paddingTop: 3,
    backgroundColor: white,
    color: matterhorn,
  },

  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 10,
    backgroundColor: 'transparent',
  }
});

export default FeedScreenWrapper;
