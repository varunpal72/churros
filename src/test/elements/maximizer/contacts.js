'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

const contactPayload = () => ({
  "LastName": "LastName ABC",
  "Type": "Contact"
});

suite.forElement('crm', 'contacts', (test) => {
  test.should.supportPagination('id');
  let parentId, contactId, req;
  it('should allow CRUDS for /contacts', () => {
    return cloud.get(`/hubs/crm/addressbook-entries`)
      .then(r => parentId = r.body[0].id)
      .then(r => req = contactPayload())
      .then(r => req.ParentKey = parentId)
      .then(r => cloud.post(`${test.api}`, req))
      .then(r => cloud.get(`${test.api}`))
      .then(r => contactId = r.body[0].Key)
      .then(r => cloud.get(`${test.api}/${contactId}`))
      .then(r => cloud.patch(`${test.api}/${contactId}`, {}))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});
