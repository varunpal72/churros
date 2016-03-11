'use strict';

const util = require('util');
const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const props = require('core/props');
const provisioner = require('core/provisioner');
const common = require('./assets/common.js');
const schema = require('./assets/element.resource.schema.json');
const listSchema = require('./assets/element.resources.schema.json');

suite.forPlatform('elements/resources', common.genResource({}), schema, (test) => {
  let element, keyUrl, idUrl;
  before(done => cloud.post('elements', common.genElement({}))
  .then(r => element = r.body)
  .then(r => keyUrl = 'elements/' + element.key + '/resources')
  .then(r => idUrl = 'elements/' + element.id + '/resources')
  .then(r => done()));

  it('should support CRUD by key', () => common.crudSubResource(keyUrl, schema, listSchema, common.genResource({}), common.genResource({ description: "An updated Churros resource" })));

  after(done => { cloud.delete('elements/' + element.key).then(() => done()) });

});
