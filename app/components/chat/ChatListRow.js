import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {openChatScreen} from 'actions/chat/chatScreenActions';
import {incrementUnreadCount} from 'actions/chat/unreadCountActions';
import UserRoute from 'routes/UserRoute';

import FirebaseApp from 'hammer/FirebaseApp';
import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import GenericErrorScreen from 'screens/GenericErrorScreen';
import getDisplayNamePlaceholderFromUserId from 'hammer/getDisplayNamePlaceholderFromUserId';
import {white, whiteSmoke, base, matterhorn, primaryColor} from 'hammer/colors';
import {vw, vh} from 'hammer/viewPercentages';
import renderIf from 'hammer/renderIf';
import getColorFromUserId from 'hammer/getColorFromUserId';

class ChatListRow extends React.Component {
  constructor(props) {
    super(props);

    this.onFirebaseChatValueChange = this.onFirebaseChatValueChange.bind(this);
    this.onPressOpenChat = this.onPressOpenChat.bind(this);

    this.state = {
      lastMessage: '',
      haveReadLatestMessage: true,
    }
  }

  componentWillMount() {
    this._firebaseChatRef = FirebaseApp.ref(`/chats/${this.props.chatId}`)
    this._firebaseChatRef.on('value', this.onFirebaseChatValueChange);
  }

  componentWillUnmount() {
    this._firebaseChatRef.off('value', this.onFirebaseChatValueChange);
  }

  onFirebaseChatValueChange(snapshot) {
    var data = snapshot.val();

    if (!data) {
      return this.setState({
        lastMessage: null,
        haveReadLatestMessage: true,
      });
    }

    var lastMessage = data.lastMessage;
    var updatedAt = data.updatedAt;
    var lastChecked = get(data.lastChecked, this.props.userId, null)
    var haveReadLatestMessage;

    if (!updatedAt || lastChecked > updatedAt) {
      haveReadLatestMessage = true;
    } else if (!lastChecked || lastChecked < updatedAt) {
      haveReadLatestMessage = false;
    } else {
      // shouldn't get here, but if you do default to true
      haveReadLatestMessage = true;
    }

    if (!haveReadLatestMessage && this.state.haveReadLatestMessage) {
      // for now only increment the unread count on the first received unread msg
      this.props.dispatch(incrementUnreadCount())
    }

    this.setState({
      haveReadLatestMessage,
      lastMessage: lastMessage ? lastMessage : null,
    })
  }

  onPressOpenChat(chatTitle) {
    this.props.dispatch(openChatScreen(this.props.chatId, chatTitle));
  }

  render() {
    if (this.state.lastMessage === null) {
      // only null if there are actually no messages. If they are
      // still loading, this.state.lastMessage will be undefined or ''
      return null;
    }

    var displayNameToShow;
    if (!this.props.user.displayName) {
      displayNameToShow = getDisplayNamePlaceholderFromUserId(this.props.user.id);
    } else { // display name present & it's not me
      displayNameToShow = this.props.user.displayName
    }

    return (
      <TouchableOpacity style={styles.chatRowContainer} onPress={() => this.onPressOpenChat(displayNameToShow)}>
        <View style={styles.unreadIndicatorContainer}>
          {renderIf(!this.state.haveReadLatestMessage)(
            <View style={styles.unreadIndicator} />
          )}
        </View>
        <View style={styles.chatRow}>
          <View style={[styles.circle, {backgroundColor: getColorFromUserId(this.props.user.id)}]}>
            <Text style={styles.circleText}>{displayNameToShow.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.name} numberOfLines={1}>{displayNameToShow}</Text>
            <Text style={styles.lastMessage} numberOfLines={2}>
              {/* initialized to '', which gets casted to false */}
              {this.state.lastMessage ? this.state.lastMessage : 'loading...'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

function mapStateToPropsInner(state) {
  return {userId: state.userCredentials.userId}
}

ChatListRow = connect(mapStateToPropsInner)(ChatListRow);

ChatListRow = Relay.createContainer(ChatListRow, {
  fragments: {
    user() {
      return Relay.QL`
        fragment on User {
          id,
          displayName,
        }
      `;
    },
  },
});

class ChatListRowWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.onFirebaseChatMembersValueChange = this.onFirebaseChatMembersValueChange.bind(this);

    this.state = {
      otherUserId: null
    }
  }

  componentWillMount() {
    this._firebaseChatMembersRef = FirebaseApp.ref(`/chatMembers/${this.props.chatId}`)
    this._firebaseChatMembersRef.once('value', this.onFirebaseChatMembersValueChange);
  }

  onFirebaseChatMembersValueChange(snapshot) {
    var data = snapshot.val();

    if (!data) {
      // TODO: come up with UX for this error
      console.error('onFirebaseChatMembersValueChange Error: No snapshot data')
      return;
    }

    var memberIds = data ? Object.keys(data) : []

    var otherUserId;
    if (memberIds.length > 1) {
      // this is a chat between 2 people
      otherUserId = memberIds[0] === this.props.userId ? memberIds[1] : memberIds[0]
    } else {
      // this is a chat with myself
      otherUserId = memberIds[0]
    }

    this.setState({otherUserId})
  }

  render() {
    if (!this.state.otherUserId) {
      // TODO: Implement loading state from firebase
      return null;
    }

    return (
      <Relay.Renderer
        Container={ChatListRow}
        environment={Relay.Store}
        queryConfig={new UserRoute({userId: this.state.otherUserId})}
        render={({done, error, props, retry}) => {
          if (error) {
            return <GenericErrorScreen retry={retry} />
          } else if (props) {
            return <ChatListRow chatId={this.props.chatId} {...props} />
          } else {
            // TODO: Implement loading state from firebase
          }
        }}
      />
    );
  }
};

function mapStateToProps(state) {
  return {userId: state.userCredentials.userId}
}

ChatListRowWrapper = connect(mapStateToProps)(ChatListRowWrapper);

var styles = StyleSheet.create({
  chatRowContainer: {
    flexDirection: 'row',
  },

  chatRow: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderBottomColor: whiteSmoke,
  },

  unreadIndicatorContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  unreadIndicator: {
    width: 12,
    height: 12,
    backgroundColor: primaryColor,
    borderRadius: 6,
  },

  circle: {
    width: 57,
    height: 57,
    backgroundColor: whiteSmoke,
    borderRadius: 28.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleText: {
    color: white,
    fontSize: 32,
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
    width: vw(100) - 120,
  },

  lastMessage: {
    color: base,
    fontSize: 13,
    width: vw(100) - 120,
  }
})

export default ChatListRowWrapper;
