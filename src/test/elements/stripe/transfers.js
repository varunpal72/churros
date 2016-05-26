'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const updateTransfers = () => ({
  "description": tools.random()
});

suite.forElement('payment', 'transfers', (test) => {
  test.should.supportSr();
  it(`should allow PATCH for ${test.api}`, () => {
    let transferId;
    return cloud.get(`${test.api}`)
      .then(r => transferId = r.body[0].id)
      .then(r => cloud.patch(`${test.api}/${transferId}`,updateTransfers()));
  });
});
