'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = () => ({
      "billing_address_id": 4,
      "store_id": 1,
      "base_adjustment": 0,
      "shipping_amount": 5,
      "base_shipping_amount": 5,
      "adjustment": 0,
      "grand_total": 5,
      "base_currency_code": "USD",
      "order_currency_code": "USD",
      "items": [
          {
              "weee_tax_applied_row_amount": 0,
              "weee_tax_row_disposition": 0,
              "row_total": 0,
              "order_item_id": 2,
              "base_weee_tax_row_disposition": 0,
              "parent_id": 1,
              "price": 0,
              "weee_tax_applied": "[]",
              "product_id": 1483,
              "base_price": 0,
              "name": "ce",
              "base_row_total": 0,
              "sku":tools.random()
          }
      ],
      "order_id": 2
});

const creditComment = (entity_id) => (
  {
    "entity": {
      "comment": "ce-comment",
      "entity_id": entity_id,
      "parent_id": 1
    }
  }
);


suite.forElement('ecommerce', 'credit-memos', { payload: payload() }, (test) => {
  test.should.supportCrs();
  test.should.supportPagination();
  test.withOptions({ qs: { where: `store_currency_code='USD'` }}).should.return200OnGet();

  it(`should allow CR for /hubs/ecommerce/credit-memos/{entity_id}/comments`, () => {
    let entity_id;
    return cloud.post(`/hubs/ecommerce/credit-memos`, payload())
      .then(r => entity_id = r.body.id)
      .then(r => cloud.post(`/hubs/ecommerce/credit-memos/${entity_id}/comments`, creditComment(entity_id)))
      .then(r => cloud.get(`/hubs/ecommerce/credit-memos/${entity_id}/comments`));
});

it(`should allow CR for /hubs/ecommerce/credit-memos/{entity_id}/emails`, () => {
  let entity_id;
  return cloud.post(`/hubs/ecommerce/credit-memos`, payload())
    .then(r => entity_id = r.body.id)
    .then(r => cloud.post(`/hubs/ecommerce/credit-memos/${entity_id}/emails`));
});
});
