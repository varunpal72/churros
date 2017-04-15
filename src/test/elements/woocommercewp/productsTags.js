'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const payload = require('./assets/productsTags');

suite.forElement('ecommerce', 'products-tags', { payload: payload }, (test) => {
  test.should.supportCruds();
  // unique is "id"
  test.should.supportPagination();
  test
  .withName(`should support searching ${test.api} by slug`)
  .withOptions({ qs: { where: 'slug = \'leather-shoes\'' } })
  .withValidation((r) => {
  expect(r).to.have.statusCode(200);
  const validValues = r.body.filter(obj => obj.slug ==='leather-shoes');
  expect(validValues.length).to.equal(r.body.length);
  }).should.return200OnGet();
});
