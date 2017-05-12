'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');
const tools = require('core/tools');
const chakram = require('chakram');
const expect = require('chakram').expect;
const build = (overrides) => Object.assign({}, payload, overrides);
const leadPayload = build({ lead_personfirstname: tools.random(), lead_personlastname: tools.random() });

suite.forElement('crm', 'leads', { payload: leadPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "lead_personfirstname": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportNextPagePagination(1);
  test.should.supportCeqlSearch('Lead_LeadId');


  test.withName(`should support searching ${test.api} by lead status`)
    .withOptions({ qs: { where: `lead_status ='In Progress'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.lead_status = 'In Progress');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
