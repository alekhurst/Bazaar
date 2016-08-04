import React from 'react';
import {ScrollView, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

import {openConversationScreen} from 'actions/chat/conversationScreenActions';

import {whiteSmoke, base, matterhorn} from 'hammer/colors';

var ConversationList = ({dispatch}) => (
  <ScrollView style={styles.container}>
    <TouchableOpacity style={styles.conversationRow} onPress={() => dispatch(openConversationScreen())}>
      <View style={styles.circle}/>
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>Cowflickerr</Text>
        <Text style={styles.lastMessage}>Did you get in?</Text>
      </View>
    </TouchableOpacity>
  </ScrollView>
)

ConversationList = connect()(ConversationList);

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

export default ConversationList;
