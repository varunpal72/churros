'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const payload = require('./assets/orders');
const refundsPayload = require('./assets/refunds');

suite.forElement('ecommerce', 'orders', { payload: payload }, (test) => {
  it('should create a order and then CRDS for a refunds', () => {
    let orderId;
    return cloud.post(test.api, payload)
      .then(r => orderId = r.body.id)
      .then(r => cloud.crds(`${test.api}/${orderId}/refunds`, refundsPayload))
      .then(r => cloud.get(`${test.api}/${orderId}/refunds`), { qs: { where: 'amount >= 10' } })
      .then(r => cloud.delete(`${test.api}/${orderId}`));
  });
  // unique is "id"
  test.should.supportPagination();
  test
  .withName(`should support searching ${test.api} by created_date`)
  .withOptions({ qs: { where: 'after = \'2016-04-28T21:58:25\'' } })
  .withValidation((r) => {
  expect(r).to.have.statusCode(200);
  const validValues = r.body.filter(obj => obj.date_created >='2016-04-28T21:58:25');
  expect(validValues.length).to.equal(r.body.length);
  });
});
