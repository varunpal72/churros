'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/customers');

suite.forElement('ecommerce', 'customers', payload, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite

  test.should.return200OnGet();
  // test.should.supportCeqlSearch('id');
  test.should.supportPagination();
  it('should support GET / and GET /{id}', () => {
	return cloud.get(test.api)
  .then(r => cloud.get(test.api + '/' + r.body[0].id));
	});
});
