'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('ecommerce', 'products', { payload: payload }, (test) => {
  let id;
  test.should.supportSr();

  it.skip(`should allow PATCH for ${test.api}`, () => { //Since no post for products, so directly using value
    return cloud.get(test.api)
      .then(r => id=r.body[0].id)
      .then(r => cloud.patch(`${test.api}/${id}`, payload));
  });

  it('it should support GET /hubs/ecommerce/orders', () => {
    return cloud.get('/hubs/ecommerce/orders')
      .then(r => id = r.body[0].items.categoryId);
  });
  test
    .withName(`should support searching ${test.api} by category`)
    .withOptions({ qs: { where: `category = 10756089` } }) //Since no delete for products, so directly using value of category
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.category === id);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();

  test.should.supportPagination();
});
