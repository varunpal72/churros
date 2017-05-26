'use strict';

const suite = require('core/suite');
const payload = require('./assets/orders');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('ecommerce', 'orders', { payload: payload }, (test) => {
  let id;
  test.should.supportSr();

  it.skip(`should allow PATCH for ${test.api}`, () => { //since no post for orders, patch is skipped
    return cloud.get(test.api)
      .then(r => id = r.body[0].id)
      .then(r => cloud.patch(`${test.api}/${id}`, payload));
  });

  it(`it should support GET ${test.api}/{id}/payments`, () => {
    return cloud.get(test.api)
      .then(r => id = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${id}/payments`));
  });

  it(`it should support GET ${test.api}/{id}/refunds`, () => {
    return cloud.get(`${test.api}/${id}/refunds`);
  });

  test
    .withName(`should support searching ${test.api} by created date`)
    .withOptions({ qs: { where: `date = '2018-03-22 16:22:25'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.created = '2018-03-22 16:22:25');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();

  test.should.supportPagination();

  test
    .withApi(`${test.api}/40/payments`)
      .should.supportPagination(40);

  test
    .withApi(`${test.api}/5/refunds`)
    .should.supportPagination(5);

});
