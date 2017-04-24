'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

const shippingInformation = () => (
{ "addressInformation": {
   "shippingAddress": {
     "region": "MH",
     "region_id": 0,
     "country_id": "IN",
     "street": [
       "Chakala,Kalyan (e)"
     ],
     "company": "abc",
     "telephone": "1111111",
     "postcode": "12223",
     "city": "Mumbai",
     "firstname": "tani1",
     "lastname": "tani2",
     "email": "tani@tot.com",
     "prefix": "address_",
     "region_code": "MH",
     "sameAsBilling": 1
   },
   "billingAddress": {
     "region": "MH",
     "region_id": 0,
     "country_id": "IN",
     "street": [
       "Chakala,Kalyan (e)"
     ],
     "company": "abc",
     "telephone": "1111111",
     "postcode": "12223",
     "city": "Mumbai",
     "firstname": "Tyl",
     "lastname": "Tot",
     "email": "tyl@tot.com",
     "prefix": "address_",
     "region_code": "MH"
   },
   "shipping_method_code": "flatrate",
   "shipping_carrier_code": "flatrate"
 }}
 );

suite.forElement('ecommerce', 'carts',  (test) => {
  it(`should allow CR ${test.api}`, () => {
    let cartId;
    return cloud.post(`${test.api}`)
    .then(r => cartId = r.body.id)
    .then(r => cloud.get(`${test.api}/${cartId}`))
    .then(r => cloud.get(`${test.api}/${cartId}/payment-information`));
  });
  it(`should allow POST ${test.api}/{cartId}/product POST ${test.api}/{cartId}/shipping-information and POST ${test.api}/{cartId}/orders`, () => {
    let cartId,cartOrder,cartProduct,sku;
    return cloud.post(`${test.api}`)
    .then(r => cartId = r.body.id)
    .then(r => cloud.get(`/hubs/ecommerce/products`))
    .then(r =>{ sku = r.body[0].sku;
              cartProduct={"cartItem" : {"qty": 2, "sku": sku}} ;   })
    .then(r => cloud.post(`${test.api}/${cartId}/products`,cartProduct))
    .then(r => cloud.post(`${test.api}/${cartId}/shipping-information`,shippingInformation()))
    .then(r =>cartOrder={"paymentMethod" : {"method": "checkmo"}} )
    .then(r => cloud.post(`${test.api}/${cartId}/orders`,cartOrder));
  });
});
