import React from 'react';
import {ScrollView, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import Relay from 'react-relay';
import Icon from 'react-native-vector-icons/Ionicons';
import {get, uniqBy} from 'lodash';

import {closeStartChatScreen} from 'actions/startChatScreenActions';
import {openChatScreen} from 'actions/chat/chatScreenActions';
import ViewerRoute from 'routes/ViewerRoute';

import FirebaseApp, {SERVER_TIMESTAMP} from 'hammer/FirebaseApp';
import StatusBarBackground from 'components/misc/StatusBarBackground';
import GenericLoadingScreen from 'screens/GenericLoadingScreen'
import NavigationBar from 'components/misc/NavigationBar';
import getDisplayNamePlaceholderFromUserId from 'hammer/getDisplayNamePlaceholderFromUserId';
import {white, whiteSmoke, gainsboro, matterhorn} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';

class StartChatScreen extends React.Component {
  constructor(props) {
    super(props)
    this.onPressStartChat = this.onPressStartChat.bind(this)
  }

  componentWillMount() {
    this.props.relay.forceFetch({
      latitude: this.props.reduxLocation.latitude,
      longitude: this.props.reduxLocation.longitude,
    });
  }

  onPressStartChat(displayName, id) {
    var otherUser = id;
    var user = this.props.userId;
    var newChatId = [otherUser, user].sort().join(':');

    var newChatTitle;
    if (!displayName) {
      newChatTitle = getDisplayNamePlaceholderFromUserId(id)
    } else { // display name present & it's not me
      newChatTitle = displayName
    }

    FirebaseApp.ref(`/chats/${newChatId}`).update({
      createdAt: SERVER_TIMESTAMP
    })

    FirebaseApp.ref(`/userChats/${otherUser}/${newChatId}`).set(true)
    FirebaseApp.ref(`/userChats/${user}/${newChatId}`).set(true)

    var firebaseChatMembersDataToSet = {};
    firebaseChatMembersDataToSet[user] = true;
    firebaseChatMembersDataToSet[otherUser] = true;
    FirebaseApp.ref(`/chatMembers/${newChatId}`).set(firebaseChatMembersDataToSet)

    this.props.dispatch(closeStartChatScreen());
    this.props.dispatch(openChatScreen(newChatId, newChatTitle));
  }

  render() {
    var edges = get(this.props.viewer.listingsSearch, 'edges', []);

    var uniqueEdges = uniqBy(edges, e => e.node.user.id);

    return (
      <View style={{flex: 1}}>
        <StatusBarBackground />
        <NavigationBar style={{justifyContent: 'center'}}>
          <Text style={styles.title}>Create A Chat</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => this.props.dispatch(closeStartChatScreen())}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 30}}
          >
            <Icon name='ios-arrow-back' size={32} color={white} />
          </TouchableOpacity>
        </NavigationBar>
        <View style={styles.resultsHeaderContainer}>
          <View style={styles.resultesHeaderLine} />
          <Text style={styles.resultsHeaderText}>People Near You</Text>
          <View style={styles.resultesHeaderLine} />
        </View>
        <ScrollView>
          {uniqueEdges.map((edge, i) => {
            let newChatTitle;
            if (!edge.node.user.displayName) {
              newChatTitle = getDisplayNamePlaceholderFromUserId(edge.node.user.id)
            } else { // display name present & it's not me
              newChatTitle = edge.node.user.displayName
            }

            return (
              <TouchableOpacity style={styles.row} key={i} onPress={() => this.onPressStartChat(edge.node.user.displayName, edge.node.user.id)}>
                <View style={styles.rowInner}>
                  <Text style={{color: matterhorn, fontSize: 20, marginLeft: 10,}}>{newChatTitle}</Text>
                  <Text style={{position: 'absolute', right: 0, top: 15, color: gainsboro, marginRight: 10,}}>{Math.ceil(edge.node.user.distanceFromMe)}km</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    )
  }
}

function mapStateToProps1(state) {
  return {userId: state.userCredentials.userId,reduxLocation: state.location}
}

StartChatScreen = connect(mapStateToProps1)(StartChatScreen);

StartChatScreen = Relay.createContainer(StartChatScreen, {
  initialVariables: {
    searchText: 10,
    firstN: 10,
    latitude: 37.4852778,
    longitude: -122.2352778,
  },

  fragments: {
    viewer() {
      return Relay.QL`
        fragment on Viewer {
          listingsSearch(first: 20, radius: 100, latitude: $latitude, longitude: $longitude) {
            edges {
              node {
                id,
                user {
                  distanceFromMe,
                  displayName,
                  id,
                }
              }
            }
          }
        }
      `;
    },
  },
});

var StartChatScreenWrapper = React.createClass({
  render() {
    var latitude = get(this.props, 'reduxLocation.latitude', null);
    var longitude = get(this.props, 'reduxLocation.longitude', null);
    var locationIsEmpty = !latitude || !longitude;

    if (locationIsEmpty) {
      return <GenericLoadingScreen />
    }

    return (
      <Relay.Renderer
        Container={StartChatScreen}
        environment={Relay.Store}
        queryConfig={new ViewerRoute()}
        forceFetch
        render={({done, error, props, retry}) => {
          if (error) {
            return <GenericErrorScreen retry={retry} />
          } else if (props) {
            return <StartChatScreen {...props} />
          } else {
            return <GenericLoadingScreen />
          }
        }}
      />
    );
  },
});

function mapStateToProps(state) {
  return {reduxLocation: state.location}
}

StartChatScreenWrapper = connect(mapStateToProps)(StartChatScreenWrapper);

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

  rowInner: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    marginTop: 5,
    borderBottomColor: whiteSmoke,
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },

  resultsHeaderContainer: {
    width: vw(100),
    flexDirection: 'row',
    paddingTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: white,
  },

  resultesHeaderLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 10,
    backgroundColor: whiteSmoke,
  },

  resultsHeaderText: {
    fontSize: 12,
    color: matterhorn,
    fontWeight: '300',
    marginHorizontal: 10,
  }
})

export default StartChatScreenWrapper;
