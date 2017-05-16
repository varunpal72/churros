'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const shippingInformation = require('./assets/shippingInformation');

suite.forElement('ecommerce', 'carts', { payload: shippingInformation }, (test) => {
  let cartId;
  it(`should allow CR ${test.api}`, () => {
    return cloud.post(test.api)
      .then(r => cartId = r.body.id)
      .then(r => cloud.get(`${test.api}/${cartId}`))
      .then(r => cloud.get(`${test.api}/${cartId}/payment-information`));
  });
  it(`should allow POST ${test.api}/{cartId}/product POST ${test.api}/{cartId}/shipping-information and POST ${test.api}/{cartId}/orders`, () => {
    let cartProduct = { "cartItem": { "qty": 2, "sku": "sku" } },
      cartOrder = { "paymentMethod": { "method": "checkmo" } };
    return cloud.post(test.api)
      .then(r => cartId = r.body.id)
      .then(r => cloud.get(`/hubs/ecommerce/products`))
      .then(r => cartProduct.cartItem.sku = r.body[0].sku)
      .then(r => cloud.post(`${test.api}/${cartId}/products`, cartProduct))
      .then(r => cloud.post(`${test.api}/${cartId}/shipping-information`, shippingInformation))
      .then(r => cloud.post(`${test.api}/${cartId}/orders`, cartOrder));
  });
});
