import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {primaryColor, ghost, gainsboro} from 'hammer/colors';

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

  render() {
    return <View style={[styles.tabs, this.props.style]}>
      {this.state.tabs.map((tab, i) => {
        return <TouchableHighlight key={i} onPress={() => this.props.goToPage(i)} style={styles.tab} underlayColor='transparent'>
          <Icon
            name={tab}
            size={30}
            color={this.props.activeTab === i ? primaryColor : gainsboro}
          />
        </TouchableHighlight>;
      })}
    </View>;
  },
});

const styles = StyleSheet.create({
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
  },
});

export default TabBar;
