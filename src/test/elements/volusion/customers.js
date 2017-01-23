'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
const ordersPayload = require('./assets/orders');
const cloud = require('core/cloud');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const customersPayload = build({ EmailAddress: tools.randomEmail() });

suite.forElement('ecommerce', 'customers', { payload: payload }, (test) => {

  it(`should support CRUDS for ${test.api}`, () => {
    let updatePayload = {
      "FirstName": tools.random()
    };
    let customerID;
    return cloud.post(test.api, customersPayload)
      .then(r => customerID = r.body.CustomerID)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `LastModified ='9/10/2014'` } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${customerID}`))
      .then(r => cloud.patch(`${test.api}/${customerID}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${customerID}`));
  });

  it(`should support GET for customers/customerID/orders`, () => {
    let customerID;
    return cloud.post(`/hubs/ecommerce/orders`, ordersPayload)
      .then(r => customerID = r.body.CustomerID)
      .then(r => cloud.get(`${test.api}/${customerID}/orders`));
  });
  test.should.supportNextPagePagination(1);
});
