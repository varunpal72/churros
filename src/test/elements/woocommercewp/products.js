'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const expect = require('chakram').expect;
const payload = require('./assets/products');
const build = (overrides) => Object.assign({}, payload, overrides);
const productsPayload = build({ name: tools.random() });

suite.forElement('ecommerce', 'products', { payload: productsPayload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { pageSize: 1, page: 1 } }).withValidation((r) => {
    expect(r).to.have.statusCode(200);
    expect(r.body).to.have.lengthOf(1);
  }).should.return200OnGet();
  test.withOptions({ qs: { where: 'type = \'simple\'' } }).should.return200OnGet();
});