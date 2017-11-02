'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

const addressPayload = () => ({
  "City": "Kent",
  "StateProvince": "Ohio",
  "Country":"USA",
  "ZipCode":"44240"
});

suite.forElement('crm', 'addresses', (test) => {
  test.withOptions({ qs: { page: 1, pageSize: 5,  } }).should.supportPagination();
  let parentId, addressId, req;
  it('should allow CRUD for /addresses', () => {
    return cloud.get(`/hubs/crm/contacts`)
      .then(r => parentId = r.body[0].Key)
      .then(r => req = addressPayload())
      .then(r => req.ParentKey = parentId)
      .then(r => cloud.post(`${test.api}`, req))
      .then(r => cloud.get(`${test.api}`))
      .then(r => addressId = r.body[0].Address.Key)
      .then(r => cloud.patch(`${test.api}/${addressId}`, {}))
      .then(r => cloud.delete(`${test.api}/${addressId}`));
  });
});
