'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const common = require('./assets/common.js');
const schema = require('./assets/element.configuration.schema.json');
const listSchema = require('./assets/element.configurations.schema.json');

const crudConfig = (idOrKey, payload, updatePayload, schema, listSchema) => {
  let config;
  return cloud.post('elements/' + idOrKey + '/configuration', payload, schema)
    .then(r => config = r.body)
    .then(r => cloud.get('elements/' + idOrKey + '/configuration', listSchema))
    .then(r => cloud.put('elements/' + idOrKey + '/configuration/' + config.key, updatePayload))
    .then(r => cloud.delete('elements/' + idOrKey + '/configuration/' + config.key));
};

suite.forPlatform('elements/configuration', common.genConfig({}), schema, (test) => {
  let element;
  before(() => common.deleteElementByKey('churros')
    .then(r => cloud.post('elements', common.genElement({})))
    .then(r => element = r.body));

  it('should support CRUD by key', () => crudConfig(element.key, common.genConfig({}), common.genConfig({ description: "An updated Churros config" }), schema, listSchema));
  it('should support CRUD by ID', () => crudConfig(element.id, common.genConfig({}), common.genConfig({ description: "An updated Churros config" }), schema, listSchema));

  after(() => cloud.delete(`elements/${element.key}`));
});
