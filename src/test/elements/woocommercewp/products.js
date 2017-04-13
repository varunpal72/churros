'use strict';

const tools = require('core/tools');
const expect = require('chakram').expect;
const suite = require('core/suite');
const payload = require('./assets/products');
const build = (overrides) => Object.assign({}, payload, overrides);
const productsPayload = build({ name: tools.random() });

suite.forElement('ecommerce', 'products', { payload: productsPayload }, (test) => {
  test.should.supportCruds();
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
