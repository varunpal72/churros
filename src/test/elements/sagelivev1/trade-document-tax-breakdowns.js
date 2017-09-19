'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/trade-document-tax-breakdowns');
const update = tools.requirePayload(`${__dirname}/assets/updatePayload.json`);

suite.forElement('finance', 'trade-document-tax-breakdowns', { payload: payload ,skip:true}, (test) => {
  let id1;
  const options = {
    churros: {
      updatePayload: update
    }
  };
  before(() => cloud.get(`/hubs/finance/transactions`)
    .then(r => {
      payload.TradeDocument = r.body[0].id;
      id1 = r.body[0].id;
    }));
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='Test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === `Test`);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
