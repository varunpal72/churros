'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

const payload = () => (
  {
  "billing_address_id": 2,
  "base_shipping_amount": 5,
  "shipping_address_id": 1,
  "discount_amount": 0,
  "subtotal": 29,
  "base_discount_amount": 0,
  "items": [
      {
          "order_item_id": 1,
          "parent_id": 1,
          "price": 0,
          "product_id": 1420,
          "name": "ce",
          "sku": tools.random
      }
  ],
  "order_id": 1
});

const invoiceComment = (entity_id) => (
  {
    "entity": {
      "comment": "ce-comment",
      "entity_id": entity_id,
      "parent_id": 1
    }
  }
);


suite.forElement('ecommerce', 'invoices', { payload: payload() }, (test) => {
  let entity_id,updatedAt;
  test.should.supportCrs();
  test.should.supportPagination();
  it(`should allow CR for /hubs/ecommerce/invoices-comments`, () => {
    return cloud.post(`${test.api}`, payload())
      .then(r => { entity_id = r.body.id;
                  updatedAt = r.body.updated_at;})
      .then(r => cloud.post(`/hubs/ecommerce/invoices-comments`, invoiceComment(entity_id)))
      .then(r => cloud.get(`/hubs/ecommerce/invoices/${entity_id}/comments`));
});
test
 .withName(`should support searching ${test.api} by updated_at`)
 .withOptions({ qs: { where: `updated_at = '${updatedAt}'`} })
 .withValidation((r) => {
 expect(r).to.have.statusCode(200);
 const validValues = r.body.filter(obj => obj.updated_at = '${updatedAt}');
 expect(validValues.length).to.equal(r.body.length);
 }).should.return200OnGet();
 
 it(`should allow C for /hubs/ecommerce/invoices/{entity_id}/emails`, () => {
  return cloud.post(`/hubs/ecommerce/invoices`, payload())
    .then(r => entity_id = r.body.id)
    .then(r => cloud.post(`/hubs/ecommerce/invoices/${entity_id}/emails`));
});
});
