'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
//const customerPayload = require('./assets/customers');


const createProducts = (productGroupId) => ({
  "product_group_id": productGroupId,
  "name": "Testsss",
  "code": "CE006"
});

suite.forElement('finance', 'products', createProducts(), (test) => {
  let productGroupId;
  let productId;
  it('Should create a product', () => {
    return cloud.get(test.api + '/groups')
      .then(r => productGroupId = r.body[0].id)
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(test.api + '/prices'))
      .then(r => cloud.post(test.api, createProducts(productGroupId)))
      .then(r => productId = r.body.id)
      .then(r => cloud.get(test.api + '/' + productId))
      //add this back in when we debug the 403 error
      //.then(r => cloud.post(test.api,createInvoices(customerId)))
      .then(r => cloud.delete(test.api + '/' + productId));
  });
  test.should.supportPagination();
  test.withApi(test.api +'/prices').should.supportPagination();
  test.withApi(test.api +'/groups').should.supportPagination();
  test.should.supportCeqlSearch('id');
});
