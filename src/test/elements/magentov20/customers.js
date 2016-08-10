'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = (customerGroupId, storeId) => ({
  "customer": {
    "group_id": customerGroupId,
    "email": tools.randomEmail(),
    "firstname": tools.random(),
    "lastname": tools.random(),
    "gender": 1,
    "store_id": storeId
  }
});

const customerPut = (customerGroupId, storeId) => ({
  "customer": {
    "group_id": customerGroupId,
    "email": tools.randomEmail(),
    "firstname": tools.random(),
    "lastname": tools.random(),
    "gender": 1,
    "store_id": storeId,
    "website_id": 1
  }
});

const customerGroup = () => ({
  "group": {
    "code": tools.random(),
    "tax_class_id": 3,
    "tax_class_name": "Retail Customer"
  }
});

suite.forElement('ecommerce', 'customers', { payload: payload() }, (test) => {
  test.should.return200OnGet();
  it(`should allow CRUD for ${test.api}`, () => {
    let customerGroupId, storeId, customerId;
    return cloud.post(`/hubs/ecommerce/customerGroups`, customerGroup())
      .then(r => customerGroupId = r.body.id)
      .then(r => cloud.get(`/hubs/ecommerce/stores`))
      .then(r => storeId = r.body[0].id)
      .then(r => cloud.post(`${test.api}`, payload(customerGroupId, storeId)))
      .then(r => customerId = r.body.id)
      .then(r => cloud.get(`${test.api}/${customerId}`))
      .then(r => cloud.patch(`${test.api}/${customerId}`, customerPut(customerGroupId, storeId)))
      .then(r => cloud.delete(`${test.api}/${customerId}`))
      .then(r => cloud.delete(`/hubs/ecommerce/customerGroups/${customerGroupId}`));
  });
  it(`should allow GET for ${test.api}/{customerId}/billingAddress`, () => {
    let customerGroupId, storeId, customerId;
    return cloud.post(`/hubs/ecommerce/customerGroups`, customerGroup())
      .then(r => customerGroupId = r.body.id)
      .then(r => cloud.get(`/hubs/ecommerce/stores`))
      .then(r => storeId = r.body[0].id)
      .then(r => cloud.post(`${test.api}`, payload(customerGroupId, storeId)))
      .then(r => customerId = r.body.id)
      .then(r => cloud.get(`${test.api}/${customerId}/billingAddress`))
      .then(r => cloud.delete(`${test.api}/${customerId}`))
      .then(r => cloud.delete(`/hubs/ecommerce/customerGroups/${customerGroupId}`));
  });
  it(`should allow GET for ${test.api}/{customerId}/shippingAddress`, () => {
    let customerGroupId, storeId, customerId;
    return cloud.post(`/hubs/ecommerce/customerGroups`, customerGroup())
      .then(r => customerGroupId = r.body.id)
      .then(r => cloud.get(`/hubs/ecommerce/stores`))
      .then(r => storeId = r.body[0].id)
      .then(r => cloud.post(`${test.api}`, payload(customerGroupId, storeId)))
      .then(r => customerId = r.body.id)
      .then(r => cloud.get(`${test.api}/${customerId}/shippingAddress`))
      .then(r => cloud.delete(`${test.api}/${customerId}`))
      .then(r => cloud.delete(`/hubs/ecommerce/customerGroups/${customerGroupId}`));
  });
  test.should.supportPagination();
});
