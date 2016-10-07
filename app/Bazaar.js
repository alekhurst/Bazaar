import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import codePush from "react-native-code-push";

import bazaarStore from 'reducers/index';
import AppRoot from 'roots/AppRoot';

let store = createStore(bazaarStore, applyMiddleware(thunk))

class Bazaar extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppRoot />
      </Provider>
    );
  }
}

Bazaar = codePush(Bazaar);

export default Bazaar;
