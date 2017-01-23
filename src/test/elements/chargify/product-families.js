'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const productsPayload = require('./assets/products');

suite.forElement('payment', 'product-families', (test) => {
  const payload = {
    "name": "churros name",
    "description": "churros description",
    "handle": tools.random()
  };
  test.should.return200OnGet();
  it(`should allow GET for ${test.api}/{productFamilyId}`, () => {
    let productFamilyId;
    const updatePayload = productsPayload;
    updatePayload.handle = tools.random();
    return cloud.post(`${test.api}`, payload)
      .then(r => cloud.get(`${test.api}`))
      .then(r => productFamilyId = r.body[0].product_family.id)
      .then(r => cloud.get(`${test.api}/${productFamilyId}`))
      .then(r => cloud.post(`${test.api}/${productFamilyId}/products`, updatePayload));
  });
  test.should.supportPagination();
});
