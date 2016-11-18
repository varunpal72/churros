'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload =require('./assets/orders');
const build = (overrides) => Object.assign({}, payload, overrides);
const orderPayload = build({value: tools.randomStr()});
const cartPayload ={
  "currency": "EUR",
  "taxType": "GROSS",
  "locale": "de_DE",
  "lineItems": [
    {
      "productId":"",
      "quantity": 1
    }
  ]
};
const billingPayload ={
  "firstName" : tools.randomStr(),
  "lastName" : tools.randomStr(),
  "street" : tools.random(),
  "zipCode" : "87956",
  "city" : tools.randomStr(),
  "country" : "DE",
  "emailAddress" :tools.randomEmail()
};
suite.forElement('crm', '', { payload: orderPayload }, (test) => {	

 it('should allow SRU for /hub/crm/orders', () => {
	 let id,cartId;
	 test.should.supportPagination();
	 return cloud.get(`${test.api}/products`)
	  .then(r => cartPayload.lineItems[0].productId =r.body[0].productId)
	  .then(r => cloud.post(`${test.api}/carts`,cartPayload ))
	  .then(r => cartId = r.body.cartId)
	  .then(r => cloud.put(`${test.api}/carts/${cartId}/billingAddress`,billingPayload))
	  .then(r => cloud.withOptions({qs : {cartId : `${cartId}`}}).post(`${test.api}/orders`))
	  .then(r => cloud.withOptions({ qs: { where: 'locale = \'en_US\'' } }).get(`${test.api}/orders`))
	  .then(r => id =r.body[0].id)
	  .then(r => cloud.get(`${test.api}/orders/${id}`))
	  .then(r => cloud.patch(`${test.api}/orders/${id}`,payload));
  });
});
