import React from 'react';
import {ScrollView, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import Firebase from 'firebase';

import {closeConversationScreen} from 'actions/chat/conversationScreenActions';

import StatusBarBackground from 'components/misc/StatusBarBackground';
import GenericLoadingScreen from 'screens/GenericLoadingScreen'
import NavigationBar from 'components/misc/NavigationBar';
import {white, whiteSmoke, base, matterhorn} from 'hammer/colors';
import renderIf from 'hammer/renderIf';
import noop from 'hammer/noop';

class ConversationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadingMessages: true,
    };

    this.onMessagesValueChange= this.onMessagesValueChange.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  componentWillMount() {
    this._firebaseMessagesRef = Firebase.database().ref('/messages/alek-jason')
    this._firebaseMessagesRef.on('value', this.onMessagesValueChange);
  }

  componentWillUnmount() {
    this._firebaseMessagesRef.off('value', this.onMessagesValueChange);
  }

  onMessagesValueChange(snapshot) {
    var data = snapshot.val();
    var keys = Object.keys(data);
    var messages = keys.map((key) => {
      return {
        _id: key,
        text: data[key].text,
        createdAt: data[key].sentAt,
        user: {
          _id: data[key].sender,
        }
      }
    }).reverse();

    this.setState({
      loadingMessages: false,
      messages
    });
  }

  onSend(messages = []) {
    if (!messages.length) return;
    var timestamp = new Date().getTime();

    Firebase.database().ref('/messages/alek-jason').push({
      sender: messages[0].user._id,
      sentAt: timestamp,
      text: messages[0].text
    });

    Firebase.database().ref('/chats/oneToOne/alek-jason').update({
      lastMessage: messages[0].text,
      updatedAt: timestamp,
    })
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBarBackground />
        <NavigationBar style={{justifyContent: 'center'}}>
          <Text style={styles.title}>Conversation</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => this.props.dispatch(closeConversationScreen())}>
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
            renderAvatar={() => null}
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
  return {userId: state.userCredentials.userId}
}

ConversationScreen = connect(mapStateToProps)(ConversationScreen);

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
})

export default ConversationScreen;
