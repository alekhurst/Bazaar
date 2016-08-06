import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import Firebase from 'firebase';

import {openConversationScreen} from 'actions/chat/conversationScreenActions';

import {whiteSmoke, base, matterhorn} from 'hammer/colors';

class ChatListRow extends React.Component {
  constructor(props) {
    super(props);

    this.onFirebaseChatValueChange = this.onFirebaseChatValueChange.bind(this);

    this.state = {
      lastMessage: null,
      updatedAt: null,
    }
  }

  componentWillMount() {
    this._firebaseChatRef = Firebase.database().ref(`/chats/oneToOne/${this.props.chatId}`)
    this._firebaseChatRef.on('value', this.onFirebaseChatValueChange);
  }

  componentWillUnmount() {
    this._firebaseChatRef.off('value', this.onFirebaseChatValueChange);
  }

  onFirebaseChatValueChange(snapshot) {
    var {lastMessage, updatedAt} = snapshot.val();

    this.setState({
      lastMessage,
      updatedAt,
    })
  }

  render() {
    return (
      <TouchableOpacity style={styles.conversationRow} onPress={() => this.props.dispatch(openConversationScreen())}>
        <View style={styles.circle}/>
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{this.props.chatId}</Text>
          <Text style={styles.lastMessage}>{this.state.lastMessage ? this.state.lastMessage : 'loading...'}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

ChatListRow = connect()(ChatListRow);

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conversationRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 5,
    borderBottomColor: whiteSmoke,
  },

  circle: {
    width: 65,
    height: 65,
    backgroundColor: whiteSmoke,
    borderRadius: 32.5,
  },

  detailsContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },

  name: {
    fontSize: 17,
    fontWeight: '600',
    color: matterhorn,
  },

  lastMessage: {
    color: base,
    fontSize: 13,
  }
})

export default ChatListRow;
