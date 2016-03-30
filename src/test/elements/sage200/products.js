'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

const createProducts = (productGroupId) => ({
  "product_group_id": productGroupId,
  "name": "CE Product Test",
  "code": "CE006"
});

suite.forElement('finance', 'products', { payload: createProducts() }, (test) => {
  let productGroupId, productId;
  it('should create a product', () => {
    return cloud.get(test.api + '/groups')
      .then(r => productGroupId = r.body[0].id)
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(test.api + '/prices'))
      .then(r => cloud.post(test.api, createProducts(productGroupId)))
      .then(r => productId = r.body.id)
      .then(r => cloud.get(test.api + '/' + productId))
      .then(r => cloud.delete(test.api + '/' + productId));
  });
  test.should.supportPagination();
  test.withApi(test.api + '/prices').should.supportPagination();
  test.withApi(test.api + '/groups').should.supportPagination();
  test.withOptions({ qs: { where: 'date_time_updated>\'2015-10-22T16:40:09.563\'' } }).should.return200OnGet();
});
