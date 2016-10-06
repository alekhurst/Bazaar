'use strict'
var serverUrl = 'https://bazaar-api-stg.herokuapp.com'
//var serverUrl = 'https://bazaar-api-prod.herokuapp.com'

const getBabelRelayPlugin = require('babel-relay-plugin')
const introspectionQuery = require('graphql/utilities').introspectionQuery
const request = require('sync-request')

const url = `${serverUrl}/api/graph_schema?graphiql=true`;

const response = request('GET', url, {
  headers: {
    'X-User-Email': 'graphiql@bazaar.net',
    'X-User-Token': 'mWgX37qKmPl-UfaESZM9QZm7MYD9SlF7IVrHF68-QoM'
  },
  qs: {
    query: introspectionQuery
  }
})

const schema = JSON.parse(response.body.toString('utf-8'))

module.exports = getBabelRelayPlugin(schema.data, { abortOnError: true });

// var getbabelRelayPlugin = require('babel-relay-plugin');
// var schema = require('./graph_schema.json');
//
// module.exports = getbabelRelayPlugin(schema.data);
