'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const common = require('./assets/common.js');
const schema = require('./assets/element.model.schema.json');

const crudModels = (url, schema) => {
  let model;
  return cloud.post(url, common.genModel({}), schema)
    .then(r => model = r.body)
    .then(r => cloud.get(url, schema))
    .then(r => cloud.put(url, common.genModel({ name: 'updatedName' }), schema))
    .then(r => cloud.delete(url));
};

suite.forPlatform('elements/resources/models', common.genParameter({}), schema, (test) => {
  let element, resource, keyUrl, idUrl;
  before(() => common.deleteElementByKey('churros')
    .then(r => cloud.post('elements', common.genElement({})))
    .then(r => element = r.body)
    .then(r => cloud.post(`elements/${element.key}/resources`, common.genResource({})))
    .then(r => resource = r.body)
    .then(r => keyUrl = `elements/${element.key}/resources/${resource.id}/models`)
    .then(r => idUrl = `elements/${element.id}/resources/${resource.id}/models`));

  it('should support CRUD by key', () => crudModels(keyUrl, schema));
  it('should support CRUD by ID', () => crudModels(idUrl, schema));

  after(() => cloud.delete('elements/' + element.key));
});
