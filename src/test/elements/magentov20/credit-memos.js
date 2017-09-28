'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const CreditMemoPayload = tools.requirePayload(`${__dirname}/assets/creditMemos.json`);
const creditComment = tools.requirePayload(`${__dirname}/assets/Comment.json`);

suite.forElement('ecommerce', 'credit-memos', { payload: CreditMemoPayload }, (test) => {
  let entity_id;
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
    return cloud.post(`/hubs/ecommerce/credit-memos`, CreditMemoPayload)
      .then(r => {
        creditComment.entity.entity_id = r.body.id;
        entity_id = r.body.id;
          })
      .then(r => cloud.post(`/hubs/ecommerce/credit-memos/${entity_id}/comments`, creditComment))
      .then(r => cloud.get(`/hubs/ecommerce/credit-memos/${entity_id}/comments`));
  });

  it(`should allow C for /hubs/ecommerce/credit-memos/{entity_id}/emails`, () => {
    return cloud.post(`/hubs/ecommerce/credit-memos`, CreditMemoPayload)
      .then(r => entity_id = r.body.id)
      .then(r => cloud.post(`/hubs/ecommerce/credit-memos/${entity_id}/emails`));
  });
});
