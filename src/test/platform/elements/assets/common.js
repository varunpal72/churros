'use strict';

const tools = require('core/tools');
const chakram = require('chakram');
const util = require('util');
const cloud = require('core/cloud');

var exports = module.exports = {};

exports.genElement = (opts) => new Object({
  name: (opts.name || 'Churros'),
  description: (opts.description || "A Churros element"),
  authentication: (opts.authentication) || {
    type: 'basic'
  },
  configuration: (opts.configuration) || [ exports.genBaseUrlConfig({}) ]
});

exports.genConfig = (opts) => new Object({
  name: (opts.name || 'Churros Config'),
  key: (opts.key || 'churros.config'),
  description: (opts.description || 'A Churros config'),
  type: 'BOOLEAN'
});

exports.genBaseUrlConfig = (opts) => new Object({
  name: (opts.name || 'Base URL'),
  key: 'base.url',
  description: (opts.description || 'The base URL'),
  defaultValue: 'http://fake.churros.url.com',
  type: 'TEXTFIELD_1000'
});

exports.genResource = (opts) => new Object({
  path: (opts.path || '/churros'),
  method: (opts.method || 'GET'),
  vendorPath: (opts.path || '/getChurros'),
  vendorMethod: (opts.vendorMethod || 'GET'),
  description: (opts.description || 'A Churros resource')
});

exports.genParameter = (opts) => new Object({
  name: (opts.name || 'param'),
  type: (opts.type || 'query'),
  vendorName: (opts.vendorName || 'theParam'),
  vendorType: (opts.vendorType || 'query'),
  description: (opts.description || 'A Churros parmeter'),
  dataType: 'string',
  vendorDataType: 'string'
});

exports.genModel = (opts) => new Object({
  name: (opts.name || 'model'),
  swagger: (opts.swagger) || {}
});

exports.genHook = (opts) => new Object({
  mimeType: (opts.mimeType || 'application/javascript'),
  type: (opts.type || 'preRequest'),
  body: (opts.body || 'return {"hello": "world"}')
});

exports.crudSubResource = (url, schema, listSchema, payload, updatePayload) => {
  let subResource;
  return cloud.post(url, payload, schema)
    .then(r => subResource = r.body)
    .then(r => cloud.get(url, listSchema))
    .then(r => cloud.put(url + '/' + subResource.id, updatePayload, schema))
    .then(r => cloud.delete(url + '/' + subResource.id));
};