'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'bill-payment-cards', null, (test) => {
  let id;
  it.skip('should support SRD for /hubs/finance/bill-payment-cards', () => {
    let id;
    return cloud.get(test.api)
      .then(r => {
        expect(r.body).to.not.be.empty;
        id = r.body[0].TxnID;
        .then(r => cloud.get(`${test.api}/${id}`));
        .then(r => cloud.delete(`${test.api}/${id}`));
      });
  });
  test.should.supportPagination();
});
