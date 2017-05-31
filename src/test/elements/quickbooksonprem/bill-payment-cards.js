'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'bill-payment-cards', null, (test) => {
  let id;
  it('should support S for /hubs/finance/bill-payment-cards', () => {
    return cloud.get(test.api)
      .then(r => {
        if (r.body.length > 0) {
          id = r.body[0].TxnID;
          cloud.get(`${test.api}/${id}`);
          cloud.delete(`${test.api}/${id}`);
        }
      });
  });
  test.should.supportPagination();
});
