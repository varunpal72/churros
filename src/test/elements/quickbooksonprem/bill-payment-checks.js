'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'bill-payment-checks', null, (test) => {
  it('should support SR and pagination for /hubs/finance/bill-payment-checks', () => {
    let id;
    return cloud.get(test.api)
      .then(r => id = r.body[0].TxnID)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`));
  });
});