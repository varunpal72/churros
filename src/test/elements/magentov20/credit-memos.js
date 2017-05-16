'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const CreditMemoPayload = require(`./assets/creditMemos`);
const creditComment = (entity_id) => ({
  "entity": {
    "comment": "ce-comment",
    "entity_id": entity_id,
    "parent_id": 1
  }
});

suite.forElement('ecommerce', 'credit-memos', { payload: CreditMemoPayload }, (test) => {
  CreditMemoPayload.items[0].sku = "sku" + tools.randomInt();
  test.should.supportCrs();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by store_currency_code`)
    .withOptions({ qs: { where: `store_currency_code='USD'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.store_currency_code === 'USD');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();

  it(`should allow CR for /hubs/ecommerce/credit-memos/{entity_id}/comments`, () => {
    let entity_id;
    return cloud.post(`/hubs/ecommerce/credit-memos`, CreditMemoPayload)
      .then(r => entity_id = r.body.id)
      .then(r => cloud.post(`/hubs/ecommerce/credit-memos/${entity_id}/comments`, creditComment(entity_id)))
      .then(r => cloud.get(`/hubs/ecommerce/credit-memos/${entity_id}/comments`));
  });

  it(`should allow C for /hubs/ecommerce/credit-memos/{entity_id}/emails`, () => {
    let entity_id;
    return cloud.post(`/hubs/ecommerce/credit-memos`, CreditMemoPayload)
      .then(r => entity_id = r.body.id)
      .then(r => cloud.post(`/hubs/ecommerce/credit-memos/${entity_id}/emails`));
  });
});
