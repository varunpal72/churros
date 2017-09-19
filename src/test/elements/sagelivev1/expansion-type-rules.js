'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const expansionTypeRulesPayload = tools.requirePayload(`${__dirname}/assets/expansion-type-rules.json`);
const prePayload = tools.requirePayload(`${__dirname}/assets/expansion-types.json`);

suite.forElement('finance', 'expansion-type-rules', { payload: expansionTypeRulesPayload }, (test) => {
  let id;
  const options = {
    churros: {
      updatePayload: { "Value": "ce" }
    }
  };
  before(() => cloud.post(`/hubs/finance/expansion-types`, prePayload)
    .then(r => {
      id = r.body.id;
      expansionTypeRulesPayload.ExpansionType = r.body.id;
    }));
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === 'test');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
  after(() => cloud.delete(`/hubs/finance/expansion-types/${id}`));
});
