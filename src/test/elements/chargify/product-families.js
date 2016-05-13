'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('payment', 'product-families', (test) => {
  test.should.return200OnGet();
  it(`should allow GET for ${test.api}/{productFamilyId}`, () => {
    let productFamilyId;
    return cloud.get(`${test.api}`)
      .then(r => productFamilyId = r.body[0].product_family.id)
      .then(r => cloud.get(`${test.api}/${productFamilyId}`));
  });
  test.should.supportPagination();
});
