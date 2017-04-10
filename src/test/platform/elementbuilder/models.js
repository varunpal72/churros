'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const provisioner = require('core/provisioner');
const oneModelElementJson = require('./assets/models/onemodel_element.json');

suite.forPlatform('element-model', {}, (test) => {
  let oneModelElement;
  let oneModelInstance;
  before(() => cloud.post('elements', oneModelElementJson)
      .then(r => oneModelElement = r.body)
      .then(r => provisioner.create('onemodel', undefined, 'elements/onemodel/instances'))
      .then(r => oneModelInstance = r.body));

  it('should support calling combined/merged metadata for instance', () => {
      return cloud.get(`/hubs/general/objects/contacts/metadata`, (r) => {
          expect(r.body).to.not.be.empty;
      });
  });

  after(() => {
    return provisioner.delete(oneModelInstance.id, 'elements/onemodel/instances')
        .then(r => cloud.delete(`elements/${oneModelElement.id}`));
  });
});
