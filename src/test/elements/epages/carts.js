'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/carts');
const addressPayload = require('./assets/address');
const build = (overrides) => Object.assign({}, addressPayload, overrides);
const randomAddressPayload = build({ firstName: tools.randomStr(), lastName: tools.randomStr(), street: tools.random(), city: tools.randomStr(), emailAddress: tools.randomEmail() });

suite.forElement('ecommerce', 'carts', { payload: payload }, (test) => {
  it(`should allow CR for ${test.api} and UD billing and shipping addresses then create the order.`, () => {
    let cartId,epagesCartToken;
    return cloud.get(`/hubs/ecommerce/products`)
      .then(r => payload.lineItems[0].productId = r.body[0].id)
      .then(r => cloud.post(`${test.api}`, payload))
      .then(r => {
        cartId = r.body.id
        epagesCartToken = r.response.headers['x-epages-cart-token']
      })
      .then(r => cloud.withOptions({ qs: { cartToken: epagesCartToken } }).get(`${test.api}/${cartId}`))
      .then(r => cloud.withOptions({ qs: { cartToken: epagesCartToken } }).put(`${test.api}/${cartId}/billing-addresses`, randomAddressPayload))
      .then(r => cloud.withOptions({ qs: { cartToken: epagesCartToken } }).delete(`${test.api}/${cartId}/billing-addresses`))
      .then(r => cloud.withOptions({ qs: { cartToken: epagesCartToken } }).put(`${test.api}/${cartId}/shipping-addresses`, randomAddressPayload))
      .then(r => cloud.withOptions({ qs: { cartToken: epagesCartToken } }).delete(`${test.api}/${cartId}/shipping-addresses`))
      .then(r => cloud.withOptions({ qs: { cartToken: epagesCartToken } }).put(`${test.api}/${cartId}/billing-addresses`, randomAddressPayload))
      .then(r => cloud.withOptions({ qs: { cartToken: epagesCartToken } }).post(`${test.api}/${cartId}/orders`));
  });
});
