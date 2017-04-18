'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const newResource = require('./assets/newresource.json');

// Test for extending zoho crm and invoking the extended resource
suite.forElement('crm', 'leads-search', {}, (test) => {
  let newResourceId;
  // Add resource to
  before(() => cloud.post(`elements/zohocrm/resources`, newResource)
    .then(r => newResourceId = r.body.id));

  //delete new/overide resource should work fine
  after(() => cloud.delete(`elements/zohocrm/resources/${newResourceId}`));

  it('should test newly added account resource leads-search', () => {
      return cloud.get(`leads-search`)
      .then(r => {
        expect(r.body).to.not.be.empty;
      });
  });
});
