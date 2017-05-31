'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const newResource = require('./assets/newResourcePost.json');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/contacts.json`);

// Test for extending zoho crm and invoking the extended resource
suite.forElement('crm', 'contacts-post', {skip: true}, (test) => {
  let newResourceId;
  // Add resource to
  before(() => cloud.post(`elements/zohocrm/resources`, newResource)
    .then(r => newResourceId = r.body.id));

  //delete new/overide resource should work fine
  after(() => cloud.delete(`elements/zohocrm/resources/${newResourceId}`));

  it('should test newly added account resource contacts-post', () => {
      return cloud.post(`contacts-post`, contactsPayload)
      .then(r => {
        expect(r.body).to.not.be.empty;
      });
  });
});
