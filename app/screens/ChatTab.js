import React from 'react';
import {
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Alert,
} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {get} from 'lodash';

import {openStartChatScreen} from 'actions/startChatScreenActions';

import MeRoute from 'routes/MeRoute';
import ViewerRoute from 'routes/ViewerRoute';
import UpdateMeMutation from 'mutations/UpdateMeMutation';

import FirebaseApp from 'hammer/FirebaseApp';
import GenericErrorScreen from 'screens/GenericErrorScreen';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import NavigationBar from 'components/misc/NavigationBar';
import ChatListRow from 'components/chat/ChatListRow';
import F8StyleSheet from 'hammer/F8StyleSheet';
import getDisplayNamePlaceholderFromUserId from 'hammer/getDisplayNamePlaceholderFromUserId';
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
    this._firebaseUserChatsRef = FirebaseApp.ref(`/userChats/${this.props.me.id}`)
    this._firebaseUserChatsRef.on('value', this.onFirebaseUserChatsValueChange);
  },

  componentWillUnmount() {
    this._firebaseUserChatsRef.off('value', this.onFirebaseUserChatsValueChange);
  },

  onFirebaseUserChatsValueChange(snapshot) {
    var data = snapshot.val();
    var keys = data ? Object.keys(data) : [];

    this.setState({
      loadingFirebaseUser: false,
      chatIds: keys,
    })
  },

  onFinishEditingDisplayName() {
    if (this.state.displayName === this.props.me.displayName) {
      return;
    }

    if (this.state.displayName === '') {
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
            'Your display name was successfully set',
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

  showCreateChatAlert() {
    Alert.alert(
      `Alert`,
      'To start a chat with somebody, open their listing from the feed screen',
      [{text: 'OK', onPress: noop}]
    )
  },

  onPressStartChat() {
    this.props.dispatch(openStartChatScreen());
  },

  render() {
    var chatsContent = null;

    if (this.state.chatIds === null) {
      chatsContent = <Text style={{color: matterhorn, alignSelf: 'center', marginTop: vh(10)}}>Loading...</Text>
    } else if (this.state.chatIds.length === 0) {
      chatsContent = <Text style={{color: matterhorn, alignSelf: 'center', marginTop: vh(25)}}>(You don't have any chats)</Text>
    } else if (this.state.chatIds.length > 0) {
      chatsContent = this.state.chatIds.map((chatId) => <ChatListRow chatId={chatId} key={chatId} />)
    }

    let placeholder = getDisplayNamePlaceholderFromUserId(this.props.me.id);

    return (
      <View style={styles.container}>
        <NavigationBar style={{justifyContent: 'center'}}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity
            style={styles.addIcon}
            onPress={this.onPressStartChat}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 30}}
          >
            <Icon name='md-add-circle' size={26} color={white} />
          </TouchableOpacity>
        </NavigationBar>
        {renderIf(!this.props.me.displayName)(
          <View style={styles.displayNameContainer}>
            <Text style={styles.displayNameHeader}>SET YOUR CHAT DISPLAY NAME</Text>
            <View style={styles.displayNameInputWrapper}>
              <TextInput
                onChangeText={(displayName) => this.setState({displayName})}
                onSubmitEditing={() => this.onFinishEditingDisplayName()}
                placeholder={placeholder}
                value={this.state.displayName}
                style={styles.displayNameTextInput}
                returnKeyType='done'
                underlineColorAndroid='transparent'
                autoCorrect={false}
              />
              <ActivityIndicator animating={this.state.mutatingDisplayName} size='small' style={styles.mutatingDisplayNameSpinner}/>
            </View>
          </View>
        )}
        {renderIf(this.props.me.displayName)(
          <View style={styles.displayNameContainer}>
            <Text style={styles.displayNameHeader}>YOUR CHAT DISPLAY NAME</Text>
            <Text style={styles.displayName}>{this.props.me.displayName}</Text>
          </View>
        )}
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
        render={({done, error, props, retry}) => {
          if (error) {
            return <GenericErrorScreen retry={retry} />
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

var styles = F8StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
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
    height: 30,
    ios: {
      marginTop: 5,
    },
  },

  displayNameTextInput: {
    height: 30,
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '300',
    color: matterhorn,
    android: {
      paddingBottom: 0,
      paddingTop: 0, // need this for some reason...
    }
  },

  displayName: {
    fontSize: 22,
    color: matterhorn,
    fontWeight: '300',
    textAlign: 'center'
  },

  mutatingDisplayNameSpinner: {
    position: 'absolute',
    right: 0,
    top: 3,
  }
});

export default ChatTabWrapper;
