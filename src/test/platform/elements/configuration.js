'use strict';

const util = require('util');
const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const props = require('core/props');
const provisioner = require('core/provisioner');
const common = require('./assets/common.js');
const schema = require('./assets/element.configuration.schema.json');
const listSchema = require('./assets/element.configurations.schema.json');

suite.forPlatform('elements/configuration', common.genConfig({}), schema, (test) => {
  let element;
  before(done => cloud.post('elements', common.genElement({}))
  .then(r => element = r.body)
  .then(r => done()));

  it('should support CRUD by key', () => crudConfig(element.key, common.genConfig({}), common.genConfig({ description: "An updated Churros config" }), schema, listSchema));
  it('should support CRUD by ID', () => crudConfig(element.id, common.genConfig({}), common.genConfig({ description: "An updated Churros config" }), schema, listSchema));

  after(done => { cloud.delete('elements/' + element.key).then(() => done()) });
});

const crudConfig = (idOrKey, payload, updatePayload, schema, listSchema) => {
  let config;
  return cloud.post('elements/' + idOrKey + '/configuration', payload, schema)
  .then(r => config = r.body)
  .then(r => cloud.get('elements/' + idOrKey + '/configuration', listSchema))
  .then(r => cloud.put('elements/' + idOrKey + '/configuration/' + config.key, updatePayload))
  .then(r => cloud.delete('elements/' + idOrKey + '/configuration/' + config.key));
};