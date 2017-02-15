const payload = require('./assets/product.json');
const cloud = require('core/cloud');
const suite = require('core/suite');

suite.forElement('ecommerce', 'products', { payload: payload}, (test) => {
  it(`should allow CRUD for ${test.api}`, () => {
    let productid;
    return cloud.post(test.api, payload)
    .then(r => productid = r.body.ProductID)
    .then(r => cloud.get(test.api + '/' + productid))
    .then(r => cloud.patch(test.api + '/' + productid, payload))
    .then(r => cloud.delete(test.api + '/' + productid));

  });
});
