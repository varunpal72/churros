'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/products');

suite.forElement('ecommerce', 'products', null, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite
  test.should.return200OnGet();
  test.should.supportPagination();
  test.should.return400OnPost();
  it('should support GET / and GET /{id}', () => {
    return cloud.get(test.api)
      .then(r => {
        return cloud.get(test.api + '/' + r.body[0].entity_id);
    });
});
});