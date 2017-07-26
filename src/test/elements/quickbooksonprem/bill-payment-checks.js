'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'bill-payment-checks', null, (test) => {
  let id, refno;
  it('should support SR and pagination for /hubs/finance/bill-payment-checks', () => {
    return cloud.get(test.api)
      .then(r => {
        id = r.body[0].TxnID;
        refno = r.body[0].RefNumber;
      })
      .then(r => cloud.withOptions({ qs: { where: `RefNumber='${refno}'` } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`));
  });
  it.skip('should DELETE for /hubs/finance/bill-payment-checks', () => {
    return cloud.delete(`${test.api}/${id}`);
  });
  test.should.supportPagination();
});
