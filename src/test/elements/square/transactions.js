'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const faker = require('faker');
const slocPayload = require('./assets/stransactionsPayload');
const capturePayload = require('./assets/capturePayload');
const transactionPayload = require('./assets/transactions');


suite.forElement('employee', 'locations', (test) => {
  test.should.supportPagination();
  it(`should allow RDS for /locations/:id/transactions`, () => {
    let transactionId, locId = slocPayload.lid;
    return cloud.withOptions({ qs: { where: "begin_time='2017-10-03T18:18:45Z'" } }).get(`${test.api}/${locId}/transactions`)
    .then(transactionPayload.idempotency_key = faker.random.uuid())
    .then(cloud.post(`${test.api}/${locId}/transactions`,transactionPayload))
    .then(r => transactionId = r.body.transaction.id)
    .then(cloud.get(`${test.api}/${locId}/transactions/${transactionId}`))
    .then(cloud.delete(`${test.api}/${locId}/transactions/${transactionId}`))
    .then(transactionPayload.idempotency_key = faker.random.uuid())
    .then(cloud.post(`${test.api}/${locId}/transactions`,transactionPayload))
    .then(r => transactionId = r.body.transaction.id)
    .then(cloud.post(`${test.api}/${locId}/transactions/${transactionId}/captures`,capturePayload));
  });
});
