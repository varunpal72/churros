'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = chakram.expect;

//skipping the test as pagination is not proper from element itself.
suite.forElement('finance', 'bill-payment-cards', null, (test) => {
  it.skip('should support SRD for /hubs/finance/bill-payment-cards', () => {
    let id;
    return cloud.get(test.api)
      .then(r => {
        expect(r.body).to.not.be.empty;
        id = r.body[0].TxnID;
      })
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });
  test.should.supportPagination();
});
