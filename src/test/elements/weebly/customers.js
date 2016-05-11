'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
const cloud = require('core/cloud');
const tools = require('core/tools');

const customer = () => ({
  name: 'Churros Test',
  email: tools.randomEmail(),
  password:'password',
  send_welcome_message:false
});
const customerPatch = () => ({
  email : 'updated@cloud-elements.com'
});

suite.forElement('ecommerce', 'customers', { payload: payload }, (test) => {
  test.should.supportPagination();
  it('should allow CRUDS for /customers', () => {
    let customerId;
    return cloud.post(test.api, customer())
      .then(r => customerId = r.body.id)
      .then(r => cloud.get(test.api + '/' + customerId))
      .then(r => cloud.get(test.api + '?name = \'Churros Test\''))
      .then(r => cloud.patch(test.api + '/' + customerId, customerPatch()))
      .then(r => cloud.delete(test.api + '/' + customerId));
  });
});
