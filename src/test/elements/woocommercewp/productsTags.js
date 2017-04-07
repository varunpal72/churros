'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const payload = require('./assets/productsTags');

suite.forElement('ecommerce', 'products-tags', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { pageSize: 1, page: 1 } }).withValidation((r) => {
    expect(r).to.have.statusCode(200);
    expect(r.body).to.have.lengthOf(1);
  }).should.return200OnGet();
  test.withOptions({ qs: { where: 'context = \'view\'' } }).should.return200OnGet();
});