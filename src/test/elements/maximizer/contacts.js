'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const contactPayload = require('./assets/contacts');
const addressbookentryPayload = require('./assets/addressbookentry');
const expect = require('chakram').expect;

suite.forElement('crm', 'contacts', (test) => {
  test.should.supportPagination('id');
  it('should allow CRUDS for /contacts', () => {
    let contactId;
    return cloud.post(`/hubs/crm/addressbook-entries`,addressbookentryPayload)
      .then(r => contactPayload.ParentKey = r.body.id)
      .then(r => cloud.post(test.api, contactPayload))
      .then(r => {
        contactId = r.body.Key;
        expect(r.body.LastName === contactPayload.LastName).to.not.be.empty;
      })
      .then(r => cloud.withOptions({ qs: { where: "LastName='LastName ABC'" } }).get(test.api))
      .then(r => {
        expect(r.body[0].LastName === contactPayload.LastName).to.not.be.empty;
      })
      .then(r => cloud.get(`${test.api}/${contactId}`))
      .then(r => cloud.patch(`${test.api}/${contactId}`, contactPayload))
      .then(r => {
        expect(r.body.LastName === contactPayload.LastName).to.not.be.empty;
      })
      .then(r => cloud.delete(`${test.api}/${contactId}`))
      .then(r => cloud.delete(`/hubs/crm/addressbook-entries/${contactPayload.ParentKey}`));
  });
});
