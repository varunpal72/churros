'use strict';

const util = require('util');
const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const props = require('core/props');
const provisioner = require('core/provisioner');
const common = require('./assets/common.js');
const schema = require('./assets/element.model.schema.json');



suite.forPlatform('elements/resources/models', common.genParameter({}), schema, (test) => {
  let element, resource, keyUrl, idUrl;
  before(done => cloud.post('elements', common.genElement({}))
    .then(r => element = r.body)
    .then(r => cloud.post('elements/' + element.key + '/resources', common.genResource({}))
    .then(r => resource = r.body))
    .then(r => keyUrl = 'elements/' + element.key + '/resources/' + resource.id + '/models')
    .then(r => idUrl = 'elements/' + element.id + '/resources/' + resource.id + '/models')
    .then(r => done()));

  it('should support CRUD by key', () => {
      let model;
      return cloud.post(keyUrl, common.genModel({}), schema)
        .then(r => model = r.body)
        .then(r => cloud.get(keyUrl, schema))
        .then(r => cloud.put(keyUrl, common.genModel({name: 'updatedName'}), schema))
        .then(r => cloud.delete(keyUrl));

  });

  after(done => { cloud.delete('elements/' + element.key).then(() => done()) });
});
