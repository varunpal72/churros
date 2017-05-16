'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');

suite.forElement('ecommerce', 'transactions', (test) => {
  test.should.supportPagination();
  let id, createdAt;
  it(`should allow GET for ${test.api}`, () => {
  return cloud.get(`${test.api}`)
    .then(r => {
      if (r.body.length <= 0) {
        return;
      } else {
        id = r.body[0].id;
        createdAt = r.body[0].created_at;
        return cloud.get(`/hubs/ecommerce/transactions/${id}`);
      }
    });});
  if (id !== null) {
    test
      .withName(`should support searching ${test.api} by created_at`)
      .withOptions({ qs: { where: `created_at='${createdAt}'` } })
      .withValidation((r) => {
        expect(r).to.have.statusCode(200);
        const validValues = r.body.filter(obj => obj.created_at === '${createdAt}');
        expect(validValues.length).to.equal(r.body.length);
      }).should.return200OnGet();
  }
  test.should.supportPagination();
});
