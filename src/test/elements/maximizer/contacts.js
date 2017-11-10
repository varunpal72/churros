'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const contactPayload = require('./assets/contacts');

suite.forElement('crm', 'contacts', (test) => {
  test.should.supportPagination('id');
  it('should allow CRUDS for /contacts', () => {
    let contactId;
    return cloud.get(`/hubs/crm/addressbook-entries`)
      .then(r => contactPayload.ParentKey = r.body[0].id)
      .then(r => cloud.post(test.api, contactPayload))
      .then(r => contactId = r.body.Key)
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(`${test.api}/${contactId}`))
      .then(r => cloud.patch(`${test.api}/${contactId}`, contactPayload))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});
