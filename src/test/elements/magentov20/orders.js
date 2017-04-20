'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const productPayload = require('./assets/products');
const payload = require('./assets/orders');

suite.forElement('ecommerce', 'orders', { payload: payload }, (test) => {
//test.should.supportPagination();

 it(`should allow CRUDS for ${test.api}`, () => {
   let attributeSetId,comments, sku, orderId,orderPutPayload,addressPayload,protectCode,baseTotalDue;
    return cloud.get(`/hubs/ecommerce/products-attribute-sets`)
      .then(r => {
       attributeSetId = r.body[0].id;
       productPayload.product.attribute_set_id = attributeSetId;
       productPayload.product.name= tools.random();
       productPayload.product.sku= "ce"+tools.randomInt();
      })
      .then(r => cloud.post(`/hubs/ecommerce/products`, productPayload))
      .then(r => {
        sku = r.body.sku;
        payload.cartItem.sku = sku;
     })
      .then(r => cloud.post(test.api, payload))
      .then(r => { orderId = r.body.id; protectCode = r.body.protect_code;baseTotalDue= r.body.base_total_due;  })
      .then(r => cloud.withOptions({ qs: { where: `protect_code='${protectCode}' AND base_total_due=${baseTotalDue}` } }).get(`/hubs/ecommerce/categories-attributes`))
      .then(r => cloud.get(`${test.api}/${orderId}`))
      .then(r =>{
         addressPayload = r.body.billing_address;
         addressPayload.firstname="ce-first";
         addressPayload.lastname="ce-last";
         orderPutPayload = {"entity":addressPayload};
      })
      .then(r => cloud.put(`${test.api}/${orderId}`,orderPutPayload))
      .then(r => cloud.get(test.api))
      .then(r => cloud.withOptions({ qs: { page: 1 , pageSize: 1 }}).get(test.api))
      .then(r => comments={"statusHistory": {"comment": "comments"}})
      .then(r => cloud.post(`${test.api}/${orderId}/comments`, comments))
      .then(r => cloud.get(`${test.api}/${orderId}/comments`))
      .then(r => cloud.post(`${test.api}/${orderId}/emails`, orderId))
      .then(r => cloud.post(`${test.api}/${orderId}/hold`, orderId))
      .then(r => cloud.get(`${test.api}/${orderId}/statuses`))
      .then(r => cloud.post(`${test.api}/${orderId}/unhold`, orderId))
      .then(r => cloud.post(`${test.api}/${orderId}/cancel`, orderId))
      .then(r => cloud.get(`/hubs/ecommerce/orders-items`))
      .then(r => cloud.get(`hubs/ecommerce/orders-items/${orderId}`))
      .then(r => cloud.delete(`/hubs/ecommerce/products/${sku}`))
      .then(r => cloud.delete(`${test.api}/${orderId}`));                        //internally mapped with POST/order{id}/cancel
  });
});
