'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');

suite.forElement('ecommerce', 'products', null, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite
  test.should.return200OnGet();
  // test.should.supportCeqlSearch('id');
  test.should.supportPagination();
  test.should.return400OnPost();
});
