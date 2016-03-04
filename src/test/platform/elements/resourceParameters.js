'use strict';

const util = require('util');
const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const props = require('core/props');
const provisioner = require('core/provisioner');
const common = require('./assets/common.js');
const schema = require('./assets/element.parameter.schema.json');
const listSchema = require('./assets/element.parameters.schema.json');



suite.forPlatform('elements/resources/parameters', common.genParameter({}), schema, (test) => {
  let element, resource, keyUrl, idUrl;
  before(done => cloud.post('elements', common.genElement({}))
    .then(r => element = r.body)
    .then(r => cloud.post('elements/' + element.key + '/resources', common.genResource({}))
    .then(r => resource = r.body))
    .then(r => keyUrl = 'elements/' + element.key + '/resources/' + resource.id + '/parameters')
    .then(r => idUrl = 'elements/' + element.id + '/resources/' + resource.id + '/parameters')
    .then(r => done()));

  it('should support CRUD by key', () => common.crudSubResource(keyUrl, schema, listSchema, common.genParameter({}), common.genParameter({ description: "An updated Churros parameter" })));
  //it('should support CRUD by ID', () => common.crudSubResource(idUrl, schema, listSchema, common.genParameter({}), common.genParameter({ description: "An updated Churros parameter" })));

  after(done => { cloud.delete('elements/' + element.key).then(() => done()) });
});
