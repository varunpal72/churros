'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const customer = (custom) => ({
  first_name: custom.firstName || 'Bill',
  last_name: custom.lastName || 'Murray',
  email: custom.email || tools.randomEmail()
});

suite.forElement('ecommerce', 'customers', { payload: customer({}) }, (test) => {
  test.should.supportCruds();
it(`should allow GET for /hubs/ecommerce/customers/{id}/order and /hubs/ecommerce/customers/{id}/abandoned-checkouts`, () => {
    let customertId;
    return cloud.post(test.api,customer({}))
    .then(r => customertId = r.body.id)
    .then(r => cloud.get(`${test.api}/${customertId}/orders`))
    .then(r => cloud.get(`${test.api}/${customertId}/abandoned-checkouts`))
    .then(r => cloud.delete(`${test.api}/${customertId}`));
  });
});
