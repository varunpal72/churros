'use strict';

const suite = require('core/suite');
const updatePayload = require('./assets/productsUpdate');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/products.json`)

const inventoryUpdate = () => ({
  "qty": 1,
  "is_in_stock": 0,
  "manage_stock": 0,
  "use_config_manage_stock": 0,
  "min_qty": 0,
  "use_config_min_qty": 0,
  "min_sale_qty": 0,
  "use_config_min_sale_qty": 0,
  "max_sale_qty": 0,
  "use_config_max_sale_qty": 0,
  "is_qty_decimal": 0,
  "backorders": 0,
  "use_config_backorders": 0,
  "notify_stock_qty": 0,
  "use_config_notify_stock_qty": 0
});

suite.forElement('ecommerce', 'products', { payload: updatePayload }, (test) => {
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'created_at=\'2013-04-24 11:19:25\'' } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'created_at>=\'2013-04-24 11:19:25\'', pageSize: 5, page: 1 } }).should.return200OnGet();
  it(`should support CRUS ${test.api}, CU ${test.api}/:id/inventory and GET ${test.api}/:id/price-tier`, () => {
    let productId = -1;
    const options = { qs: { where: 'name=\'Super-Sweet Zipties\'' } };
    return cloud.post(test.api, payload)
      .then(r => productId = r.body.id)
      .then(r => cloud.get(`${test.api}/${productId}`))
      .then(r => cloud.patch(`${test.api}/${productId}`, updatePayload))
      .then(r => cloud.withOptions(options).get(test.api))
      .then(r => cloud.get(`${test.api}/${productId}/inventory`))
      .then(r => cloud.patch(`${test.api}/${productId}/inventory`, inventoryUpdate()))
      .then(r => cloud.get(`${test.api}/${productId}/price-tier`));
  });
});
