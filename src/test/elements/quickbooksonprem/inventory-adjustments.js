'use strict';

const suite = require('core/suite');
const payload = require('./assets/inventory-adjustments');
const tools = require('core/tools');
const cloud = require('core/cloud');
const updatePayload = { "Name": tools.random()};

suite.forElement('finance', 'inventory-adjustments', { payload: payload }, (test) => {
  it('should support CRUDS, pagination for /hubs/finance/inventory-adjustments', () => {
    let id;
    return cloud.post(test.api, payload)
      .then(r => id = r.body.TxnID)
      .then(r => cloud.get(test.api))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });
});
