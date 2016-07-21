'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const common = require('./assets/common.js');
const schema = require('./assets/element.parameter.schema.json');
const listSchema = require('./assets/element.parameters.schema.json');

const opts = { paylod: common.genParameter({}), schema: schema };

suite.forPlatform('elements/resources/parameters', opts, (test) => {
  let element, resource, keyUrl, idUrl;
  before(() => common.deleteElementByKey('churros')
    .then(r => cloud.post('elements', common.genElement({})))
    .then(r => element = r.body)
    .then(r => cloud.post('elements/' + element.key + '/resources', common.genResource({})))
    .then(r => resource = r.body)
    .then(r => keyUrl = 'elements/' + element.key + '/resources/' + resource.id + '/parameters')
    .then(r => idUrl = 'elements/' + element.id + '/resources/' + resource.id + '/parameters'));

  it('should support CRUD by key', () => common.crudSubResource(keyUrl, schema, listSchema, common.genParameter({}), common.genParameter({ description: "An updated Churros parameter" })));
  it('should support CRUD by ID', () => common.crudSubResource(idUrl, schema, listSchema, common.genParameter({}), common.genParameter({ description: "An updated Churros parameter" })));

  it('should support CRUD by key with sample data', () => common.crudSubResource(keyUrl, schema, listSchema, common.genParameter({}), common.genParameter({ description: "An updated Churros parameter", sampleData: "testKey=1" })));
  it('should support CRUD by ID with sample data', () => common.crudSubResource(idUrl, schema, listSchema, common.genParameter({}), common.genParameter({ description: "An updated Churros parameter", sampleData: "testKey=1" })));

  after(() => cloud.delete('elements/' + element.key));
});
