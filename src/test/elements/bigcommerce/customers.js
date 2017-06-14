'use strict';

const suite = require('core/suite');
const addressPayload = require('./assets/address');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/customers.json`);
const faker = require('faker');

const customerUpdate = () => ({
  "last_name": "elements",
  "email": tools.randomEmail().toString()
});

const options = {
  churros: {
    updatePayload: customerUpdate()
  }
};

const addressUpdate = () => ({
  "zip": "12345"
});

const groupCreate = () => ({
  "name": faker.random.word(),
  "discount_rules": [{
    "type": "all",
    "method": "percent",
    "amount": 5.00
  }]
});

const groupUpdate = () => ({
  "name": "CE Discounts - Update"
});

suite.forElement('ecommerce', 'customers', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.withApi(`${test.api}/count`).should.return200OnGet();
  test.withOptions({ qs: { where: 'fetchShippingAddresses=\'true\'' } }).should.return200OnGet();
  test.should.supportPagination();
  test.should.supportCeqlSearch('email');
  it('should allow CRUDS for customer/addresses', () => {
    let customersId = -1;
    let addressId = -1;
    return cloud.post(test.api, payload)
      .then(r => customersId = r.body.id)
      .then(r => cloud.get(`${test.api}/${customersId}`))
      .then(r => cloud.get(`${test.api}/${customersId}/addresses`))
      .then(r => cloud.post(`${test.api}/${customersId}/addresses`, addressPayload))
      .then(r => addressId = r.body.id)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${customersId}/addresses`))
      .then(r => cloud.get(`${test.api}/${customersId}/addresses/${addressId}`))
      .then(r => cloud.patch(`${test.api}/${customersId}/addresses/${addressId}`, addressUpdate()))
      .then(r => cloud.delete(`${test.api}/${customersId}/addresses/${addressId}`))
      .then(r => cloud.delete(`${test.api}/${customersId}`));
  });
  it('should allow CRUDS for customer/groups and then GET customer/groups/count', () => {
    let groupId = -1;
    const createGroup = groupCreate()
    return cloud.post(`${test.api}/groups`, createGroup)
      .then(r => groupId = r.body.id)
      .then(r => cloud.get(`${test.api}/groups`))
      .then(r => cloud.get(`${test.api}/groups/${groupId}`))
      .then(r => cloud.withOptions({ qs: { where: `name='${createGroup.name}'` } }).get(`${test.api}/groups`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/groups`))
      .then(r => cloud.patch(`${test.api}/groups/${groupId}`, groupUpdate()))
      .then(r => cloud.get(`${test.api}/groups/${groupId}`))
      .then(r => cloud.delete(`${test.api}/groups/${groupId}`))
      .then(r => cloud.get(`${test.api}/groups/count`));
  });
});
