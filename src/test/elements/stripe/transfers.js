'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/transfers');

const updateTransfers = () => ({
  "description": tools.random()
});

suite.forElement('payment', 'transfers', (test) => {
  test.should.supportSr();
  it(`should allow PATCH for ${test.api}`, () => {
    let transferId;
    return cloud.post(test.api, payload)
      .then(r => transferId = r.body.id)
      .then(r => cloud.patch(`${test.api}/${transferId}`, updateTransfers()))
      .then(r => cloud.withOptions({ qs: { where: `created >= 1463760971` } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { pageSize: 1 } }).get(test.api));
  });
  test.should.supportNextPagePagination(1);
});
