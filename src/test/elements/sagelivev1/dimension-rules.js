'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const dimensionRulesPayload = require('./assets/dimension-rules');
const prePayload = tools.requirePayload(`${__dirname}/assets/dimensions.json`);

suite.forElement('finance', 'dimension-rules', { payload: dimensionRulesPayload }, (test) => {
  let id;
  const options = {
    churros: {
      updatePayload: { "Multiplicity": "Multiple" }
    }
  };
  before(() => cloud.post(`/hubs/finance/dimensions`, prePayload)
    .then(r => {
      id = r.body.id;
      dimensionRulesPayload.Dimension = id;
    }));
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Multiplicity`)
    .withOptions({ qs: { where: `Multiplicity = 'Multiple'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Multiplicity === `Multiple`);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
  after(() => cloud.delete(`/hubs/finance/dimensions/${id}`));
});
