'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
const ordersPayload = require('./assets/orders');
const cloud = require('core/cloud');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const customersPayload = build({ EmailAddress: tools.randomEmail() });

suite.forElement('ecommerce', 'customers', { payload: customersPayload }, (test) => {
  const updatePayload = {
        "FirstName": tools.random()
  };
  
  test.withOptions({ churros: { updatePayload: updatePayload } }).should.supportCruds();
  test.withOptions({ qs: { where: 'LastModified>=\'9/10/2014\'' } }).should.return200OnGet();

});
