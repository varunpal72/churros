'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const customerGroup = tools.requirePayload(`${__dirname}/assets/customerGroup.json`);

const payload = (customerGroupId, storeId) => ({
  "customer": {
    "group_id": customerGroupId,
    "email": "ce" + tools.randomInt() + "@gmail.com",
    "firstname": tools.random(),
    "lastname": tools.random(),
    "gender": 1,
    "store_id": storeId
  }
});

const customerPut = (customerGroupId, storeId) => ({
  "customer": {
    "group_id": customerGroupId,
    "email": "ce" + tools.randomInt() + "@gmail.com",
    "firstname": tools.random(),
    "lastname": tools.random(),
    "gender": 1,
    "store_id": storeId,
    "website_id": 1
  }
});

suite.forElement('ecommerce', 'customers', { payload: payload() }, (test) => {
  let customerGroupId, storeId, email, customerId;
  it(`should allow CRUD for ${test.api}`, () => {
    return cloud.post(`/hubs/ecommerce/customerGroups`, customerGroup)
      .then(r => customerGroupId = r.body.id)
      .then(r => cloud.get(`/hubs/ecommerce/stores`))
      .then(r => storeId = r.body[0].id)
      .then(r => cloud.post(test.api, payload(customerGroupId, storeId)))
      .then(r => {
        customerId = r.body.id;
        email = r.body.email;
      })
      .then(r => cloud.get(`${test.api}/${customerId}`))
      .then(r => cloud.patch(`${test.api}/${customerId}`, customerPut(customerGroupId, storeId)))
      .then(r => cloud.delete(`${test.api}/${customerId}`))
      .then(r => cloud.delete(`/hubs/ecommerce/customerGroups/${customerGroupId}`));
  });
  test
    .withName(`should support searching ${test.api} by email`)
    .withOptions({ qs: { where: `email='${email}'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.email === email);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
  it(`should allow GET for ${test.api}/{customerId}/billingAddress`, () => {
    return cloud.post(`/hubs/ecommerce/customerGroups`, customerGroup)
      .then(r => customerGroupId = r.body.id)
      .then(r => cloud.get(`/hubs/ecommerce/stores`))
      .then(r => storeId = r.body[0].id)
      .then(r => cloud.post(test.api, payload(customerGroupId, storeId)))
      .then(r => customerId = r.body.id)
      .then(r => cloud.get(`${test.api}/${customerId}/billingAddress`))
      .then(r => cloud.delete(`${test.api}/${customerId}`))
      .then(r => cloud.delete(`/hubs/ecommerce/customerGroups/${customerGroupId}`));
  });
  it(`should allow GET for ${test.api}/{customerId}/shippingAddress`, () => {
    return cloud.post(`/hubs/ecommerce/customerGroups`, customerGroup)
      .then(r => customerGroupId = r.body.id)
      .then(r => cloud.get(`/hubs/ecommerce/stores`))
      .then(r => storeId = r.body[0].id)
      .then(r => cloud.post(test.api, payload(customerGroupId, storeId)))
      .then(r => customerId = r.body.id)
      .then(r => cloud.get(`${test.api}/${customerId}/shippingAddress`))
      .then(r => cloud.delete(`${test.api}/${customerId}`))
      .then(r => cloud.delete(`/hubs/ecommerce/customerGroups/${customerGroupId}`));
  });
  test.should.supportPagination();
});
