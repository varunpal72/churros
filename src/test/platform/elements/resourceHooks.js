'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const common = require('./assets/common.js');
const schema = require('./assets/element.hook.schema.json');
const listSchema = require('./assets/element.hooks.schema.json');

suite.forPlatform('elements/resources/hooks', common.genHook({}), schema, (test) => {
  let element, resource, keyUrl, idUrl;
  before(() => common.deleteElementByKey('churros')
    .then(r => cloud.post('elements', common.genElement({})))
    .then(r => element = r.body)
    .then(r => cloud.post('elements/' + element.key + '/resources', common.genResource({})))
    .then(r => resource = r.body)
    .then(r => keyUrl = `elements/${element.key}/resources/${resource.id}/hooks`)
    .then(r => idUrl = `elements/${element.id}/resources/${resource.id}/hooks`));

  it('should support CRUD by key', () => common.crudSubResource(keyUrl, schema, listSchema, common.genHook({}), common.genHook({ description: "An updated Churros hook" })));
  it('should support CRUD by ID', () => common.crudSubResource(idUrl, schema, listSchema, common.genHook({}), common.genHook({ description: "An updated Churros hook" })));

  after(() => cloud.delete('elements/' + element.key));
});
