'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const addressPayload = require('./assets/addresses');

suite.forElement('crm', 'addresses', (test) => {
  test.should.supportPagination();
  it('should allow CRUD for /addresses', () => {
    let addressId;
    return cloud.get(`/hubs/crm/addressbook-entries`)
      .then(r => addressPayload.ParentKey = r.body[0].id)
      .then(r => cloud.post(test.api, addressPayload))
      .then(r => addressId = r.body.Key)
      .then(r => cloud.get(test.api))
      .then(r => cloud.patch(`${test.api}/${addressId}`, addressPayload))
      .then(r => cloud.delete(`${test.api}/${addressId}`));
  });
});
