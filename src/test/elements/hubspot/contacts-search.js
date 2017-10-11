'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const newResource = require('./assets/newResource.json');

// Test for extending hubspot crm and invoking the extended resource
suite.forElement('crm', 'contacts-search', {}, (test) => {
  let newResourceId;
  // Add resource to
  before(() => cloud.post(`elements/hubspot/resources`, newResource)
    .then(r => newResourceId = r.body.id));

  //delete new/overide resource should work fine
  after(() => cloud.delete(`elements/hubspot/resources/${newResourceId}`));

  it('should test newly added account resource contacts-search', () => {
      const options = { qs: { where: "q='churros'" } };
      return cloud.withOptions(options).get(`contacts-search`)
      .then(r => {
        expect(r.body).to.not.be.empty;
      });
  });
});
