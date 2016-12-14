'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/carts');
const addressPayload = require('./assets/address');
const build = (overrides) => Object.assign({}, addressPayload, overrides);
const randomAddressPayload = build({ firstName: tools.randomStr(), lastName: tools.randomStr(), street: tools.random(), city: tools.randomStr(), emailAddress: tools.randomEmail() });

suite.forElement('ecommerce', 'carts', { payload: payload, skip: true }, (test) => {
  it(`should allow CR for ${test.api} and UD billing and shipping addresses then create the order.`, () => {
    let cartId;
    return cloud.get(`/hubs/ecommerce/products`)
      .then(r => payload.lineItems[0].productId = r.body[0].id)
      .then(r => cloud.post(`${test.api}`, payload))
      .then(r => cartId = r.body.id)
      .then(r => cloud.get(`${test.api}/${cartId}`))
      .then(r => cloud.put(`${test.api}/${cartId}/billing-addresses`, randomAddressPayload))
      .then(r => cloud.delete(`${test.api}/${cartId}/billing-addresses`))
      .then(r => cloud.put(`${test.api}/${cartId}/shipping-addresses`, randomAddressPayload))
      .then(r => cloud.delete(`${test.api}/${cartId}/shipping-addresses`))
      .then(r => cloud.put(`${test.api}/${cartId}/billing-addresses`, randomAddressPayload))
      .then(r => cloud.post(`${test.api}/${cartId}/orders`));
  });
});