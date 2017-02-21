'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/payments');

suite.forElement('payment', 'payments', payload, (test) => {
  it('should support CRS,pagination and where /hubs/payment/payments ', () => {
    let id;
    return cloud.post(test.api, payload)
      .then(r => id = r.body.id)
      .then(r => cloud.get(test.api))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `start_time='2016-03-06T11:00:00Z'` } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`));
  });
});
