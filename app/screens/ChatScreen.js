import React from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Alert,
} from 'react-native';
import Relay from 'react-relay';
import Icon from 'react-native-vector-icons/Ionicons'
import MeRoute from 'routes/MeRoute';
import UpdateMeMutation from 'mutations/UpdateMeMutation';

import GenericErrorScreen from 'screens/GenericErrorScreen';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import ConversationList from 'components/chat/ConversationList';
import {white, gray98, whiteSmoke, matterhorn, primaryColor} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';
import noop from 'hammer/noop';

var ChatScreen = React.createClass({
  getInitialState() {
    return {
      displayName: this.props.me.displayName ? this.props.me.displayName : "",
      mutatingDisplayName: false
    }
  },

  onFinishEditingDisplayName() {
    if (this.state.displayName === this.props.me.displayName) {
      return;
    }

    if(this.state.displayName.length > 16) {
      Alert.alert(
        'Failure',
        'Your display name is too long',
        [{text: 'OK', onPress: noop}]
      );
      return;
    }

    var updateMeInput = {
      me: this.props.me,
      displayName: this.state.displayName
    }

    this.setState({mutatingDisplayName: true});
    Relay.Store.commitUpdate(
      new UpdateMeMutation(updateMeInput),
      {
        onSuccess: () => {
          this.setState({mutatingDisplayName: false});
          Alert.alert(
            `Success`,
            'Your display name was successfully updated',
            [{text: 'OK', onPress: noop}]
          )
        },
        onFailure: () => {
          this.setState({mutatingDisplayName: false});
          Alert.alert(
            `Failure`,
            'This display name has already been taken',
            [{text: 'OK', onPress: noop}]
          )
        },
      }
    )
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topBarContainer}>
          <Text style={styles.title}>Conversations</Text>
          <TouchableOpacity style={styles.addIcon} onPress={noop}>
            <Icon name='md-add-circle' size={26} color={white} />
          </TouchableOpacity>
        </View>
        <View style={styles.displayNameContainer}>
          <Text style={styles.displayNameHeader}>SET YOUR CHAT DISPLAY NAME</Text>
          <View style={styles.displayNameInputWrapper}>
            <TextInput
              onChangeText={(displayName) => this.setState({displayName})}
              onSubmitEditing={() => this.onFinishEditingDisplayName()}
              placeholder="Anonymous"
              value={this.state.displayName}
              style={styles.displayNameTextInput}
              returnKeyType='done'
              autoCorrect={false}
            />
            <ActivityIndicator animating={this.state.mutatingDisplayName} size='small' style={styles.mutatingDisplayNameSpinner}/>
          </View>
        </View>
        <ConversationList />
      </View>
    );
  },
});

ChatScreen = Relay.createContainer(ChatScreen, {
  fragments: {
    me() {
      return Relay.QL`
        fragment on User {
          displayName,
          ${UpdateMeMutation.getFragment('me')}
        }
      `;
    },
  },
});

var ChatScreenWrapper = React.createClass({
  render() {
    return (
      <Relay.Renderer
        Container={ChatScreen}
        environment={Relay.Store}
        queryConfig={new MeRoute()}
        render={({done, error, props}) => {
          if (error) {
            return <GenericErrorScreen />
          } else if (props) {
            return <ChatScreen {...props} />
          } else {
            return <GenericLoadingScreen />
          }
        }}
      />
    );
  },
});

var styles = StyleSheet.create({
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

  displayNameContainer: {
    marginBottom: 20,
    backgroundColor: gray98,
    paddingBottom: 12,
    marginBottom: 5,
  },

  displayNameHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: matterhorn,
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 5,
  },

  displayNameInputWrapper: {
    width: 240,
    alignSelf: 'center',
    borderBottomColor: matterhorn,
    borderBottomWidth: 1,
    marginTop: 5,
    height: 30,
  },

  displayNameTextInput: {
    height: 30,
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '300',
    color: matterhorn,
  },

  mutatingDisplayNameSpinner: {
    position: 'absolute',
    right: 0,
    top: 3,
  }
});

export default ChatScreenWrapper;
