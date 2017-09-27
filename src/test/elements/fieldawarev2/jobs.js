'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/jobs');
const locationspayload = require('./assets/locations');
const customerPayload = require('./assets/customers');

suite.forElement('fsa', 'jobs', { payload: payload }, (test) => {
  // test.should.supportCrud();
  test.withOptions({
    qs: {
      page: 1,
      pageSize: 5,
      where: 'startDate=\'2016-09-01\' and endDate=\'2016-09-15\''
    }
  }).should.return200OnGet();

//terribly ugly
  it('should allow CRUD for /hubs/fsa/jobs', () => {
    let locationId;
    let customerId;
    return cloud.post('/hubs/fsa/customers', customerPayload)
    .then(r => customerId = r.body.id)
    .then(r => payload.customer.uuid = customerId)
    .then(r => locationspayload.customer.uuid = customerId)
    .then(r => cloud.post('/hubs/fsa/locations', locationspayload))
    .then(r => locationId = r.body.id)
    .then(r => payload.location.uuid = locationId)
    .then(r => payload.customer.uuid = customerId)
    .then(r => cloud.crud(test.api, payload))
    .then(r => cloud.delete('/hubs/fsa/locations/' + locationId))
    .catch(e => {
      return Promise.all([cloud.delete('/hubs/fsa/locations/' + locationId),
      cloud.delete('/hubs/fsa/customers/' + customerId)])
      .catch(() => console.log('failed ot delete location'))
      .then(() => {throw Error(e)})
    })
  });
});
