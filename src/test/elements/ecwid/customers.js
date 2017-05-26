'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('ecommerce', 'customers', (test) => {
  let id;
  test.should.supportSr();
  it(`it should support GET ${test.api}/{id}/orders `, () => {
    return cloud.get(test.api)
      .then(r => id = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${id}/orders`));
  });
  test
    .withName(`should support searching ${test.api} by customer_id`)
    .withOptions({ qs: { where: 'customer_id=987379423' } }) //negative testing
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.id = 987379423);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
  test.should.supportPagination();
  test
    .withApi(`${test.api}/35738262/orders`)
    .should.supportPagination();
});
