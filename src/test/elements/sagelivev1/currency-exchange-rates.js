'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const exchangeratePayload = tools.requirePayload(`${__dirname}/assets/currency-exchange-rates.json`);

suite.forElement('finance', 'currency-exchange-rates', { payload: exchangeratePayload }, (test) => {
  const options = {
    churros: {
      updatePayload: { "Rate": 1.46856 }
    }
  };
  before(() => cloud.get(`/hubs/finance/currencies`)
      .then(r => exchangeratePayload.Currency = r.body[0].id));
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Rate`)
    .withOptions({ qs: { where: `Rate  =1.4532` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Rate === 1.4532);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
