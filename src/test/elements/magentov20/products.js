'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const chakram = require('chakram');

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
const productsAttributes = () => ({
  "attribute": {
    "is_wysiwyg_enabled": false,
    "is_html_allowed_on_front": false,
    "used_for_sort_by": true,
    "is_filterable": false,
    "is_filterable_in_search": false,
    "is_used_in_grid": false,
    "is_visible_in_grid": false,
    "is_filterable_in_grid": false,
    "position": 0,
    "apply_to": [],
    "is_searchable": "1",
    "is_visible_in_advanced_search": "1",
    "is_comparable": "0",
    "is_used_for_promo_rules": "0",
    "is_visible_on_front": "0",
    "used_in_product_listing": "1",
    "is_visible": true,
    "scope": "store",
    "attribute_code": tools.random(),
    "frontend_input": "text",
    "is_required": true,
    "options": [],
    "is_user_defined": false,
    "default_frontend_label": "Name",
    "backend_type": "varchar",
    "is_unique": "0",
    "frontend_class": "validate-length maximum-length-255",
    "validation_rules": []
  }
});
const productsAttributeSetsGroups = () => ({
  "group": {
    "attribute_group_id": "7",
    "attribute_group_name": "Product Details",
    "attribute_set_id": 4
  }
});
const productsWebsites = (sku) => ({
  "productWebsiteLink": {
    "sku": sku,
    "website_id": 1
  }
});
const productsOptionsPost = (sku) => ({
  "option": {
    "product_sku": sku,
    "price": 0,
    "max_characters": 0,
    "price_type": "fixed",
    "is_require": true,
    "title": "ChurrosTestPost",
    "type": "field",
    "sort_order": 0
  }
});
const productsOptionsPatch = (sku) => ({
  "option": {
    "product_sku": sku,
    "price": 0,
    "max_characters": 0,
    "price_type": "fixed",
    "option_id": 2,
    "is_require": true,
    "title": "ChurrosTestPatch",
    "type": "field",
    "sort_order": 0
  }
});
const customerGroup = () => ({
  "group": {
    "code": tools.random(),
    "tax_class_id": 3,
    "tax_class_name": "Retail Customer"
  }
});
const productsGroupPrices = () => ({
  "qty": "1",
  "price": "1"
});

suite.forElement('ecommerce', 'products', { payload: product() }, (test) => {
  test.should.return200OnGet();
  it(`should allow CRUDS for ${test.api}`, () => {
    let attributeSetId, sku;
    return cloud.get(`/hubs/ecommerce/products-attribute-sets`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.post(`${test.api}`, product(attributeSetId)))
      .then(r => sku = r.body.sku)
      .then(r => cloud.get(`${test.api}/${sku}`))
      .then(r => cloud.patch(`${test.api}/${sku}`, product(attributeSetId)))
      .then(r => cloud.delete(`${test.api}/${sku}`));
  });
  it(`should allow CRS for /hubs/ecommerce/products-options`, () => {
    let attributeSetId, sku, optionId;
    return cloud.get(`/hubs/ecommerce/products-attribute-sets`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.post(`${test.api}`, product(attributeSetId)))
      .then(r => sku = r.body.sku)
      .then(r => cloud.get(`${test.api}/${sku}/options`))
      .then(r => cloud.post(`/hubs/ecommerce/products-options`, productsOptionsPost(sku)))
      .then(r => optionId = r.body.option_id)
      .then(r => cloud.get(`${test.api}/${sku}/options/${optionId}`))
      .then(r => cloud.patch(`/hubs/ecommerce/products-options/${optionId}`, productsOptionsPatch(sku)))
      .then(r => cloud.delete(`${test.api}/${sku}`));
  });
  test.withApi(`/hubs/ecommerce/products-options-types`).should.return200OnGet();
  test.withApi(`/hubs/ecommerce/products-types`).should.return200OnGet();

  it(`should allow GET for /hubs/ecommerce/products-links-types`, () => {
    return cloud.get(`/hubs/ecommerce/products-links-types`)
      .then(r => cloud.get(`/hubs/ecommerce/products-links/${r.body.name}/attributes`));
  });
  it(`should allow CUD for /hubs/ecommerce/products/{sku}/websites`, () => {
    let attributeSetId, sku;
    let websiteId = 1;
    return cloud.get(`/hubs/ecommerce/products-attribute-sets`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.post(`${test.api}`, product(attributeSetId)))
      .then(r => sku = r.body.sku)
      .then(r => cloud.post(`/hubs/ecommerce/products/${sku}/websites`, productsWebsites(sku)))
      .then(r => cloud.put(`/hubs/ecommerce/products/${sku}/websites`, productsWebsites(sku)))
      .then(r => cloud.delete(`/hubs/ecommerce/products/${sku}/websites/${websiteId}`))
      .then(r => cloud.delete(`${test.api}/${sku}`));
  });
  it(`should allow GET for /hubs/ecommerce/products/{sku}/media`, () => {
    let attributeSetId, sku;
    return cloud.get(`/hubs/ecommerce/products-attribute-sets`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.post(`${test.api}`, product(attributeSetId)))
      .then(r => sku = r.body.sku)
      .then(r => cloud.get(`/hubs/ecommerce/products/${sku}/media`))
      .then(r => cloud.delete(`${test.api}/${sku}`));
  });
  it(`should allow CRD for /hubs/ecommerce/products/{sku}/group-prices/{customerGroupId}/tiers`, () => {
    let attributeSetId, sku, customerGroupId;
    let qty = 1;
    let price = 10;
    return cloud.get(`/hubs/ecommerce/products-attribute-sets`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.post(`${test.api}`, product(attributeSetId)))
      .then(r => sku = r.body.sku)
      .then(r => cloud.post(`/hubs/ecommerce/customer-groups`, customerGroup()))
      .then(r => customerGroupId = r.body.id)
      .then(r => cloud.post(`/hubs/ecommerce/products/${sku}/group-prices/${customerGroupId}/tiers`, productsGroupPrices()))
      .then(r => cloud.delete(`/hubs/ecommerce/products/${sku}/group-prices/${customerGroupId}/tiers/${qty}`))
      .then(r => cloud.delete(`/hubs/ecommerce/customer-groups/${customerGroupId}`))
      .then(r => cloud.delete(`${test.api}/${sku}`));
  });
  test.should.supportPagination();
});
