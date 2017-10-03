'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/locations');
const customerPayload = require('./assets/customers');

suite.forElement('fsa', 'locations', { payload: payload }, (test) => {
  let customerId;
  before(() => {
    return cloud.post('/hubs/fsa/customers', customerPayload)
    .then(r => customerId = r.body.id)
    .then(r => payload.customer.uuid = customerId);
  });

  it('should allow CRUDS for /hubs/fsa/locations', () => cloud.cruds(test.api, payload));
  test.withOptions({qs:{pageSize: 20}}).should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('name');

  after(() => cloud.delete(`/hubs/fsa/customers/${customerId}`));

});
