'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const cloud = require('core/cloud');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const productsPayload = build({ ProductName: tools.random(), ProductCode: tools.random() });

suite.forElement('ecommerce', 'products', { payload: payload }, (test) => {

  it(`should support CRUDS for ${test.api}`, () => {
    let updatePayload = {
      "ProductDescription": tools.random()
    };
    let productID;
    return cloud.post(test.api, productsPayload)
      .then(r => productID = r.body.ProductID)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `LastModified='6/2/2011 4:43:00 PM'` } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${productID}`))
      .then(r => cloud.patch(`${test.api}/${productID}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${productID}`));
  });
  test.should.supportNextPagePagination(1);
});
