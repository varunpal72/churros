'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const newResource = require('./assets/newresource.json');

// Test for extending hubspot crm and invoking the extended resource
suite.forElement('finance', 'customers-search', {}, (test) => {
  let newResourceId;
  // Add resource to
  before(() => cloud.post(`elements/quickbooks/resources`, newResource)
    .then(r => newResourceId = r.body.id));

  //delete new/overide resource should work fine
  after(() => cloud.delete(`elements/quickbooks/resources/${newResourceId}`));

  it('should test newly added account resource customers-search', () => {
      const options = { qs: { where: "q='test'" } };
      return cloud.withOptions(options).get(`customers-search`)
      .then(r => {
        expect(r.body).to.not.be.empty;
      });
  });
});
