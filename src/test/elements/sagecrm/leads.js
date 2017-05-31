'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/leads.json`);
const chakram = require('chakram');
const expect = chakram.expect;

suite.forElement('crm', 'leads', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "lead_personfirstname": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportNextPagePagination(2);
  test.should.supportCeqlSearch('Lead_LeadId');
  test.withName(`should support searching ${test.api} by lead status`)
    .withOptions({ qs: { where: `lead_status ='In Progress'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.lead_status = 'In Progress');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
