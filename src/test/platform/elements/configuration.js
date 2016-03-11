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
  before(done => cloud.post('elements', common.genElement({})).then(r => { element = r.body; done(); }));

  it('should support CRUD by key', () => {
    let config;
    return cloud.post('elements/' + element.key + '/configuration', common.genConfig({}), schema)
    .then(r => config = r.body)
    .then(r => cloud.get('elements/' + element.key + '/configuration', listSchema))
    .then(r => cloud.put('elements/' + element.key + '/configuration/' + config.key, common.genConfig({ description: "An updated Churros config" }), schema))
    .then(r => cloud.delete('elements/' + element.key + '/configuration/' + config.key));
  });

  after(done => { cloud.delete('elements/' + element.key).then(() => done()) });

});
