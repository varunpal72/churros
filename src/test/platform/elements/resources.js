'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const common = require('./assets/common.js');
const schema = require('./assets/element.resource.schema.json');
const listSchema = require('./assets/element.resources.schema.json');

const opts = { payload: common.genResource({}), schema: schema };

suite.forPlatform('elements/resources', opts, (test) => {
  let element, keyUrl, idUrl;
  before(() => common.deleteElementByKey('churros')
    .then(r => cloud.post('elements', common.genElement({})))
    .then(r => element = r.body)
    .then(r => keyUrl = `elements/${element.key}/resources`)
    .then(r => idUrl = `elements/${element.id}/resources`));

  it('should support CRUD by key', () => common.crudSubResource(keyUrl, schema, listSchema, common.genResource({}), common.genResource({ description: "An updated Churros resource" })));
  it('should support CRUD by ID', () => common.crudSubResource(idUrl, schema, listSchema, common.genResource({}), common.genResource({ description: "An updated Churros resource" })));

  after(() => cloud.delete(`elements/${element.key}`));
});
