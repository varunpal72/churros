'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const brandsPayload = require('./assets/brands');
const categoriesPayload = require('./assets/categories');
const fieldsPayload = require('./assets/fields');
const imagesPayload = require('./assets/images');
const skusPayload = require('./assets/skus');
const cloud = require('core/cloud');

const productsUpdate = () => ({
  "name": "Cloud Elements"
});

const options = {
  churros: {
    updatePayload: productsUpdate()
  }
};

const brandsUpdate = () => ({
  "search_keywords": "xmen, awesomeness"
});

const categoriesUpdate = () => ({
  "name": "X-Men toys"
});

const fieldsUpdate = () => ({
  "name": "cLoud Elephants",
  "text": "updating for the fans"
});

const imagesUpdate = () => ({
  "description": "Cloud Elements"
});

const skusUpdate = () => ({
  "upc": "Updated"
});

suite.forElement('ecommerce', 'products', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.withApi(`${test.api}/count`).should.return200OnGet();
  test.withApi(`${test.api}/options`).should.return200OnGet();
  test.withApi(`${test.api}/options`).withOptions({ qs: { page: 1, pageSize: 1 } }).should.return200OnGet();
  test.should.supportPagination();
  test.should.supportCeqlSearch('name');

  let productId = -1;
  before(() => cloud.post(test.api, payload)
    .then(r => productId = r.body.id)
    .then(r => cloud.patch(`${test.api}/${productId}`, categoriesUpdate()))
  );
  it('should support CRUDS for products/brands', () => {
    let brandId = -1;
    return cloud.post(`${test.api}/brands`, brandsPayload)
      .then(r => brandId = r.body.id)
      .then(r => cloud.get(`${test.api}/brands`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/brands`))
      .then(r => cloud.withOptions({ qs: { where: 'name=\'Xmen\'' } }).get(`${test.api}/brands`))
      .then(r => cloud.get(`${test.api}/brands/${brandId}`))
      .then(r => cloud.patch(`${test.api}/brands/${brandId}`, brandsUpdate()))
      .then(r => cloud.delete(`${test.api}/brands/${brandId}`));
  });
  it('should support CRUDS for products/categories', () => {
    let categoryId = -1;
    return cloud.post(`${test.api}/categories`, categoriesPayload)
      .then(r => categoryId = r.body.id)
      .then(r => cloud.get(`${test.api}/categories`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/categories`))
      .then(r => cloud.withOptions({ qs: { where: 'name=\'Xmen toys\'' } }).get(`${test.api}/categories`))
      .then(r => cloud.get(`${test.api}/categories/${categoryId}`))
      .then(r => cloud.patch(`${test.api}/categories/${categoryId}`, categoriesUpdate()))
      .then(r => cloud.delete(`${test.api}/categories/${categoryId}`));
  });
  it('should support CRUDS for products/fields', () => {
    let fieldId = -1;
    return cloud.post(`${test.api}/${productId}/fields`, fieldsPayload)
      .then(r => fieldId = r.body.id)
      .then(r => cloud.get(`${test.api}/${productId}/fields`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${productId}/fields`))
      .then(r => cloud.get(`${test.api}/${productId}/fields/${fieldId}`))
      .then(r => cloud.patch(`${test.api}/${productId}/fields/${fieldId}`, fieldsUpdate()))
      .then(r => cloud.delete(`${test.api}/${productId}/fields/${fieldId}`));
  });
  it('should support CRUDS for products/images', () => {
    let imageId = -1;
    return cloud.post(`${test.api}/${productId}/images`, imagesPayload)
      .then(r => imageId = r.body.id)
      .then(r => cloud.get(`${test.api}/${productId}/images`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${productId}/images`))
      .then(r => cloud.get(`${test.api}/${productId}/images/${imageId}`))
      .then(r => cloud.patch(`${test.api}/${productId}/images/${imageId}`, imagesUpdate()))
      .then(r => cloud.delete(`${test.api}/${productId}/images/${imageId}`));
  });
  it('should support CRUDS for products/skus', () => {
    let skuId = -1;
    return cloud.post(`${test.api}/${productId}/skus`, skusPayload)
      .then(r => skuId = r.body.id)
      .then(r => cloud.get(`${test.api}/${productId}/skus`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${productId}/skus`))
      .then(r => cloud.get(`${test.api}/${productId}/skus/${skuId}`))
      .then(r => cloud.patch(`${test.api}/${productId}/skus/${skuId}`, skusUpdate()))
      .then(r => cloud.withOptions({ qs: { where: 'upc=\'Updated\'' } }).get(`${test.api}/${productId}/skus`))
      .then(r => cloud.delete(`${test.api}/${productId}/skus/${skuId}`));
  });
  after(() => cloud.delete(`${test.api}/${productId}`));
});
