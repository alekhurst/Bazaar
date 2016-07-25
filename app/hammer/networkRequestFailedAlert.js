import {Alert} from 'react-native';
import noop from 'hammer/noop';

export default function () {
  Alert.alert(
    `Network Request Failed`,
    'Your request to our server failed, we\'re onto it!',
    [
      {text: 'OK', onPress: noop},
    ]
  );
}
