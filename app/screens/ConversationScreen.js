import React from 'react';
import {ScrollView, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';

import {closeConversationScreen} from 'actions/chat/conversationScreenActions';

import StatusBarBackground from 'components/misc/StatusBarBackground';
import NavigationBar from 'components/misc/NavigationBar';
import {white, whiteSmoke, base, matterhorn} from 'hammer/colors';
import noop from 'hammer/noop';

class ConversationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {messages: []};

    this.onSend = this.onSend.bind(this);
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
          user: {
            _id: 2,
            name: 'React Native',
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
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
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={{
            _id: 1,
          }}
        />
      </View>
    )
  }
}

ConversationScreen = connect()(ConversationScreen);

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
