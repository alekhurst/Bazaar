import React from 'react';
import {ScrollView, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {GiftedChat} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import Firebase from 'firebase';

import {closeChatScreen} from 'actions/chat/chatScreenActions';

import StatusBarBackground from 'components/misc/StatusBarBackground';
import GenericLoadingScreen from 'screens/GenericLoadingScreen'
import NavigationBar from 'components/misc/NavigationBar';
import {white, gainsboro} from 'hammer/colors';
import renderIf from 'hammer/renderIf';
import noop from 'hammer/noop';

class ChatScreen extends React.Component {
  propTypes: {
    chatId: React.PropTypes.string.isRequired,
    chatTitle: React.PropTypes.string.isRequired,
    userId: React.PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadingMessages: true,
    };

    this.onMessagesValueChange= this.onMessagesValueChange.bind(this);
    this.onSend = this.onSend.bind(this);
    this.renderAvatar = this.renderAvatar.bind(this);
  }

  componentWillMount() {
    this._firebaseMessagesRef = Firebase.database().ref(`/messages/${this.props.chatId}`)
    this._firebaseMessagesRef.on('value', this.onMessagesValueChange);
  }

  componentWillUnmount() {
    this._firebaseMessagesRef.off('value', this.onMessagesValueChange);
  }

  onMessagesValueChange(snapshot) {
    var data = snapshot.val();

    if (!data) {
      return this.setState({
        loadingMessages: false,
        messages: []
      });
    }

    var keys = Object.keys(data)

    var messages = keys.map((key) => {
      return {
        _id: key,
        text: data[key].text,
        createdAt: data[key].sentAt,
        user: {
          _id: data[key].sender,
        }
      }
    }).sort((a, b) => b.createdAt - a.createdAt);

    this.setState({
      loadingMessages: false,
      messages: messages,
    });
  }

  onSend(messages = []) {
    if (!messages.length) return;
    var timestamp = new Date().getTime();

    Firebase.database().ref(`/messages/${this.props.chatId}`).push({
      sender: messages[0].user._id,
      sentAt: timestamp,
      text: messages[0].text
    });

    Firebase.database().ref(`/chats/oneToOne/${this.props.chatId}/lastChecked/`).update({
      [this.props.userId]: timestamp,
    }, (err) => {
      Firebase.database().ref(`/chats/oneToOne/${this.props.chatId}`).update({
        lastMessage: messages[0].text,
        updatedAt: timestamp,
      })
    });
  }

  renderAvatar() {
    return (
      <View style={[styles.avatar]}>
        <Text style={styles.avatarText}>{this.props.chatTitle.charAt(0)}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBarBackground />
        <NavigationBar style={{justifyContent: 'center'}}>
          <Text style={styles.title}>{this.props.chatTitle}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => this.props.dispatch(closeChatScreen())}>
            <Icon name='ios-arrow-back' size={32} color={white} />
          </TouchableOpacity>
        </NavigationBar>
        {renderIf(this.state.loadingMessages)(
          <GenericLoadingScreen />
        )}
        {renderIf(!this.state.loadingMessages)(
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            renderAvatar={() => this.renderAvatar()}
            user={{
              _id: this.props.userId,
            }}
          />
        )}
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    userId: state.userCredentials.userId,
    chatId: state.chatScreen.chatId,
    chatTitle: state.chatScreen.chatTitle,
  }
}

ChatScreen = connect(mapStateToProps)(ChatScreen);

var styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 5,
    left: 10,
  },

  title: {
    textAlign: 'center',
    color: white,
    fontSize: 16,
    fontWeight: '600'
  },

  avatar: {
    width: 37,
    height: 37,
    borderRadius: 18.5,
    backgroundColor: gainsboro,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: white,
    fontSize: 19,
  }
})

export default ChatScreen;
