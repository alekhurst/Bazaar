// 'use strict'
//
// const getBabelRelayPlugin = require('babel-relay-plugin')
// const introspectionQuery = require('graphql/utilities').introspectionQuery
// const request = require('sync-request')
//
// const url = 'https://zeemee.com/api/graph_schema.json'
//
// const response = request('POST', url, {
//   qs: {
//     query: introspectionQuery
//   }
// })
//
// const schema = JSON.parse(response.body.toString('utf-8'))
//
// module.exports = getBabelRelayPlugin(schema.data, { abortOnError: true })

var getbabelRelayPlugin = require('babel-relay-plugin');
var schema = require('./graph_schema.json');

module.exports = getbabelRelayPlugin(schema.data);
