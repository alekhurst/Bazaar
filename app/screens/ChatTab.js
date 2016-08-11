import React from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Alert,
} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Firebase from 'firebase';
import {get} from 'lodash';

import MeRoute from 'routes/MeRoute';
import UpdateMeMutation from 'mutations/UpdateMeMutation';

import GenericErrorScreen from 'screens/GenericErrorScreen';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import NavigationBar from 'components/misc/NavigationBar';
import ChatListRow from 'components/chat/ChatListRow';
import {white, ghost, whiteSmoke, matterhorn, primaryColor} from 'hammer/colors';
import renderIf from 'hammer/renderIf';
import {vw, vh} from 'hammer/viewPercentages';
import noop from 'hammer/noop';

var ChatTab = React.createClass({
  getInitialState() {
    return {
      displayName: this.props.me.displayName ? this.props.me.displayName : "",
      mutatingDisplayName: false,
      chatIds: null,
      loadingFirebaseUser: true,
    }
  },

  componentWillMount() {
    this._firebaseUserRef = Firebase.database().ref(`/users/${this.props.me.id}`)
    this._firebaseUserRef.on('value', this.onFirebaseUserValueChange);
  },

  componentWillUnmount() {
    this._firebaseUserRef.off('value', this.onFirebaseUserValueChange);
  },

  onFirebaseUserValueChange(snapshot) {
    var data = snapshot.val();
    var keys = data ? Object.keys(data.chats) : [];

    this.setState({
      loadingFirebaseUser: false,
      chatIds: keys,
    })
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
    var chatsContent = null;

    if (this.state.chatIds === null) {
      chatsContent = <Text style={{alignSelf: 'center', marginTop: vh(10)}}>Loading...</Text>
    } else if (this.state.chatIds.length === 0) {
      chatsContent = <Text style={{alignSelf: 'center', marginTop: vh(5)}}>You don't have any chats</Text>
    } else if (this.state.chatIds.length > 0) {
      chatsContent = this.state.chatIds.map((chatId) => <ChatListRow chatId={chatId} key={chatId} />)
    }

    return (
      <View style={styles.container}>
        <NavigationBar style={{justifyContent: 'center'}}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity style={styles.addIcon} onPress={noop}>
            <Icon name='md-add-circle' size={26} color={white} />
          </TouchableOpacity>
        </NavigationBar>
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
        <ScrollView>
          {chatsContent}
        </ScrollView>
      </View>
    );
  },
});

function mapStateToProps(state) {
  return {unreadCount: state.chat.unreadCount}
}

ChatTab = connect(mapStateToProps)(ChatTab);

ChatTab = Relay.createContainer(ChatTab, {
  fragments: {
    me() {
      return Relay.QL`
        fragment on User {
          id,
          displayName,
          ${UpdateMeMutation.getFragment('me')}
        }
      `;
    },
  },
});

var ChatTabWrapper = React.createClass({
  render() {
    return (
      <Relay.Renderer
        Container={ChatTab}
        environment={Relay.Store}
        queryConfig={new MeRoute()}
        render={({done, error, props}) => {
          if (error) {
            return <GenericErrorScreen />
          } else if (props) {
            return <ChatTab {...props} />
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
    backgroundColor: ghost,
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

export default ChatTabWrapper;
