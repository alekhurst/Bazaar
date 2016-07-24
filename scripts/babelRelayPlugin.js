'use strict'
var serverUrl = 'https://powerful-plains-21017.herokuapp.com'

const getBabelRelayPlugin = require('babel-relay-plugin')
const introspectionQuery = require('graphql/utilities').introspectionQuery
const request = require('sync-request')

const url = `${serverUrl}/api/graph_schema?graphiql=true`;

const response = request('GET', url, {
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
