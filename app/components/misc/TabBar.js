import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import {primaryColor, primaryRed, white, ghost, gainsboro} from 'hammer/colors';
import renderIf from 'hammer/renderIf';
import F8StyleSheet from 'hammer/F8StyleSheet';

const TabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
  },

  getInitialState() {
    return {
      tabs: ['md-list-box', 'md-person', 'md-chatboxes']
    }
  },

  renderTabIcon(tab, i) {
    if (i !== 2) {
      return (
        <Icon
          name={tab}
          size={30}
          color={this.props.activeTab === i ? primaryColor : gainsboro}
        />
      )
    } else if (i === 2) {
      return (
        <View style={styles.chatTabContainer}>
          <Icon
            name={tab}
            size={30}
            color={this.props.activeTab === i ? primaryColor : gainsboro}
          />
          {renderIf(this.props.unreadCount)(
            <View style={styles.unreadCount}>
              <Text style={styles.unreadCountText}>{this.props.unreadCount}</Text>
            </View>
          )}
        </View>
      )
    }
  },

  render() {
    return <View style={[styles.tabs, this.props.style]}>
      {this.state.tabs.map((tab, i) => {
        return <TouchableHighlight key={i} onPress={() => this.props.goToPage(i)} style={styles.tab} underlayColor='transparent'>
          {this.renderTabIcon(tab, i)}
        </TouchableHighlight>;
      })}
    </View>;
  },
});

function mapStateToProps(state) {
  return {unreadCount: state.chat.unreadCount}
}

TabBar = connect(mapStateToProps)(TabBar);

const styles = F8StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },

  tabs: {
    height: 45,
    flexDirection: 'row',
    paddingTop: 14,
    backgroundColor: ghost,
    android: {
      paddingTop: 3,
      marginTop: 11,
      paddingHorizontal: 10,
    }
  },

  chatTabContainer: {
    flexDirection: 'row'
  },

  unreadCount: {
    position: 'absolute',
    right: -8,
    top: -1,
    backgroundColor: primaryRed,
    paddingHorizontal: 5,
    height: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    android: {
      position: 'relative',
      right: 5,
      top: 1,
    }
  },

  unreadCountText: {
    color: white,
    fontSize: 8,
  }
});

export default TabBar;
