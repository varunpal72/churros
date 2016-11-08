'use strict';

const suite = require('core/suite');
const payload = require('./assets/addresses');
const cloud = require('core/cloud');

const updatePayload = () => ({
  "city": "Denton",
  "country_id": "US",
  "firstname": "up",
  "middlename": "DATE",
  "lastname": "theAddress",
  "postcode": "76201",
  "street": "123 Normal St.",
  "telephone": "1231231234"
});

suite.forElement('ecommerce', 'addresses', { payload: payload }, (test) => {
  it('should support CRUDS and pagination', () => {
    let customerId = -1;
    let addressId = -1;
    const options = { qs: { pageSize: 1, page: 1 } };
    return cloud.get(`/hubs/ecommerce/customers`)
      .then(r => customerId = r.body[0].id)
      .then(r => cloud.get(`/hubs/ecommerce/customers/${customerId}`))
      .then(r => cloud.post(`/hubs/ecommerce/customers/${customerId}/addresses`, payload))
      .then(r => addressId = r.body.id)
      .then(r => cloud.get(`/hubs/ecommerce/customers/${customerId}/addresses`))
      .then(r => cloud.get(`${test.api}/${addressId}`))
      .then(r => cloud.patch(`${test.api}/${addressId}`, updatePayload()))
      .then(r => cloud.withOptions(options).get(`/hubs/ecommerce/customers/${customerId}/addresses`))
      .then(r => cloud.delete(`${test.api}/${addressId}`));
  });
});
