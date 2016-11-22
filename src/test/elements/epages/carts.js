'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload =require('./assets/carts');
const billingPayload ={
  "firstName" : tools.randomStr(),
  "lastName" : tools.randomStr(),
  "street" : tools.random(),
  "zipCode" : "87956",
  "city" : tools.randomStr(),
  "country" : "DE",
  "emailAddress" :tools.randomEmail()
};
const shippingPayload ={
  "firstName" : tools.randomStr(),
  "lastName" : tools.randomStr(),
  "street" : tools.random(),
  "zipCode" : "87956",
  "city" : tools.randomStr(),
  "country" : "DE",
  "emailAddress" :tools.randomEmail()
};

suite.forElement('crm', 'carts', { payload: payload }, (test) => {	
 it('should allow CR for carts then UD billing and shipping addresses and also create a order.', () => {
	 let cartId;
	 return cloud.get(`/hubs/crm/products`)
	  .then(r => payload.lineItems[0].productId =r.body[0].id)
	  .then(r => cloud.post(`${test.api}`,payload ))
	  .then(r => cartId = r.body.id)
	  .then(r => cloud.get(`${test.api}/${cartId}`))
	  .then(r => cloud.put(`${test.api}/${cartId}/billing-addresses`,billingPayload))
	  .then(r => cloud.put(`${test.api}/${cartId}/shipping-addresses`,shippingPayload))
          .then(r => cloud.delete(`${test.api}/${cartId}/shipping-addresses`))
	  .then(r => cloud.post(`${test.api}/${cartId}/orders`));
          //.then(r => cloud.delete(`${test.api}/${cartId}/billing-addresses`));

  });
});
