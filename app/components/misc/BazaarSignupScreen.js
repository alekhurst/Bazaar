import React from 'react';
import {View, Image, TextInput, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {white, primaryColor} from 'hammer/colors';
import {vw} from 'hammer/viewPercentages';

class BazaarSignupScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={this.props.onPressClose}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        >
          <View>
            <Icon name='md-close' size={28} color={white}/>
          </View>
        </TouchableOpacity>
        <Image
          source={require('images/WhiteLogo512px.png')}
          style={styles.logo}
          resizeMode='cover'
        />
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>email</Text>
          <TextInput
            value={this.state.email}
            onChangeText={(email) => this.setState({email})}
            style={styles.input}
            placeholder='email address'
            keyboardType='email-address'
            autoCorrect={false}
            autoCapitalize='none'
            underlineColorAndroid='transparent'
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>password</Text>
          <TextInput
            value={this.state.password}
            onChangeText={(password) => this.setState({password})}
            style={styles.input}
            placeholder='password'
            secureTextEntry
            underlineColorAndroid='transparent'
          />
        </View>
        <TouchableOpacity style={styles.submitContainer}>
          <Text style={styles.submitText}>submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primaryColor
  },

  closeIcon: {
    position: 'absolute',
    top: 20,
    left: 10,
  },

  title: {
    position: 'absolute',
    top: 15,
    width: vw(100),
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: white,
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },

  logo: {
    width: 150,
    height: 150,
    position: 'relative',
    marginTop: -160,
    marginBottom: -25,
  },

  inputContainer: {
    width: 200,
    height: 45,
    marginTop: 5,
  },

  inputLabel: {
    color: white,
    fontSize: 12,
    marginBottom: 2,
  },

  input: {
    alignSelf: 'center',
    borderRadius: 3,
    backgroundColor: white,
    height: 30,
    width: 200,
    paddingLeft: 5,
    ...Platform.select({
      android: {
        paddingTop: 0,
        paddingBottom: 0,
      }
    })
  },

  submitContainer: {
    marginTop: 15,
    width: 100,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: white,
  },

  submitText: {
    color: primaryColor,
    backgroundColor: 'transparent',
  }
})

export default BazaarSignupScreen;
