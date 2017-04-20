'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

const product = (attributeSetId) => ({
  "product": {
      "attribute_set_id": attributeSetId,
      "name": tools.random(),
      "price": 300,
      "sku": "ce"+tools.randomInt(),
      "status": 1,
      "type_id": "simple",
      "visibility": 4,
    "custom_attributes": [
        {
          "attribute_code": "description",
          "value": tools.random()
        }]
    }});

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
    let attributeSetId,createdAt, sku;
    return cloud.get(`/hubs/ecommerce/products-attribute-sets`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.post(`${test.api}`, product(attributeSetId)))
      .then(r => {sku = r.body.sku; createdAt = r.body.created_at;})
      .then(r => cloud.withOptions({ qs: { where: `created_at= '${createdAt}'` } }).get(`${test.api}`))
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
        //  .then(r => cloud.delete(`${test.api}/${sku}/options/${optionId}`))            //No post so delete commented
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
    let entryId,sku;
    return cloud.get(`/hubs/ecommerce/products`)
      .then(r => sku = r.body[0].sku)
      .then(r => cloud.get(`${test.api}/${sku}/media`))
      .then(r => entryId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${sku}/media/${entryId}`))
    //  .then(r => cloud.delete(`${test.api}/${sku}/media/${entryId}`))    no post so no delete
      .then(r => cloud.delete(`${test.api}/${sku}`));
  });
  it(`should allow CRD for /hubs/ecommerce/products/{sku}/group-prices/{customerGroupId}/tiers`, () => {
    let attributeSetId, sku, customerGroupId;
    let qty = 1;
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
  it(`should allow GET for /hubs/ecommerce/products-media-types`, () => {
    let attributeSetName;
    return cloud.get(`/hubs/ecommerce/products-attribute-sets`)
        .then(r => attributeSetName = r.body[0].attribute_set_name)
        .then(r => cloud.get(`/hubs/ecommerce/products-media-types/${attributeSetName}`));
  });
  test.should.supportPagination();
});
