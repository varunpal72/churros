'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
const cloud = require('core/cloud');

suite.forElement('ecommerce', 'customers', { payload: payload }, (test) => {
  test.should.return200OnGet();

  it('it should support GET by id', () => {
    return cloud.get('/hubs/ecommerce/customers')
    .then(r => r.body.filter(r => r.id))
    .then(filteredCustomers => cloud.get(`/hubs/ecommerce/customers/${filteredCustomers[0].id}`));
  });

  it('it should support GET orders by customer id', () => {
    return cloud.get('/hubs/ecommerce/customers')
    .then(r => r.body.filter(r => r.id))
    .then(filteredCustomers => cloud.get(`/hubs/ecommerce/customers/${filteredCustomers[0].id}/orders`));
  });
});
