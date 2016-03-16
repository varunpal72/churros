'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
const cloud = require('core/cloud');

const customerUpdate = () => ({
  "website": "www.cloud-elements.com"
});

suite.forElement('finance', 'customers', payload, (test) => {
  let customerId;
  it('Should support CRUDS with custom PATCH', () => {
    return cloud.post(test.api,payload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.get(test.api + '/' + customerId))
      .then(r => cloud.patch(test.api + '/' + customerId, customerUpdate()))
      .then(r => cloud.get(test.api))
      .then(r => cloud.delete(test.api + '/' + customerId));
  });
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});
