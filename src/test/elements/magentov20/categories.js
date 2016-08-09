'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = () => ({
  "category": {
     "name": tools.random(),
    "is_active": true,
    "position": 1,
    "level": 1,
    "children": "",
    "path": "1/2",
    "available_sort_by": [],
    "include_in_menu": true,
    "custom_attributes": [
      {
        "attribute_code": "display_mode",
        "value": "PRODUCTS"
      }
    ]
  }
});
const categoryProduct = (categoryId, position, sku) => ({
  "productLink": {
    "sku": sku,
    "position": position,
    "category_id": categoryId
  }
});
const categoryMove = (parentId) => ({
  "parentId": parentId,
  "afterId": 3
});
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

suite.forElement('ecommerce', 'categories', { payload: payload() }, (test) => {
  test.should.supportCruds();
  it(`should allow SR for /hubs/ecommerce/categories-attributes`, () => {
    return cloud.get(`/hubs/ecommerce/categories-attributes`)
      .then(r => cloud.get(`/hubs/ecommerce/categories-attributes/${r.body[0].attribute_code}`));
  });
  it(`should allow GET for /hubs/ecommerce/categories/attributes/{attributeCode}/options`, () => {
    return cloud.get(`/hubs/ecommerce/categories-attributes`)
      .then(r => cloud.get(`/hubs/ecommerce/categories-attributes/${r.body[0].attribute_code}/options`));
  });
  it(`should allow PATCH for /hubs/ecommerce/categories/{id}/move`, () => {
    let categoryId, parentId;
    return cloud.post(`/hubs/ecommerce/categories`, payload())
      .then(r => categoryId = r.body.id)
      .then(r => cloud.get(`/hubs/ecommerce/categories/${categoryId}`))
      .then(r => parentId = r.body.parent_id)
      .then(r => cloud.patch(`/hubs/ecommerce/categories/${categoryId}/move`, categoryMove(parentId)))
      .then(r => cloud.delete(`/hubs/ecommerce/categories/${categoryId}`));
  });
  it(`should allow CUDS for /hubs/ecommerce/categories/{id}/products`, () => {
    let categoryId, position, sku, attributeSetId;
    return cloud.post(`/hubs/ecommerce/categories`, payload())
      .then(r => categoryId = r.body.id)
      .then(r => cloud.get(`/hubs/ecommerce/categories/${categoryId}`))
      .then(r => position = r.body.position)
      .then(r => cloud.get(`/hubs/ecommerce/products-attribute-sets`))
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.post(`/hubs/ecommerce/products`, product(attributeSetId)))
      .then(r => sku = r.body.sku)
      .then(r => cloud.post(`/hubs/ecommerce/categories/${categoryId}/products`, categoryProduct(categoryId, position, sku)))
      .then(r => cloud.put(`/hubs/ecommerce/categories/${categoryId}/products`, categoryProduct(categoryId, position, sku)))
      .then(r => cloud.delete(`/hubs/ecommerce/categories/${categoryId}/products/${sku}`))
      .then(r => cloud.delete(`/hubs/ecommerce/categories/${categoryId}`));
  });
  test.should.supportPagination();
});
