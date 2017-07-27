'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const productPayload = require('./assets/products');
const productsStockItems = require('./assets/productsStockItems');

suite.forElement('ecommerce', 'stock-items', (test) => {
  it(`should allow GET for ${test.api}/{sku}`, () => {
    let sku, attributeSetId;
    return cloud.get(`/hubs/ecommerce/products-attribute-sets`)
      .then(r => {
        attributeSetId = r.body[0].id;
        productPayload.product.attribute_set_id = attributeSetId;
        productPayload.product.name = tools.random();
        productPayload.product.sku = "sku" + tools.randomInt();
        productPayload.product.custom_attributes[0].value = tools.random();
      })
      .then(r => cloud.post(`/hubs/ecommerce/products`, productPayload))
      .then(r => sku = r.body.sku)
      .then(r => cloud.get(`${test.api}/${sku}`))
      .then(r => cloud.delete(`/hubs/ecommerce/products/${sku}`));
  });

  it(`should allow GET for /stock-statuses/{sku}`, () => {
    let sku, attributeSetId;
    return cloud.get(`/hubs/ecommerce/products-attribute-sets`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.post(`/hubs/ecommerce/products`, productPayload))
      .then(r => sku = r.body.sku)
      .then(r => cloud.get(`/hubs/ecommerce/stock-statuses/${sku}`))
      .then(r => cloud.delete(`/hubs/ecommerce/products/${sku}`));
  });
  it(`should allow PUT for /products/{sku}/stockItems/{itemId}`, () => {
    let sku, attributeSetId, itemId;
    return cloud.get(`/hubs/ecommerce/products-attribute-sets`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.post(`/hubs/ecommerce/products`, productPayload))
      .then(r => sku = r.body.sku)
      .then(r => cloud.get(`${test.api}/${sku}`))
      .then(r => itemId = r.body.stock_id)
      .then(r => cloud.put(`/hubs/ecommerce/products/${sku}/stockItems/${itemId}`, productsStockItems))
      .then(r => cloud.delete(`/hubs/ecommerce/products/${sku}`));
  });
  test
    .withName(`should support searching  ${test.api}/low-stock`)
    .withOptions({ qs: { where: `scopeId = 1 and qty = 0` } })
    .withApi(`${test.api}/low-stock`)
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = (r.body.filter(obj => obj.qty === 0));
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
