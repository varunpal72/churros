'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const product = (attributeSetId) => ({
  "product": {
    "name": tools.random(),
    "price": 100,
    "status": 1,
    "visibility": 4,
    "type_id": "simple",
    "weight": 150,
    "attribute_set_id": attributeSetId,
    "sku": tools.random()
  },
  "saveOptions": true
});

const productsStockItems = () => ({
  "stockItem": {
    "min_sale_qty": 1,
    "qty_increments": 0,
    "stock_status_changed_auto": 1,
    "is_in_stock": true,
    "show_default_notification_message": false,
    "use_config_max_sale_qty": true,
    "product_id": 2,
    "use_config_qty_increments": true,
    "notify_stock_qty": 1,
    "manage_stock": true,
    "item_id": 2,
    "min_qty": 0,
    "use_config_min_qty": true,
    "use_config_notify_stock_qty": true,
    "stock_id": 1,
    "use_config_backorders": true,
    "max_sale_qty": 10000,
    "backorders": 0,
    "qty": 2999,
    "use_config_enable_qty_inc": false,
    "is_decimal_divided": false,
    "enable_qty_increments": false,
    "is_qty_decimal": false,
    "use_config_manage_stock": true,
    "use_config_min_sale_qty": 1
  }
});

suite.forElement('ecommerce', 'stock-items', { skip: true }, (test) => {
  it(`should allow GET for ${test.api}/{sku}`, () => {
    let sku, attributeSetId;
    return cloud.get(`/hubs/ecommerce/products-attribute-sets`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.post(`/hubs/ecommerce/products`, product(attributeSetId)))
      .then(r => sku = r.body.sku)
      .then(r => cloud.get(`${test.api}/${sku}`))
      .then(r => cloud.delete(`/hubs/ecommerce/products/${sku}`));
  });

  it(`should allow GET for /stock-statuses/{sku}`, () => {
    let sku, attributeSetId;
    return cloud.get(`/hubs/ecommerce/products-attribute-sets`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.post(`/hubs/ecommerce/products`, product(attributeSetId)))
      .then(r => sku = r.body.sku)
      .then(r => cloud.get(`/hubs/ecommerce/stock-statuses/${sku}`))
      .then(r => cloud.delete(`/hubs/ecommerce/products/${sku}`));
  });
  it(`should allow PUT for /products/{sku}/stockItems/{itemId}`, () => {
    let sku, attributeSetId, itemId;
    return cloud.get(`/hubs/ecommerce/products-attribute-sets`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.post(`/hubs/ecommerce/products`, product(attributeSetId)))
      .then(r => sku = r.body.sku)
      .then(r => cloud.get(`${test.api}/${sku}`))
      .then(r => itemId = r.body.stock_id)
      .then(r => cloud.put(`/hubs/ecommerce/products/${sku}/stockItems/${itemId}`, productsStockItems()))
      .then(r => cloud.delete(`/hubs/ecommerce/products/${sku}`));
  });
  it(`should allow GET for ${test.api}/low-stock`, () => {
    return cloud.withOptions({ qs: { where: `scopeId = 1 and qty = 1` }}).get(`/hubs/ecommerce/stock-items/low-stock`);
  });
});
