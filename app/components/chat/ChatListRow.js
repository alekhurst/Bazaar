import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux';
import Firebase from 'firebase';

import {openChatScreen} from 'actions/chat/chatScreenActions';
import UserRoute from 'routes/UserRoute';

import GenericLoadingScreen from 'screens/GenericLoadingScreen';
import GenericErrorScreen from 'screens/GenericErrorScreen';
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
    var data = snapshot.val();
    var lastMessage = data.lastMessage ? data.lastMessage : 'none';
    var updatedAt = data.updatedAt ? data.updatedAt : 'none';

    this.setState({
      lastMessage,
      updatedAt,
    })
  }

  render() {
    var displayNameToShow = this.props.user.id === this.props.userId ? 'Yourself' : this.props.user.displayName;

    return (
      <TouchableOpacity style={styles.chatRow} onPress={() => this.props.dispatch(openChatScreen(this.props.chatId, displayNameToShow))}>
        <View style={styles.circle}/>
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{displayNameToShow}</Text>
          <Text style={styles.lastMessage}>{this.state.lastMessage ? this.state.lastMessage : 'loading...'}</Text>
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
    this._firebaseChatMembersRef = Firebase.database().ref(`/chatMembers/${this.props.chatId}`)
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
        render={({done, error, props}) => {
          if (error) {
            return <GenericErrorScreen />
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
  chatRow: {
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

export default ChatListRowWrapper;
