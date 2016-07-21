import React from 'react';
import {View} from 'react-native';

import {primaryColor} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';

var NavigationBar = React.createClass({
  render() {
    return (
      <View style={{height: 43, width: vw(100), backgroundColor: primaryColor}}>
        {this.props.children}
      </View>
    )
  }
});

export default NavigationBar;
