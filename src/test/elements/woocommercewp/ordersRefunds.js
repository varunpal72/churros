'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect= require('chakram').expect;
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

  test.withOptions({ qs: { pageSize: 1, page: 1 }}).withValidation((r) => { expect(r).to.have.statusCode(200);
                                                                           expect(r.body).to.have.lengthOf(1); }).should.return200OnGet();
});
