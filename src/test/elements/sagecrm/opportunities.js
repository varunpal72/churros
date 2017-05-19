'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/opportunities.json`);
const chakram = require('chakram');
const expect = chakram.expect;

suite.forElement('crm', 'opportunities', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "Oppo_Description": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportNextPagePagination(2);
  test.withName(`should support searching ${test.api} by Opportunity status`)
    .withOptions({ qs: { where: `Oppo_Status ='Won'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Oppo_Status = 'Won');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
