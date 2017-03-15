'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const provisioner = require('core/provisioner');
const noendpointElement = require('./assets/noendpoint_element.json');
const noendpointInstanceSchema = require('./assets/noendpoint_instance_schema.json');

const getElementId = (key) => {
  return cloud.get(`elements/${key}`)
    .then(r => r.body.id);
};

suite.forPlatform('elementbuilder', {}, (test) => {
  let createdNoendpoint;
  before(() => {
    return cloud.post('elements', noendpointElement)
      .then(r => createdNoendpoint = r.body);
  });

  it('should support creating an instance of multiple endpoint element', () => {
    let noendpointInstanceId;
    return provisioner.create('noendpoint', undefined, 'elements/noendpoint/instances')
      .then(r => noendpointInstanceId = r.body.id)
      .then(r => cloud.get(`/hubs/general/firstrequest`, (r) => {
        expect(r).to.have.schemaAnd200(noendpointInstanceSchema);
      }))
      .then(r => provisioner.delete(noendpointInstanceId, 'elements/noendpoint/instances'));
  });

  after(() => {
    return cloud.delete(`elements/${createdNoendpoint.id}`);
  });

});
