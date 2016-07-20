import React from 'react';
import {View} from 'react-native';

import {primaryColor} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';

var StatusBarBackground = React.createClass({
  render() {
    return <View style={{height: 20, width: vw(100), backgroundColor: primaryColor}} />
  }
});

export default StatusBarBackground;
