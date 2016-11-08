'use strict';

const suite = require('core/suite');
const updatePayload = require('./assets/products');
const cloud = require('core/cloud');
const tools = require('core/tools');

const payload = (randomSKU) => ({
  "type": "simple",
  "set": "4",
  "sku": randomSKU,
  "storeView": "default",
  "productData": {
    "name": "Super-Sweet Zipties",
    "description": "This is the test dis-crip for some sweet zipties",
    "short_description": "dis-crip",
    "weight": "10",
    "status": "Enabled",
    "url_key": "le-test",
    "url_path": "url path",
    "visibility": "Catalog, Search",
    "has_options": "0",
    "gift_message_available": "0",
    "price": "3.33",
    "special_price": "3.00",
    "special_from_date": "2016-05-04 20:50:52",
    "special_to_date": "2016-05-05 20:50:52",
    "tax_class_id": "Taxable Goods",
    "meta_title": "leTest",
    "meta_keyword": "test",
    "meta_description": "for le tests",
    "custom_design": "",
    "custom_layout_update": "",
    "options_container": "",
    "stock_data": {
      "qty": "5",
      "is_in_stock": 1,
      "manage_stock": 0,
      "use_config_manage_stock": 0,
      "min_qty": 0,
      "use_config_min_qty": 0,
      "min_sale_qty": 0,
      "use_config_min_sale_qty": 0,
      "max_sale_qty": "",
      "use_config_max_sale_qty": 0,
      "is_qty_decimal": 0,
      "backorders": 0,
      "use_config_backorders": 0,
      "notify_stock_qty": 0,
      "use_config_notify_stock_qty": 0
    }
  }
});

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
  it('should support CRUS and sub-resources', () => {
    let productId = -1;
    const options = { qs: { where: 'name=\'Super-Sweet Zipties\'' } };
    return cloud.post(test.api, payload(tools.random()))
      .then(r => productId = r.body.id)
      .then(r => cloud.get(`${test.api}/${productId}`))
      .then(r => cloud.patch(`${test.api}/${productId}`, updatePayload))
      .then(r => cloud.withOptions(options).get(test.api))
      .then(r => cloud.get(`${test.api}/${productId}/inventory`))
      .then(r => cloud.patch(`${test.api}/${productId}/inventory`, inventoryUpdate()));

  });
});
