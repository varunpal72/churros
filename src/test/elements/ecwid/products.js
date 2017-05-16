'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('ecommerce', 'products', { payload: payload }, (test) => {
  let id;
  test.should.supportSr();

  it.skip('it should support PATCH', () => { //Since no post for products, so directly using value
    return cloud.get('/hubs/ecommerce/products')
      .then(r => r.body.filter(r => r.id))
      .then(filteredProducts => cloud.patch(`/hubs/ecommerce/products/${filteredProducts[0].id}`, payload));
  });

  it('it should support GET  by category', () => {
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
