'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/customers.json`);
const ordersPayload = require('./assets/orders');
const cloud = require('core/cloud');

suite.forElement('ecommerce', 'customers', { payload: payload }, (test) => {
  const updatePayload = {
        "FirstName": tools.random()
  };

  test.withOptions({ churros: { updatePayload: updatePayload } }).should.supportCruds();
  test.withOptions({ qs: { where: 'LastModified>=\'9/10/2014\'' } }).should.return200OnGet();

  it(`should support GET for customers/customerID/orders`, () => {
    let customerID;
    return cloud.post(`/hubs/ecommerce/orders`, ordersPayload)
      .then(r => customerID = r.body.CustomerID)
      .then(r => cloud.get(`${test.api}/${customerID}/orders`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api));
  });

});
