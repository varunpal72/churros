'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const moment = require('moment');
const newResource = require('./assets/newresource.json');

// Test for extending hubspot crm and invoking the extended resource
suite.forElement('crm', 'contacts-search', {}, (test) => {
  let newResourceId;
  // Add resource to
  before(() => cloud.post(`elements/hubspot/resources`, newResource)
    .then(r => newResourceId = r.body.id));

  //delete new/overide resource should work fine
  after(() => cloud.delete(`elements/hubspot/resources/${newResourceId}`));

  it('should test contacts-search', () => {
      const options = { qs: { where: "q='test'" } };
      return cloud.withOptions(options).get(`contacts-search`)
      .then(r => {
        expect(r.body).to.not.be.empty;
      });
  });
});
